
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { ProdutoAcabado, formatCurrency } from "@/types/orcamento";

interface ProdutoSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  produtos: ProdutoAcabado[];
  filtroProduto: string;
  onFilterChange: (filter: string) => void;
  onSelectProduto: (produto: ProdutoAcabado) => void;
}

export const ProdutoSelectionDialog = ({
  isOpen,
  onOpenChange,
  produtos,
  filtroProduto,
  onFilterChange,
  onSelectProduto
}: ProdutoSelectionDialogProps) => {
  const produtosFiltrados = produtos.filter(produto => {
    const termoBusca = filtroProduto.toLowerCase();
    return (
      produto.nome.toLowerCase().includes(termoBusca) ||
      produto.codigo.toLowerCase().includes(termoBusca) ||
      produto.descricao.toLowerCase().includes(termoBusca) ||
      produto.categoria.toLowerCase().includes(termoBusca)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selecionar Produto do Estoque</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto por nome, código ou categoria..."
              className="pl-8"
              value={filtroProduto}
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="w-[80px]">Un.</TableHead>
                  <TableHead className="w-[100px]">Valor</TableHead>
                  <TableHead className="w-[80px]">Estoque</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {produtos.length === 0 
                        ? "Nenhum produto cadastrado no sistema."
                        : "Nenhum produto encontrado com o filtro aplicado."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Badge variant="outline">{produto.codigo}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{produto.nome}</div>
                          {produto.descricao && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                              {produto.descricao}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{produto.categoria}</Badge>
                      </TableCell>
                      <TableCell>{produto.unidadeMedida}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(produto.valorBase)}
                      </TableCell>
                      <TableCell>
                        <span className={produto.quantidadeEstoque < 10 ? 'text-red-500 font-medium' : ''}>
                          {produto.quantidadeEstoque}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => onSelectProduto(produto)}
                          disabled={produto.quantidadeEstoque <= 0}
                        >
                          <Plus className="h-4 w-4 mr-1" /> 
                          {produto.quantidadeEstoque <= 0 ? 'Sem estoque' : 'Selecionar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {produtosFiltrados.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Encontrados {produtosFiltrados.length} produtos
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
