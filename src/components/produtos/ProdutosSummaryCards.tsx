
import React from "react";
import { EstoqueSummaryCards } from "./EstoqueSummaryCards";
import { ProdutoAcabado } from "@/types/orcamento";
import { VendaProduto } from "@/contexts/ProdutosContext";
import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertCircle, FileText, ShoppingBag } from "lucide-react";

interface ProdutosSummaryCardsProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export const ProdutosSummaryCards: React.FC<ProdutosSummaryCardsProps> = ({
  produtos,
  vendasProdutos
}) => {
  // Cálculos para os cards
  const totalProdutos = produtos.length;
  const totalVendas = vendasProdutos.length;
  
  const produtosEstoqueBaixo = produtos.filter(p => p.quantidadeEstoque < 10).length;
  
  // Calcular o valor total do estoque
  const valorTotalEstoque = produtos.reduce((total, produto) => {
    return total + (produto.valorBase * produto.quantidadeEstoque);
  }, 0);
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 rounded-full">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
              <h3 className="text-2xl font-bold">{totalProdutos}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-amber-50 rounded-full">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
              <h3 className="text-2xl font-bold">{produtosEstoqueBaixo}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-50 rounded-full">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendas Realizadas</p>
              <h3 className="text-2xl font-bold">{totalVendas}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-50 rounded-full">
              <ShoppingBag className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor em Estoque</p>
              <h3 className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalEstoque)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
