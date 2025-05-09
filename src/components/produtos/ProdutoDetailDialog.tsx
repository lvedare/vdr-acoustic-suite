
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
  CalculatorIcon
} from "lucide-react";
import { formatCurrency } from "@/types/orcamento";
import { ProdutoAcabado } from "@/types/orcamento";

interface ProdutoDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  produto: ProdutoAcabado | null;
  formatarData: (data: string) => string;
}

export function ProdutoDetailDialog({
  isOpen,
  onOpenChange,
  produto,
  formatarData
}: ProdutoDetailDialogProps) {
  if (!produto) return null;
  
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
