
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Package, FileText } from 'lucide-react';
import { useProdutosAcabados } from '@/hooks/useProdutosAcabados';
import { useInsumos } from '@/contexts/InsumosContext';
import { useFornecedores } from '@/hooks/useFornecedores';
import { movimentacaoDetalhadaService } from '@/services/movimentacaoDetalhadaService';
import { toast } from 'sonner';

interface MovimentacaoEstoqueCentralDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ItemMovimentacao {
  id: string;
  tipo: 'produto' | 'insumo';
  produto_id?: string;
  insumo_id?: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  atualizar_preco: boolean;
}

export const MovimentacaoEstoqueCentralDialog = ({ 
  isOpen, 
  onOpenChange 
}: MovimentacaoEstoqueCentralDialogProps) => {
  const [tipoDocumento, setTipoDocumento] = useState<'entrada' | 'saida'>('entrada');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [dataDocumento, setDataDocumento] = useState(new Date().toISOString().split('T')[0]);
  const [fornecedorId, setFornecedorId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itens, setItens] = useState<ItemMovimentacao[]>([]);

  const { produtos } = useProdutosAcabados();
  const { insumos } = useInsumos();
  const { fornecedores } = useFornecedores();

  const adicionarItem = () => {
    const novoItem: ItemMovimentacao = {
      id: Date.now().toString(),
      tipo: 'produto',
      nome: '',
      quantidade: 1,
      valor_unitario: 0,
      valor_total: 0,
      atualizar_preco: false
    };
    setItens([...itens, novoItem]);
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const atualizarItem = (id: string, campo: string, valor: any) => {
    setItens(itens.map(item => {
      if (item.id === id) {
        const itemAtualizado = { ...item, [campo]: valor };
        
        // Se mudou tipo, limpar seleções anteriores
        if (campo === 'tipo') {
          itemAtualizado.produto_id = undefined;
          itemAtualizado.insumo_id = undefined;
          itemAtualizado.nome = '';
        }
        
        // Se selecionou produto/insumo, pegar o nome
        if (campo === 'produto_id') {
          const produto = produtos.find(p => p.id === valor);
          if (produto) {
            itemAtualizado.nome = produto.nome;
            itemAtualizado.insumo_id = undefined;
          }
        }
        
        if (campo === 'insumo_id') {
          const insumo = insumos.find(i => i.id === valor);
          if (insumo) {
            itemAtualizado.nome = insumo.nome;
            itemAtualizado.produto_id = undefined;
          }
        }
        
        // Recalcular valor total
        if (campo === 'quantidade' || campo === 'valor_unitario') {
          itemAtualizado.valor_total = itemAtualizado.quantidade * itemAtualizado.valor_unitario;
        }
        
        return itemAtualizado;
      }
      return item;
    }));
  };

  const valorTotal = itens.reduce((total, item) => total + item.valor_total, 0);

  const handleSalvar = async () => {
    if (itens.length === 0) {
      toast.error('Adicione pelo menos um item à movimentação');
      return;
    }

    try {
      const movimentacaoData = {
        numero_documento: numeroDocumento || undefined,
        tipo_documento: tipoDocumento === 'entrada' ? 'nota_fiscal_entrada' : 'nota_fiscal_saida',
        data_documento: dataDocumento,
        fornecedor_id: fornecedorId || undefined,
        valor_total: valorTotal,
        observacoes: observacoes || undefined,
        itens: itens.map(item => ({
          produto_id: item.produto_id,
          insumo_id: item.insumo_id,
          quantidade: tipoDocumento === 'saida' ? -item.quantidade : item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          atualizar_preco: item.atualizar_preco
        }))
      };

      await movimentacaoDetalhadaService.criarMovimentacao(movimentacaoData);
      
      toast.success('Movimentação criada com sucesso! Aguardando aprovação para aplicar no estoque.');
      
      // Reset form
      setNumeroDocumento('');
      setDataDocumento(new Date().toISOString().split('T')[0]);
      setFornecedorId('');
      setObservacoes('');
      setItens([]);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      toast.error('Erro ao criar movimentação');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Movimentação Central de Estoque
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho da movimentação */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select value={tipoDocumento} onValueChange={(value: 'entrada' | 'saida') => setTipoDocumento(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada (Nota Fiscal)</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Número do Documento</Label>
              <Input
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ex: NF 123456"
              />
            </div>

            <div className="space-y-2">
              <Label>Data do Documento</Label>
              <Input
                type="date"
                value={dataDocumento}
                onChange={(e) => setDataDocumento(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select value={fornecedorId} onValueChange={setFornecedorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((fornecedor) => (
                    <SelectItem key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de itens */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Itens da Movimentação</h3>
              <Button onClick={adicionarItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {itens.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-6 gap-3 flex-1">
                    <div className="space-y-1">
                      <Label className="text-xs">Tipo</Label>
                      <Select 
                        value={item.tipo} 
                        onValueChange={(value) => atualizarItem(item.id, 'tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="produto">Produto</SelectItem>
                          <SelectItem value="insumo">Insumo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <Label className="text-xs">
                        {item.tipo === 'produto' ? 'Produto' : 'Insumo'}
                      </Label>
                      <Select 
                        value={item.tipo === 'produto' ? item.produto_id : item.insumo_id} 
                        onValueChange={(value) => atualizarItem(item.id, item.tipo === 'produto' ? 'produto_id' : 'insumo_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Selecione o ${item.tipo}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.tipo === 'produto' 
                            ? produtos.map((produto) => (
                                <SelectItem key={produto.id} value={produto.id}>
                                  {produto.codigo} - {produto.nome}
                                </SelectItem>
                              ))
                            : insumos.map((insumo) => (
                                <SelectItem key={insumo.id} value={insumo.id}>
                                  {insumo.codigo} - {insumo.nome}
                                </SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Quantidade</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(item.id, 'quantidade', Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Valor Unit.</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.valor_unitario}
                        onChange={(e) => atualizarItem(item.id, 'valor_unitario', Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Total</Label>
                      <Input
                        type="text"
                        value={item.valor_total.toFixed(2)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {tipoDocumento === 'entrada' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`atualizar-preco-${item.id}`}
                      checked={item.atualizar_preco}
                      onCheckedChange={(checked) => atualizarItem(item.id, 'atualizar_preco', checked)}
                    />
                    <Label htmlFor={`atualizar-preco-${item.id}`} className="text-sm">
                      Atualizar preço do {item.tipo} com o valor unitário informado
                    </Label>
                  </div>
                )}
              </div>
            ))}

            {itens.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum item adicionado</p>
                <p className="text-sm">Clique em "Adicionar Item" para começar</p>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Digite observações sobre esta movimentação..."
            />
          </div>

          {/* Resumo */}
          {itens.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total da Movimentação:</span>
                <span className="text-lg font-bold">R$ {valorTotal.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {itens.length} {itens.length === 1 ? 'item' : 'itens'}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar}
            disabled={itens.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Criar Movimentação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
