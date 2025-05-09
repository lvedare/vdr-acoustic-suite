
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { formatCurrency, ProdutoAcabado } from "@/types/orcamento";

interface VendaProduto {
  id: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  data: string;
}

interface EstoqueSummaryCardsProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export function EstoqueSummaryCards({ produtos, vendasProdutos }: EstoqueSummaryCardsProps) {
  // Calcular valor total em estoque
  const calcularValorTotalEstoque = (): number => {
    return produtos.reduce((total, produto) => {
      return total + (produto.quantidadeEstoque * produto.valorBase);
    }, 0);
  };
  
  // Calcular produtos com estoque baixo
  const contarProdutosBaixoEstoque = (): number => {
    return produtos.filter(p => p.quantidadeEstoque < 10).length;
  };
  
  // Calcular vendas recentes (último mês)
  const calcularVendasRecentesMes = (): number => {
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);
    
    return vendasProdutos
      .filter(v => new Date(v.data) >= umMesAtras)
      .reduce((total, venda) => total + venda.valorTotal, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Produtos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {produtos.length}
            <span className="text-sm font-normal text-muted-foreground ml-2">itens</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valor em Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(calcularValorTotalEstoque())}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Produtos com Estoque Baixo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {contarProdutosBaixoEstoque()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Vendas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(calcularVendasRecentesMes())}
            <span className="text-sm font-normal text-muted-foreground ml-2">último mês</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
