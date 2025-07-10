
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFornecedores } from '@/hooks/useFornecedores';
import { insumoFornecedorService } from '@/services/insumoFornecedorService';

interface InsumoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  insumoAtual: any;
  novoInsumo: any;
  setNovoInsumo: (insumo: any) => void;
  onSalvar: () => void;
  categorias: string[];
}

interface FornecedorInsumo {
  id: string;
  fornecedor_id: string;
  preco_unitario: number;
  prazo_entrega: number;
  observacoes: string;
}

export const InsumoDialog = ({ 
  isOpen, 
  onOpenChange, 
  insumoAtual, 
  novoInsumo, 
  setNovoInsumo, 
  onSalvar, 
  categorias 
}: InsumoDialogProps) => {
  const [fornecedoresInsumo, setFornecedoresInsumo] = useState<FornecedorInsumo[]>([]);
  const { fornecedores } = useFornecedores();

  useEffect(() => {
    if (insumoAtual && isOpen) {
      // Carregar fornecedores do insumo
      loadFornecedoresInsumo();
    } else if (!insumoAtual) {
      // Reset para novo insumo
      setFornecedoresInsumo([]);
    }
  }, [insumoAtual, isOpen]);

  const loadFornecedoresInsumo = async () => {
    if (insumoAtual?.id) {
      try {
        const data = await insumoFornecedorService.listarPorInsumo(insumoAtual.id);
        setFornecedoresInsumo(data.map(item => ({
          id: item.id,
          fornecedor_id: item.fornecedor_id,
          preco_unitario: item.preco_unitario,
          prazo_entrega: item.prazo_entrega || 0,
          observacoes: item.observacoes || ''
        })));
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      }
    }
  };

  const adicionarFornecedor = () => {
    if (fornecedoresInsumo.length >= 3) {
      toast.error('Máximo de 3 fornecedores por insumo');
      return;
    }

    setFornecedoresInsumo([...fornecedoresInsumo, {
      id: Date.now().toString(),
      fornecedor_id: '',
      preco_unitario: 0,
      prazo_entrega: 0,
      observacoes: ''
    }]);
  };

  const removerFornecedor = (id: string) => {
    setFornecedoresInsumo(fornecedoresInsumo.filter(f => f.id !== id));
  };

  const atualizarFornecedor = (id: string, campo: string, valor: any) => {
    setFornecedoresInsumo(fornecedoresInsumo.map(f => 
      f.id === id ? { ...f, [campo]: valor } : f
    ));
  };

  const handleSalvar = async () => {
    try {
      // Salvar insumo primeiro
      await onSalvar();

      // Se tem fornecedores e o insumo foi salvo, salvar fornecedores
      if (fornecedoresInsumo.length > 0) {
        const insumoId = insumoAtual?.id || novoInsumo.id;
        if (insumoId) {
          const fornecedoresValidos = fornecedoresInsumo.filter(f => 
            f.fornecedor_id && f.preco_unitario > 0
          );

          if (fornecedoresValidos.length > 0) {
            await insumoFornecedorService.salvarFornecedores(insumoId, fornecedoresValidos);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const custoMedio = fornecedoresInsumo.length > 0 
    ? fornecedoresInsumo.reduce((acc, f) => acc + f.preco_unitario, 0) / fornecedoresInsumo.length 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{insumoAtual ? "Editar Insumo" : "Novo Insumo"}</DialogTitle>
          <DialogDescription>
            {insumoAtual ? "Edite as informações do insumo" : "Preencha as informações do novo insumo"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basico">Informações Básicas</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={novoInsumo.codigo}
                  onChange={(e) => setNovoInsumo({ ...novoInsumo, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoInsumo.nome}
                  onChange={(e) => setNovoInsumo({ ...novoInsumo, nome: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={novoInsumo.descricao}
                onChange={(e) => setNovoInsumo({ ...novoInsumo, descricao: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={novoInsumo.categoria}
                  onValueChange={(value) => setNovoInsumo({ ...novoInsumo, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidadeMedida">Unidade de Medida *</Label>
                <Select
                  value={novoInsumo.unidadeMedida}
                  onValueChange={(value) => setNovoInsumo({ ...novoInsumo, unidadeMedida: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade</SelectItem>
                    <SelectItem value="m">Metro</SelectItem>
                    <SelectItem value="m²">Metro Quadrado</SelectItem>
                    <SelectItem value="m³">Metro Cúbico</SelectItem>
                    <SelectItem value="kg">Quilograma</SelectItem>
                    <SelectItem value="l">Litro</SelectItem>
                    <SelectItem value="pç">Peça</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorCusto">Valor de Custo</Label>
                <Input
                  id="valorCusto"
                  type="number"
                  step="0.01"
                  value={novoInsumo.valorCusto}
                  onChange={(e) => setNovoInsumo({ ...novoInsumo, valorCusto: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidadeEstoque">Quantidade em Estoque</Label>
                <Input
                  id="quantidadeEstoque"
                  type="number"
                  value={novoInsumo.quantidadeEstoque}
                  onChange={(e) => setNovoInsumo({ ...novoInsumo, quantidadeEstoque: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM</Label>
                <Input
                  id="ncm"
                  value={novoInsumo.ncm || ''}
                  onChange={(e) => setNovoInsumo({ ...novoInsumo, ncm: e.target.value })}
                  placeholder="0000.00.00"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="podeSerRevendido"
                checked={novoInsumo.podeSerRevendido}
                onCheckedChange={(checked) => setNovoInsumo({ ...novoInsumo, podeSerRevendido: checked })}
              />
              <Label htmlFor="podeSerRevendido">Pode ser revendido</Label>
            </div>

            {custoMedio > 0 && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Custo Médio Calculado: R$ {custoMedio.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600">
                  Baseado na média dos preços dos fornecedores
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fornecedores" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Fornecedores (máx. 3)</h3>
              <Button 
                onClick={adicionarFornecedor} 
                size="sm"
                disabled={fornecedoresInsumo.length >= 3}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fornecedor
              </Button>
            </div>

            {fornecedoresInsumo.map((fornecedorItem) => (
              <div key={fornecedorItem.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Fornecedor</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerFornecedor(fornecedorItem.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Fornecedor</Label>
                    <Select 
                      value={fornecedorItem.fornecedor_id} 
                      onValueChange={(value) => atualizarFornecedor(fornecedorItem.id, 'fornecedor_id', value)}
                    >
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

                  <div className="space-y-1">
                    <Label className="text-xs">Preço Unitário</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fornecedorItem.preco_unitario}
                      onChange={(e) => atualizarFornecedor(fornecedorItem.id, 'preco_unitario', Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Prazo Entrega (dias)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={fornecedorItem.prazo_entrega}
                      onChange={(e) => atualizarFornecedor(fornecedorItem.id, 'prazo_entrega', Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Observações</Label>
                    <Input
                      value={fornecedorItem.observacoes}
                      onChange={(e) => atualizarFornecedor(fornecedorItem.id, 'observacoes', e.target.value)}
                      placeholder="Observações sobre este fornecedor"
                    />
                  </div>
                </div>
              </div>
            ))}

            {fornecedoresInsumo.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum fornecedor cadastrado</p>
                <p className="text-sm">Adicione fornecedores para calcular o custo médio</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>{insumoAtual ? "Salvar Alterações" : "Adicionar Insumo"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
