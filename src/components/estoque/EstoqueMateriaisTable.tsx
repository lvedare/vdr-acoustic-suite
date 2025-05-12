
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackagePlus, Pencil } from "lucide-react";

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

interface EstoqueMateriaisTableProps {
  materiaisFiltrados: Material[];
  getEstoqueStatus: (material: { quantidadeEstoque: number, estoqueMinimo: number }) => { 
    status: string, 
    badge: string, 
    texto: string 
  };
  formatarMoeda: (valor: number) => string;
}

export const EstoqueMateriaisTable = ({ 
  materiaisFiltrados, 
  getEstoqueStatus, 
  formatarMoeda 
}: EstoqueMateriaisTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="text-right">Qtde.</TableHead>
            <TableHead className="hidden lg:table-cell">Estoque Mín.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Valor Un.</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiaisFiltrados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum material encontrado.
              </TableCell>
            </TableRow>
          ) : (
            materiaisFiltrados.map((material) => {
              const { badge, texto } = getEstoqueStatus(material);
              return (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.codigo}</TableCell>
                  <TableCell>
                    <div>
                      {material.nome}
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {material.descricao.length > 30
                          ? `${material.descricao.substring(0, 30)}...`
                          : material.descricao}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{material.categoria}</TableCell>
                  <TableCell className="text-right">
                    {material.quantidadeEstoque} {material.unidade}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{material.estoqueMinimo}</TableCell>
                  <TableCell>
                    <Badge className={badge} variant="secondary">
                      {texto}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatarMoeda(material.valorUnitario)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Registrar Movimentação"
                      >
                        <PackagePlus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Editar Material"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
