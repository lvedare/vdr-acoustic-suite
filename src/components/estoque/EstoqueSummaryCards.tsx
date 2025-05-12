
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  valorUnitario: number;
  fornecedor: string;
  localizacao: string;
}

interface EstoqueSummaryCardsProps {
  materiais: Material[];
  formatarMoeda: (valor: number) => string;
}

export const EstoqueSummaryCards = ({ materiais, formatarMoeda }: EstoqueSummaryCardsProps) => {
  // Calculate total value in stock
  const calcularValorTotalEstoque = (): number => {
    return materiais.reduce((total, material) => {
      return total + (material.quantidadeEstoque * material.valorUnitario);
    }, 0);
  };
  
  // Count items with low stock
  const contarItensBaixoEstoque = (): number => {
    return materiais.filter(m => m.quantidadeEstoque < m.estoqueMinimo).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {materiais.reduce((acc, material) => acc + material.quantidadeEstoque, 0)}
            <span className="text-sm font-normal text-muted-foreground ml-2">itens</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatarMoeda(calcularValorTotalEstoque())}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Itens com Estoque Baixo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            {contarItensBaixoEstoque()}
          </div>
          {contarItensBaixoEstoque() > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-800">
              Atenção
            </Badge>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            12
            <span className="text-sm font-normal text-muted-foreground ml-2">esta semana</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
