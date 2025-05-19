
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, ProdutoAcabado } from "@/types/orcamento";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface VendaProduto {
  produtoId: number;
  quantidade: number;
  valorTotal: number;
}

interface ProdutosRelatorioTabProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export const ProdutosRelatorioTab = ({ produtos, vendasProdutos }: ProdutosRelatorioTabProps) => {
  // Função para buscar nome do produto pelo ID
  const getNomeProduto = (id: number) => {
    const produto = produtos.find(p => p.id === id);
    return produto ? produto.nome : `Produto #${id}`;
  };

  // Formatar dados para o gráfico - Top 5 produtos por valor vendido
  const dadosGrafico = vendasProdutos
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 5)
    .map(venda => ({
      nome: getNomeProduto(venda.produtoId).length > 20 
        ? getNomeProduto(venda.produtoId).substring(0, 20) + '...' 
        : getNomeProduto(venda.produtoId),
      valor: venda.valorTotal
    }));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Top 5 Produtos por Valor Vendido</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosGrafico}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="valor" name="Valor Vendido" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Qtd. Vendida</TableHead>
              <TableHead className="text-right">Valor Base</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendasProdutos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Nenhuma venda registrada
                </TableCell>
              </TableRow>
            ) : (
              vendasProdutos.map((venda) => {
                const produto = produtos.find(p => p.id === venda.produtoId);
                return (
                  <TableRow key={venda.produtoId}>
                    <TableCell>{produto ? produto.nome : `Produto #${venda.produtoId}`}</TableCell>
                    <TableCell>{produto ? produto.categoria : "-"}</TableCell>
                    <TableCell className="text-right">{venda.quantidade}</TableCell>
                    <TableCell className="text-right">{produto ? formatCurrency(produto.valorBase) : "-"}</TableCell>
                    <TableCell className="text-right">{formatCurrency(venda.valorTotal)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
