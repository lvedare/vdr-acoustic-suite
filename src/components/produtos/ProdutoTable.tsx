
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, ProdutoAcabado } from "@/types/orcamento";

interface ProdutoTableProps {
  produtos: ProdutoAcabado[];
  onEditarProduto: (produto: ProdutoAcabado) => void;
  onExcluirProduto: (produto: ProdutoAcabado) => void;
  onVerDetalhes: (produto: ProdutoAcabado) => void;
  onCriarItemOrcamento: (produto: ProdutoAcabado) => void;
}

export function ProdutoTable({ 
  produtos, 
  onEditarProduto, 
  onExcluirProduto, 
  onVerDetalhes, 
  onCriarItemOrcamento 
}: ProdutoTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="text-right">Valor Base</TableHead>
            <TableHead className="text-right">Em Estoque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell className="font-medium">{produto.codigo}</TableCell>
                <TableCell>
                  <div>
                    {produto.nome}
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {produto.descricao.length > 60
                        ? `${produto.descricao.substring(0, 60)}...`
                        : produto.descricao}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className="font-normal">
                    {produto.categoria}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(produto.valorBase)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={produto.quantidadeEstoque < 10 ? "text-red-500" : ""}>
                      {produto.quantidadeEstoque}
                    </span>
                    <span className="text-muted-foreground">{produto.unidadeMedida}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onVerDetalhes(produto)}
                      className="hidden md:flex"
                    >
                      Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditarProduto(produto)}
                    >
                      <Pencil className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Editar</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onExcluirProduto(produto)}
                    >
                      <Trash2 className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Excluir</span>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onCriarItemOrcamento(produto)}
                    >
                      <FileText className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Orçar</span>
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
