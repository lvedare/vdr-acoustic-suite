
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { formatCurrency, ProdutoAcabado } from "@/types/orcamento";
import { VendaProduto } from "@/contexts/ProdutosContext";

interface ProdutoVendasTableProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export function ProdutoVendasTable({ produtos, vendasProdutos }: ProdutoVendasTableProps) {
  // Obter vendas por produto
  const getVendasPorProduto = (produtoId: number): VendaProduto[] => {
    return vendasProdutos.filter(venda => venda.produtoId === produtoId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-muted-foreground" />
          Relatório de Vendas por Produto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor Un.</TableHead>
              <TableHead className="text-right">Qtd. Vendida</TableHead>
              <TableHead className="text-right">Total Vendido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => {
              const vendasDoProduto = getVendasPorProduto(produto.id);
              const totalQuantidade = vendasDoProduto.reduce((sum, v) => sum + v.quantidade, 0);
              const totalVendido = vendasDoProduto.reduce((sum, v) => sum + v.valorTotal, 0);
              
              // Só mostra produtos que tiveram vendas
              if (totalQuantidade === 0) return null;
              
              return (
                <TableRow key={produto.id}>
                  <TableCell>{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell className="text-right">{formatCurrency(produto.valorBase)}</TableCell>
                  <TableCell className="text-right">{totalQuantidade} {produto.unidadeMedida}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(totalVendido)}</TableCell>
                </TableRow>
              );
            })}
            
            {produtos.filter(p => getVendasPorProduto(p.id).length > 0).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhuma venda registrada para os produtos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
