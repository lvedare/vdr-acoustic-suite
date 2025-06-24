
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { ItemProposta, formatCurrency } from "@/types/orcamento";

interface ItemsTableProps {
  itens: ItemProposta[];
  onEditItem: (item: ItemProposta) => void;
  onRemoveItem: (id: number) => void;
  valorTotal: number;
}

export const ItemsTable = ({
  itens,
  onEditItem,
  onRemoveItem,
  valorTotal
}: ItemsTableProps) => {
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead className="w-[300px]">Descrição</TableHead>
              <TableHead>Un.</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Valor Unit.</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nenhum item adicionado
                </TableCell>
              </TableRow>
            ) : (
              itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.codigo}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate" title={item.descricao}>
                    {item.descricao}
                  </TableCell>
                  <TableCell>{item.unidade}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{formatCurrency(item.valorUnitario)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.valorTotal)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => onEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end space-x-4">
        <div className="text-xl font-medium">
          Total: {formatCurrency(valorTotal)}
        </div>
      </div>
    </>
  );
};
