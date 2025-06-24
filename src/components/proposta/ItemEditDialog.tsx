
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemProposta, UNIDADES_OPCOES, formatCurrency } from "@/types/orcamento";

interface ItemEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemProposta | null;
  onItemChange: (item: ItemProposta) => void;
  onSave: () => void;
}

export const ItemEditDialog = ({
  isOpen,
  onOpenChange,
  item,
  onItemChange,
  onSave
}: ItemEditDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-codigo">Código</Label>
              <Input 
                id="edit-codigo" 
                value={item.codigo}
                onChange={(e) => onItemChange({ ...item, codigo: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-unidade">Unidade</Label>
              <Select
                value={item.unidade}
                onValueChange={(value) => onItemChange({ ...item, unidade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES_OPCOES.map((unidade) => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="edit-descricao">Descrição</Label>
            <Input 
              id="edit-descricao" 
              value={item.descricao}
              onChange={(e) => onItemChange({ ...item, descricao: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-quantidade">Quantidade</Label>
              <Input 
                id="edit-quantidade" 
                type="number"
                min="1"
                value={item.quantidade.toString()}
                onChange={(e) => onItemChange({ ...item, quantidade: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="edit-valorUnitario">Valor Unitário (R$)</Label>
              <Input 
                id="edit-valorUnitario" 
                type="number"
                step="0.01"
                min="0"
                value={item.valorUnitario.toString()}
                onChange={(e) => onItemChange({ ...item, valorUnitario: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-md">
            <p className="font-medium">Valor Total: {formatCurrency(
              item.quantidade * item.valorUnitario
            )}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
