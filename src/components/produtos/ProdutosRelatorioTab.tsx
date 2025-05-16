
import React from "react";
import { ProdutoVendasTable } from "./ProdutoVendasTable";
import { ProdutoAcabado } from "@/types/orcamento";
import { VendaProduto } from "@/contexts/ProdutosContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarIcon, Coins, Package } from "lucide-react";

interface ProdutosRelatorioTabProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export const ProdutosRelatorioTab: React.FC<ProdutosRelatorioTabProps> = ({
  produtos,
  vendasProdutos
}) => {
  // Cálculo de métricas para o relatório
  const totalVendas = vendasProdutos.reduce((total, venda) => total + venda.valorTotal, 0);
  const totalQuantidadeVendida = vendasProdutos.reduce((total, venda) => total + venda.quantidade, 0);
  
  // Produtos mais vendidos (top 5)
  const produtosMaisVendidos = [...produtos]
    .map(produto => {
      const vendasDoProduto = vendasProdutos.filter(v => v.produtoId === produto.id);
      const quantidadeVendida = vendasDoProduto.reduce((total, venda) => total + venda.quantidade, 0);
      const valorTotalVendido = vendasDoProduto.reduce((total, venda) => total + venda.valorTotal, 0);
      return {
        ...produto,
        quantidadeVendida,
        valorTotalVendido
      };
    })
    .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Coins className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalVendas)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quantidade Vendida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{totalQuantidadeVendida} unidades</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{produtos.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Vendas de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProdutoVendasTable produtos={produtos} vendasProdutos={vendasProdutos} />
        </CardContent>
      </Card>
    </div>
  );
};
