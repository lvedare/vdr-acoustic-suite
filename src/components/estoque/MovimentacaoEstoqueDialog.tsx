
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMovimentacaoEstoque } from '@/hooks/useMovimentacaoEstoque';
import { useProdutosAcabados } from '@/hooks/useProdutosAcabados';
import { useInsumos } from '@/contexts/InsumosContext';
import { Package, Plus, Minus } from 'lucide-react';

interface MovimentacaoEstoqueDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'produto' | 'insumo';
  itemId?: string;
  itemNome?: string;
}

export const MovimentacaoEstoqueDialog = ({ 
  isOpen, 
  onOpenChange, 
  tipo, 
  itemId, 
  itemNome 
}: MovimentacaoEstoqueDialogProps) => {
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itemSelecionado, setItemSelecionado] = useState(itemId || '');

  const { atualizarEstoqueProduto, atualizarEstoqueInsumo } = useMovimentacaoEstoque();
  const { produtos } = useProdutosAcabados();
  const { insumos } = useInsumos();

  console.log('MovimentacaoEstoqueDialog - produtos carregados:', produtos);
  console.log('MovimentacaoEstoqueDialog - insumos carregados:', insumos);
  console.log('MovimentacaoEstoqueDialog - itemSelecionado:', itemSelecionado);

  // Encontrar o item selecionado para mostrar informações
  // Usar string comparison para todos os IDs
  const itemAtual = tipo === 'produto' 
    ? produtos.find(p => String(p.id) === String(itemSelecionado))
    : insumos.find(i => String(i.id) === String(itemSelecionado));

  console.log('MovimentacaoEstoqueDialog - itemAtual encontrado:', itemAtual);

  // Obter unidade de medida com propriedades corretas para cada tipo
  const unidadeMedida = itemAtual 
    ? tipo === 'produto' 
      ? itemAtual.unidade_medida 
      : (itemAtual as any).unidadeMedida || (itemAtual as any).unidade_medida
    : '';

  const handleSalvar = async () => {
    if (!motivo || quantidade <= 0 || !itemSelecionado) {
      console.error('Dados incompletos para movimentação:', {
        motivo,
        quantidade,
        itemSelecionado
      });
      return;
    }

    try {
      console.log('Registrando movimentação:', {
        tipo,
        itemId: itemSelecionado,
        quantidade,
        tipoMovimentacao,
        motivo,
        itemAtual
      });

      if (tipo === 'produto') {
        // Para produtos, usar o ID UUID diretamente do Supabase
        console.log('Atualizando estoque do produto:', itemSelecionado);
        await atualizarEstoqueProduto(String(itemSelecionado), quantidade, tipoMovimentacao, motivo);
      } else {
        // Para insumos, usar o ID UUID diretamente do Supabase  
        console.log('Atualizando estoque do insumo:', itemSelecionado);
        await atualizarEstoqueInsumo(String(itemSelecionado), quantidade, tipoMovimentacao, motivo);
      }

      // Reset form
      setQuantidade(1);
      setMotivo('');
      setObservacoes('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    }
  };

  const motivosComuns = [
    'Compra',
    'Venda',
    'Ajuste de inventário',
    'Perda/Avaria',
    'Transferência',
    'Produção',
    'Devolução'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Registrar Movimentação de Estoque
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!itemId && (
            <div className="space-y-2">
              <Label htmlFor="item">
                {tipo === 'produto' ? 'Produto' : 'Insumo'}
              </Label>
              <Select value={itemSelecionado} onValueChange={setItemSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione o ${tipo}`} />
                </SelectTrigger>
                <SelectContent>
                  {tipo === 'produto' 
                    ? produtos.map((produto) => (
                        <SelectItem key={produto.id} value={String(produto.id)}>
                          {produto.codigo} - {produto.nome} ({produto.unidade_medida})
                        </SelectItem>
                      ))
                    : insumos.map((insumo) => (
                        <SelectItem key={insumo.id} value={String(insumo.id)}>
                          {insumo.codigo} - {insumo.nome} ({(insumo as any).unidadeMedida || (insumo as any).unidade_medida})
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
          )}

          {(itemNome || itemAtual) && (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{itemNome || itemAtual?.nome}</p>
              {unidadeMedida && (
                <p className="text-sm text-muted-foreground">Unidade: {unidadeMedida}</p>
              )}
              {itemAtual && (
                <p className="text-sm text-muted-foreground">
                  Estoque atual: {
                    tipo === 'produto' 
                      ? itemAtual.quantidade_estoque 
                      : (itemAtual as any).quantidadeEstoque || (itemAtual as any).quantidade_estoque || 0
                  } {unidadeMedida}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select value={tipoMovimentacao} onValueChange={(value: 'entrada' | 'saida') => setTipoMovimentacao(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-600" />
                      Entrada
                    </div>
                  </SelectItem>
                  <SelectItem value="saida">
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-red-600" />
                      Saída
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">
                Quantidade {unidadeMedida && `(${unidadeMedida})`}
              </Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                step="0.01"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivosComuns.map((motivoItem) => (
                  <SelectItem key={motivoItem} value={motivoItem}>
                    {motivoItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Digite observações adicionais..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar}
            disabled={!motivo || quantidade <= 0 || (!itemId && !itemSelecionado)}
          >
            Registrar Movimentação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
