
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  TagIcon, 
  PackageOpen, 
  CalculatorIcon,
  Layers
} from "lucide-react";
import { formatCurrency } from "@/types/orcamento";
import { ProdutoAcabado } from "@/types/orcamento";

interface ProdutoDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  produto: ProdutoAcabado | null;
  formatarData: (data: string) => string;
  onEditarComposicao: (produto: ProdutoAcabado) => void;
}

export function ProdutoDetailDialog({
  isOpen,
  onOpenChange,
  produto,
  formatarData,
  onEditarComposicao
}: ProdutoDetailDialogProps) {
  if (!produto) return null;
  
  // Detalhes da composição
  const composicao = produto.composicao;
  const temComposicao = composicao && (composicao.insumos.length > 0 || 
                         composicao.maoDeObra.fabricacao > 0 || 
                         composicao.maoDeObra.instalacao > 0 ||
                         composicao.despesaAdministrativa > 0);
  
  // Cálculos dos subtotais
  const subtotalInsumos = composicao?.insumos.reduce((acc, insumo) => acc + insumo.valorTotal, 0) || 0;
  const subtotalMaoDeObra = composicao ? composicao.maoDeObra.fabricacao + composicao.maoDeObra.instalacao : 0;
  const subtotalDespesasAdm = composicao?.despesaAdministrativa || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{produto.nome}</DialogTitle>
          <DialogDescription>
            Código: {produto.codigo} | Categoria: {produto.categoria}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="py-3">
                <CardTitle className="flex items-center text-base">
                  <TagIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Especificações
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="space-y-3">
                  <h3 className="font-semibold">Descrição</h3>
                  <p className="text-sm text-muted-foreground">
                    {produto.descricao || "Sem descrição disponível."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Unidade de Medida</h4>
                    <p>{produto.unidadeMedida}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</h4>
                    <p>{formatarData(produto.dataCadastro)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center text-base">
                  <CalculatorIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Valores
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor Base</h4>
                    <p className="font-semibold text-lg">{formatCurrency(produto.valorBase)}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor em Estoque</h4>
                    <p className="font-semibold text-lg">{formatCurrency(produto.valorBase * produto.quantidadeEstoque)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="flex items-center text-base">
                <PackageOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                Estoque
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Quantidade Atual</h4>
                  <p className={`font-semibold text-lg ${produto.quantidadeEstoque < 10 ? "text-red-500" : ""}`}>
                    {produto.quantidadeEstoque} {produto.unidadeMedida}
                  </p>
                </div>
                {produto.quantidadeEstoque < 10 && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                    Estoque Baixo
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-base">
                <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                Composição do Produto
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEditarComposicao(produto);
                }}
              >
                Editar Composição
              </Button>
            </CardHeader>
            <CardContent className="py-3">
              {!temComposicao ? (
                <div className="text-center p-4 text-muted-foreground">
                  Este produto não possui composição cadastrada.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Insumos</h3>
                    {composicao && composicao.insumos.length > 0 ? (
                      <div className="border rounded overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b">
                              <th className="p-2 text-left">Insumo</th>
                              <th className="p-2 text-right">Qtd</th>
                              <th className="p-2 text-right">Valor Unit.</th>
                              <th className="p-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {composicao.insumos.map((insumo, idx) => (
                              <tr key={idx} className="border-b">
                                <td className="p-2">{insumo.nome}</td>
                                <td className="p-2 text-right">{insumo.quantidade}</td>
                                <td className="p-2 text-right">{formatCurrency(insumo.valorUnitario)}</td>
                                <td className="p-2 text-right">{formatCurrency(insumo.valorTotal)}</td>
                              </tr>
                            ))}
                            <tr className="bg-slate-50">
                              <td colSpan={3} className="p-2 font-medium text-right">Subtotal:</td>
                              <td className="p-2 font-medium text-right">{formatCurrency(subtotalInsumos)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum insumo adicionado.</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Mão de Obra</h3>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Fabricação</span>
                            <p className="font-medium">{formatCurrency(composicao?.maoDeObra.fabricacao || 0)}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Instalação</span>
                            <p className="font-medium">{formatCurrency(composicao?.maoDeObra.instalacao || 0)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Despesas Administrativas</h3>
                      <div className="bg-slate-50 p-3 rounded">
                        <div>
                          <span className="text-xs text-muted-foreground">Valor</span>
                          <p className="font-medium">{formatCurrency(subtotalDespesasAdm)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Margem</h3>
                    <div className="bg-slate-50 p-3 rounded">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Margem de Venda</span>
                          <p className="font-medium">{composicao?.margemVenda || 0}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-muted-foreground">Custo Total (sem margem)</span>
                      <p className="font-medium">{formatCurrency(subtotalInsumos + subtotalMaoDeObra + subtotalDespesasAdm)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Preço Final</span>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(produto.valorBase)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
