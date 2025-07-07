import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { ComposicaoProduto, formatCurrency } from "@/types/orcamento";
import { ProdutoAcabado } from "@/types/orcamento";
import { useInsumos } from "@/contexts/InsumosContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { composicaoProdutoService } from "@/services/composicaoProdutoService";
import { toast } from "sonner";
import { useComposicaoProduto } from "@/hooks/useComposicaoProduto";
import { useQueryClient } from '@tanstack/react-query';

interface ComposicaoProdutoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  produtoAtual: ProdutoAcabado | null;
  composicaoAtual: ComposicaoProduto | null;
  setComposicaoAtual: React.Dispatch<React.SetStateAction<ComposicaoProduto | null>>;
  onSalvar: () => void;
  calcularValorTotal: (composicao: ComposicaoProduto) => number;
}

export function ComposicaoProdutoDialog({
  isOpen,
  onOpenChange,
  produtoAtual,
  composicaoAtual,
  setComposicaoAtual,
  onSalvar,
  calcularValorTotal
}: ComposicaoProdutoDialogProps) {
  const { insumos } = useInsumos();
  const queryClient = useQueryClient();
  const [insumoSelecionado, setInsumoSelecionado] = useState<number | null>(null);
  const [quantidadeInsumo, setQuantidadeInsumo] = useState<number>(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Buscar composições existentes do produto
  const { data: composicoesExistentes, isLoading: loadingComposicoes } = useComposicaoProduto(
    produtoAtual?.id?.toString() || null
  );

  // Carregar composições existentes quando o diálogo abrir
  useEffect(() => {
    if (isOpen && produtoAtual && composicoesExistentes && composicoesExistentes.length > 0) {
      console.log('Carregando composições existentes:', composicoesExistentes);
      
      const insumosCarregados = composicoesExistentes.map((comp: any) => {
        const insumoInfo = comp.insumo || insumos.find(i => i.id.toString() === comp.insumo_id);
        return {
          id: parseInt(comp.id),
          insumoId: parseInt(comp.insumo_id),
          nome: insumoInfo?.nome || 'Insumo não encontrado',
          quantidade: comp.quantidade,
          valorUnitario: insumoInfo?.valorCusto || 0,
          valorTotal: comp.quantidade * (insumoInfo?.valorCusto || 0)
        };
      });

      const composicaoCarregada = {
        produtoId: produtoAtual.id,
        insumos: insumosCarregados,
        maoDeObra: {
          fabricacao: 0,
          instalacao: 0
        },
        despesaAdministrativa: 10,
        margemVenda: 30
      };

      setComposicaoAtual(composicaoCarregada);
    } else if (isOpen && produtoAtual && (!composicoesExistentes || composicoesExistentes.length === 0)) {
      // Se não há composições existentes, criar uma vazia
      const composicaoVazia = {
        produtoId: produtoAtual.id,
        insumos: [],
        maoDeObra: {
          fabricacao: 0,
          instalacao: 0
        },
        despesaAdministrativa: 10,
        margemVenda: 30
      };
      setComposicaoAtual(composicaoVazia);
    }
  }, [isOpen, produtoAtual, composicoesExistentes, insumos, setComposicaoAtual]);

  if (!produtoAtual || !composicaoAtual) return null;

  const handleAddInsumo = () => {
    if (!insumoSelecionado) return;

    const insumoSelecionadoObj = insumos.find(i => i.id === insumoSelecionado);
    if (!insumoSelecionadoObj) return;

    const valorTotal = insumoSelecionadoObj.valorCusto * quantidadeInsumo;
    
    const novoInsumo = {
      id: Date.now(),
      insumoId: insumoSelecionadoObj.id,
      nome: insumoSelecionadoObj.nome,
      quantidade: quantidadeInsumo,
      valorUnitario: insumoSelecionadoObj.valorCusto,
      valorTotal
    };
    
    const composicaoAtualizada = {
      ...composicaoAtual,
      insumos: [...composicaoAtual.insumos, novoInsumo]
    };
    
    setComposicaoAtual(composicaoAtualizada);
    setInsumoSelecionado(null);
    setQuantidadeInsumo(1);
    setShowAddForm(false);
  };
  
  const handleRemoveInsumo = (insumoId: number) => {
    const composicaoAtualizada = {
      ...composicaoAtual,
      insumos: composicaoAtual.insumos.filter(i => i.id !== insumoId)
    };
    
    setComposicaoAtual(composicaoAtualizada);
  };
  
  const handleChangeMaoDeObra = (tipo: 'fabricacao' | 'instalacao', valor: number) => {
    const composicaoAtualizada = {
      ...composicaoAtual,
      maoDeObra: {
        ...composicaoAtual.maoDeObra,
        [tipo]: valor
      }
    };
    
    setComposicaoAtual(composicaoAtualizada);
  };
  
  const handleChangeDespesaAdm = (valor: number) => {
    const composicaoAtualizada = {
      ...composicaoAtual,
      despesaAdministrativa: valor
    };
    
    setComposicaoAtual(composicaoAtualizada);
  };
  
  const handleChangeMargem = (valor: number) => {
    const composicaoAtualizada = {
      ...composicaoAtual,
      margemVenda: valor
    };
    
    setComposicaoAtual(composicaoAtualizada);
  };

  const handleSalvarComposicao = async () => {
    if (!produtoAtual || !composicaoAtual) return;

    setSalvando(true);
    try {
      // Primeiro, excluir composições existentes
      await composicaoProdutoService.excluirPorProduto(String(produtoAtual.id));

      // Depois, criar as novas composições
      if (composicaoAtual.insumos.length > 0) {
        const composicoes = composicaoAtual.insumos.map(insumo => ({
          produto_id: String(produtoAtual.id),
          insumo_id: String(insumo.insumoId),
          quantidade: insumo.quantidade,
          observacao: `Valor unitário: ${insumo.valorUnitario}`
        }));

        await composicaoProdutoService.criarMultiplas(composicoes);
      }

      toast.success('Composição salva com sucesso!');
      
      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['composicao-produto'] });
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      
      onSalvar();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar composição:', error);
      toast.error('Erro ao salvar composição');
    } finally {
      setSalvando(false);
    }
  };
  
  // Cálculo de subtotais
  const subtotalInsumos = composicaoAtual.insumos.reduce((acc, insumo) => acc + insumo.valorTotal, 0);
  const subtotalMaoDeObra = composicaoAtual.maoDeObra.fabricacao + composicaoAtual.maoDeObra.instalacao;
  
  // Calculando despesa administrativa como porcentagem do custo
  const custoBase = subtotalInsumos + subtotalMaoDeObra;
  const valorDespesaAdm = (custoBase * composicaoAtual.despesaAdministrativa) / 100;
  
  const subtotal = custoBase + valorDespesaAdm;
  const valorFinal = calcularValorTotal(composicaoAtual);

  if (loadingComposicoes) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Carregando composição...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Composição do Produto</DialogTitle>
          <DialogDescription>
            {produtoAtual.nome} - {produtoAtual.codigo}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Insumos</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Insumo
              </Button>
            </div>
            
            {showAddForm && (
              <div className="bg-slate-50 p-4 rounded-md mb-4 grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="insumo">Selecionar Insumo</Label>
                  <Select 
                    value={insumoSelecionado?.toString() || ""} 
                    onValueChange={(v) => setInsumoSelecionado(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar insumo" />
                    </SelectTrigger>
                    <SelectContent>
                      {insumos.map((insumo) => (
                        <SelectItem key={insumo.id} value={insumo.id.toString()}>
                          {insumo.nome} - {formatCurrency(insumo.valorCusto)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input 
                    id="quantidade" 
                    type="number" 
                    min="0.01" 
                    step="0.01"
                    value={quantidadeInsumo}
                    onChange={(e) => setQuantidadeInsumo(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddInsumo} className="w-full">Adicionar</Button>
                </div>
              </div>
            )}
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insumo</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {composicaoAtual.insumos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum insumo adicionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    composicaoAtual.insumos.map((insumo) => (
                      <TableRow key={insumo.id}>
                        <TableCell>{insumo.nome}</TableCell>
                        <TableCell>{insumo.quantidade}</TableCell>
                        <TableCell>{formatCurrency(insumo.valorUnitario)}</TableCell>
                        <TableCell>{formatCurrency(insumo.valorTotal)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveInsumo(insumo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-2">
              <span className="font-medium">Subtotal Insumos: {formatCurrency(subtotalInsumos)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Mão de Obra</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fabricacao">Fabricação (R$)</Label>
                  <Input 
                    id="fabricacao" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={composicaoAtual.maoDeObra.fabricacao}
                    onChange={(e) => handleChangeMaoDeObra('fabricacao', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="instalacao">Instalação (R$)</Label>
                  <Input 
                    id="instalacao" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={composicaoAtual.maoDeObra.instalacao}
                    onChange={(e) => handleChangeMaoDeObra('instalacao', Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="font-medium">Subtotal: {formatCurrency(subtotalMaoDeObra)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Outros Custos e Margem</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="despesaAdm">Despesa Administrativa (%)</Label>
                  <Input 
                    id="despesaAdm" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    max="100"
                    value={composicaoAtual.despesaAdministrativa}
                    onChange={(e) => handleChangeDespesaAdm(Number(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Valor: {formatCurrency(valorDespesaAdm)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="margem">Markup (%)</Label>
                  <Input 
                    id="margem" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    max="300"
                    value={composicaoAtual.margemVenda}
                    onChange={(e) => handleChangeMargem(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Custo Total (sem markup)</span>
                <p className="text-lg font-medium">{formatCurrency(subtotal)}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Preço Final (com markup de {composicaoAtual.margemVenda}%)</span>
                <p className="text-xl font-bold text-green-600">{formatCurrency(valorFinal)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvarComposicao} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Composição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
