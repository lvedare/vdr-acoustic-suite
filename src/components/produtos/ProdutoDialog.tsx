
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ProdutoAcabado, ComposicaoProduto } from "@/types/orcamento";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Layers, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInsumos } from "@/contexts/InsumosContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/types/orcamento";

interface ProdutoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  produtoAtual: ProdutoAcabado | null;
  novoProduto: Omit<ProdutoAcabado, "id">;
  setNovoProduto: React.Dispatch<React.SetStateAction<Omit<ProdutoAcabado, "id">>>;
  onSalvar: () => void;
  categorias: string[];
}

export function ProdutoDialog({
  isOpen,
  onOpenChange,
  produtoAtual,
  novoProduto,
  setNovoProduto,
  onSalvar,
  categorias
}: ProdutoDialogProps) {
  const { insumos } = useInsumos();
  const [activeTab, setActiveTab] = useState("info");
  const [insumoSelecionado, setInsumoSelecionado] = useState<number | null>(null);
  const [quantidadeInsumo, setQuantidadeInsumo] = useState<number>(1);

  // Função para calcular valor total - atualizado para usar despesa como % e markup
  const calcularValorTotal = () => {
    if (!novoProduto.composicao) return 0;
    
    // Soma do valor dos insumos
    const valorInsumos = novoProduto.composicao.insumos.reduce((acc, insumo) => acc + insumo.valorTotal, 0);
    
    // Soma mão de obra
    const valorMaoDeObra = novoProduto.composicao.maoDeObra.fabricacao + novoProduto.composicao.maoDeObra.instalacao;
    
    // Custo base
    const custoBase = valorInsumos + valorMaoDeObra;
    
    // Despesa administrativa (como percentual do custo base)
    const valorDespesaAdm = (custoBase * novoProduto.composicao.despesaAdministrativa) / 100;
    
    // Subtotal
    const subtotal = custoBase + valorDespesaAdm;
    
    // Aplicação do markup
    const valorComMarkup = subtotal * (1 + novoProduto.composicao.margemVenda / 100);
    
    return parseFloat(valorComMarkup.toFixed(2));
  };

  // Atualiza o valor base quando a composição é modificada
  const atualizarValorBase = () => {
    if (novoProduto.composicao) {
      const novoValorBase = calcularValorTotal();
      setNovoProduto(prev => ({ ...prev, valorBase: novoValorBase }));
    }
  };

  // Handler para adicionar insumo
  const handleAdicionarInsumo = () => {
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
    
    // Garantir que composicao existe
    const composicaoAtual = novoProduto.composicao || {
      insumos: [],
      maoDeObra: { fabricacao: 0, instalacao: 0 },
      despesaAdministrativa: 0,
      margemVenda: 20
    };
    
    setNovoProduto(prev => ({
      ...prev,
      composicao: {
        ...composicaoAtual,
        insumos: [...composicaoAtual.insumos, novoInsumo]
      }
    }));
    
    setInsumoSelecionado(null);
    setQuantidadeInsumo(1);
    
    // Atualizar valor base
    setTimeout(atualizarValorBase, 0);
  };

  // Handler para remover insumo
  const handleRemoverInsumo = (insumoId: number) => {
    if (!novoProduto.composicao) return;
    
    setNovoProduto(prev => ({
      ...prev,
      composicao: {
        ...prev.composicao!,
        insumos: prev.composicao!.insumos.filter(i => i.id !== insumoId)
      }
    }));
    
    // Atualizar valor base
    setTimeout(atualizarValorBase, 0);
  };

  // Handler para alterar mão de obra
  const handleChangeMaoDeObra = (tipo: 'fabricacao' | 'instalacao', valor: number) => {
    if (!novoProduto.composicao) {
      setNovoProduto(prev => ({
        ...prev,
        composicao: {
          insumos: [],
          maoDeObra: {
            fabricacao: tipo === 'fabricacao' ? valor : 0,
            instalacao: tipo === 'instalacao' ? valor : 0
          },
          despesaAdministrativa: 0,
          margemVenda: 20
        }
      }));
    } else {
      setNovoProduto(prev => ({
        ...prev,
        composicao: {
          ...prev.composicao!,
          maoDeObra: {
            ...prev.composicao!.maoDeObra,
            [tipo]: valor
          }
        }
      }));
    }
    
    // Atualizar valor base
    setTimeout(atualizarValorBase, 0);
  };

  // Handler para alterar despesa administrativa - alterado para percentual
  const handleChangeDespesaAdm = (valor: number) => {
    if (!novoProduto.composicao) {
      setNovoProduto(prev => ({
        ...prev,
        composicao: {
          insumos: [],
          maoDeObra: { fabricacao: 0, instalacao: 0 },
          despesaAdministrativa: valor,
          margemVenda: 30
        }
      }));
    } else {
      setNovoProduto(prev => ({
        ...prev,
        composicao: {
          ...prev.composicao!,
          despesaAdministrativa: valor
        }
      }));
    }
    
    // Atualizar valor base
    setTimeout(atualizarValorBase, 0);
  };

  // Handler para alterar margem - agora tratado como markup
  const handleChangeMargem = (valor: number) => {
    if (!novoProduto.composicao) {
      setNovoProduto(prev => ({
        ...prev,
        composicao: {
          insumos: [],
          maoDeObra: { fabricacao: 0, instalacao: 0 },
          despesaAdministrativa: 10,
          margemVenda: valor
        }
      }));
    } else {
      setNovoProduto(prev => ({
        ...prev,
        composicao: {
          ...prev.composicao!,
          margemVenda: valor
        }
      }));
    }
    
    // Atualizar valor base
    setTimeout(atualizarValorBase, 0);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Calcular subtotais para exibição
  const composicao = novoProduto.composicao || {
    insumos: [],
    maoDeObra: { fabricacao: 0, instalacao: 0 },
    despesaAdministrativa: 10,
    margemVenda: 30
  };
  
  const subtotalInsumos = composicao.insumos.reduce((acc, insumo) => acc + insumo.valorTotal, 0);
  const subtotalMaoDeObra = composicao.maoDeObra.fabricacao + composicao.maoDeObra.instalacao;
  
  // Custo base
  const custoBase = subtotalInsumos + subtotalMaoDeObra;
  
  // Despesa administrativa como percentual
  const valorDespesaAdm = (custoBase * composicao.despesaAdministrativa) / 100;
  
  const subtotal = custoBase + valorDespesaAdm;
  const valorFinal = calcularValorTotal();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{produtoAtual ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {produtoAtual 
              ? "Atualize os dados do produto abaixo" 
              : "Preencha os dados do novo produto abaixo"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="info">Informações Básicas</TabsTrigger>
            <TabsTrigger value="composicao">Composição e Custo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input 
                    id="codigo" 
                    value={novoProduto.codigo}
                    onChange={(e) => setNovoProduto({...novoProduto, codigo: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select 
                    value={novoProduto.categoria}
                    onValueChange={(value) => setNovoProduto({...novoProduto, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input 
                  id="nome" 
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}
                  className="h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidadeMedida">Unidade de Medida</Label>
                  <Select 
                    value={novoProduto.unidadeMedida}
                    onValueChange={(value) => setNovoProduto({...novoProduto, unidadeMedida: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN (Unidade)</SelectItem>
                      <SelectItem value="M²">M² (Metro Quadrado)</SelectItem>
                      <SelectItem value="M">M (Metro Linear)</SelectItem>
                      <SelectItem value="PÇ">PÇ (Peça)</SelectItem>
                      <SelectItem value="CJ">CJ (Conjunto)</SelectItem>
                      <SelectItem value="KG">KG (Quilograma)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valorBase">
                    Valor Base (R$)
                    {composicao.insumos.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">(calculado pela composição)</span>
                    )}
                  </Label>
                  <Input 
                    id="valorBase" 
                    type="number"
                    step="0.01"
                    value={novoProduto.valorBase || ""}
                    onChange={(e) => setNovoProduto({...novoProduto, valorBase: Number(e.target.value)})}
                    disabled={composicao.insumos.length > 0}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-700 text-sm">
                  A quantidade em estoque deve ser gerenciada no módulo de estoque.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="composicao" className="mt-4">
            <div className="space-y-6">
              {/* Seção de Insumos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Insumos</h3>
                </div>
                
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
                    <Button onClick={handleAdicionarInsumo} className="w-full">
                      <Plus className="mr-1 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
                
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
                      {composicao.insumos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                            Nenhum insumo adicionado
                          </TableCell>
                        </TableRow>
                      ) : (
                        composicao.insumos.map((insumo) => (
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
                                onClick={() => handleRemoverInsumo(insumo.id)}
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
              
              {/* Mão de Obra e Outros Custos */}
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
                        value={composicao.maoDeObra.fabricacao}
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
                        value={composicao.maoDeObra.instalacao}
                        onChange={(e) => handleChangeMaoDeObra('instalacao', Number(e.target.value))}
                      />
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
                        value={composicao.despesaAdministrativa}
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
                        value={composicao.margemVenda}
                        onChange={(e) => handleChangeMargem(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resumo de Preço */}
              <div className="bg-slate-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Custo Total (sem markup)</span>
                    <p className="text-lg font-medium">{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Preço Final (com markup de {composicao.margemVenda}%)</span>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(valorFinal)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={onSalvar}>
            {produtoAtual ? "Atualizar Produto" : "Salvar Produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
