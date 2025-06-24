
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Material, EstoqueStatus } from "@/types/estoque";
import { formatCurrency } from "@/types/orcamento";
import { EstoqueActions } from "./EstoqueActions";

interface EstoqueMateriaisTableProps {
  materiaisFiltrados: Material[];
  getEstoqueStatus: (material: { quantidadeEstoque: number, estoqueMinimo: number }) => { 
    status: string, 
    badge: string, 
    texto: string 
  };
  formatarMoeda?: (valor: number) => string;
  materiais?: Material[];
  getStatusBadge?: (quantidade: number, minimo: number) => EstoqueStatus;
  onEditMaterial?: (material: Material) => void;
  onDeleteMaterial?: (material: Material) => void;
}

export const EstoqueMateriaisTable = ({ 
  materiaisFiltrados, 
  getEstoqueStatus, 
  formatarMoeda,
  materiais,
  getStatusBadge,
  onEditMaterial,
  onDeleteMaterial
}: EstoqueMateriaisTableProps) => {
  const effectiveMateriais = materiaisFiltrados || materiais || [];
  const effectiveGetStatus = (material: Material) => {
    if (getEstoqueStatus) return getEstoqueStatus(material);
    if (getStatusBadge) return getStatusBadge(material.quantidadeEstoque, material.estoqueMinimo);
    return { status: "Desconhecido", badge: "", texto: "Desconhecido" };
  };
  
  const formatarValor = formatarMoeda || formatCurrency;

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
          {effectiveMateriais.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum material encontrado.
              </TableCell>
            </TableRow>
          ) : (
            effectiveMateriais.map((material) => {
              const { badge, texto } = effectiveGetStatus(material);
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
                  <TableCell className="hidden lg:table-cell">{formatarValor(material.valorUnitario)}</TableCell>
                  <TableCell className="text-right">
                    <EstoqueActions
                      itemId={material.id.toString()}
                      itemNome={material.nome}
                      tipo="insumo"
                      onEdit={() => onEditMaterial?.(material)}
                      onDelete={() => onDeleteMaterial?.(material)}
                    />
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
