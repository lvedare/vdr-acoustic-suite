
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMovimentacaoEstoque } from '@/hooks/useMovimentacaoEstoque';
import { useProdutosAcabados } from '@/hooks/useSupabaseData';
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
  const [produtoSelecionado, setProdutoSelecionado] = useState(itemId || '');

  const { atualizarEstoqueProduto, atualizarEstoqueInsumo } = useMovimentacaoEstoque();
  const { data: produtos = [] } = useProdutosAcabados();

  const handleSalvar = async () => {
    if (!motivo || quantidade <= 0) {
      return;
    }

    try {
      if (tipo === 'produto') {
        await atualizarEstoqueProduto(produtoSelecionado, quantidade, tipoMovimentacao, motivo);
      } else {
        await atualizarEstoqueInsumo(produtoSelecionado, quantidade, tipoMovimentacao, motivo);
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
              <Label htmlFor="produto">
                {tipo === 'produto' ? 'Produto' : 'Insumo'}
              </Label>
              <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione o ${tipo}`} />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id.toString()}>
                      {produto.codigo} - {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {itemNome && (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{itemNome}</p>
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
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
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
            disabled={!motivo || quantidade <= 0 || (!itemId && !produtoSelecionado)}
          >
            Registrar Movimentação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
