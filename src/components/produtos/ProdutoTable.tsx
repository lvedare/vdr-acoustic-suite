
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText, Wrench } from "lucide-react";
import { formatCurrency, ProdutoAcabado } from "@/types/orcamento";
import { EstoqueMovimentacaoButton } from "@/components/estoque/EstoqueMovimentacaoButton";

interface ProdutoTableProps {
  produtos: ProdutoAcabado[];
  onEditarProduto: (produto: ProdutoAcabado) => void;
  onPreExcluirProduto: (produto: ProdutoAcabado) => void;
  onVerDetalhesProduto: (produto: ProdutoAcabado) => void;
  onCriarItemOrcamento: (produto: ProdutoAcabado) => void;
  onEditarComposicao: (produto: ProdutoAcabado) => void;
}

export function ProdutoTable({ 
  produtos, 
  onEditarProduto, 
  onPreExcluirProduto, 
  onVerDetalhesProduto,
  onCriarItemOrcamento,
  onEditarComposicao
}: ProdutoTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor Base</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>
                  <Badge variant="outline">{produto.codigo}</Badge>
                </TableCell>
                <TableCell className="font-medium">{produto.nome}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>{formatCurrency(produto.valorBase)}</TableCell>
                <TableCell>
                  <span className={produto.quantidadeEstoque < 10 ? 'text-red-500 font-medium' : ''}>
                    {produto.quantidadeEstoque}
                  </span>
                </TableCell>
                <TableCell>{produto.unidadeMedida}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onVerDetalhesProduto(produto)}
                      title="Ver detalhes"
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCriarItemOrcamento(produto)}
                      title="Criar item de orçamento"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditarComposicao(produto)}
                      title="Editar composição"
                    >
                      <Wrench className="h-4 w-4" />
                    </Button>
                    <EstoqueMovimentacaoButton 
                      produtoId={produto.id.toString()}
                      produtoNome={produto.nome}
                      tipo="produto"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditarProduto(produto)}
                      title="Editar produto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onPreExcluirProduto(produto)}
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
