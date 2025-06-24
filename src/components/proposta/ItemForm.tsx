
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus } from "lucide-react";
import { NovoItemInput, UNIDADES_OPCOES } from "@/types/orcamento";

interface ItemFormProps {
  novoItem: NovoItemInput;
  onItemChange: (item: NovoItemInput) => void;
  onAdicionarItem: () => void;
  onOpenProdutoDialog: () => void;
}

export const ItemForm = ({
  novoItem,
  onItemChange,
  onAdicionarItem,
  onOpenProdutoDialog
}: ItemFormProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-2">
        <Label htmlFor="codigo">Código</Label>
        <Input 
          id="codigo" 
          value={novoItem.codigo}
          onChange={(e) => onItemChange({ ...novoItem, codigo: e.target.value })}
        />
      </div>
      
      <div className="col-span-4">
        <Label htmlFor="descricao">Descrição</Label>
        <div className="flex space-x-2">
          <Input 
            id="descricao" 
            value={novoItem.descricao}
            onChange={(e) => onItemChange({ ...novoItem, descricao: e.target.value })}
            className="flex-1"
          />
          <Button variant="outline" size="icon" title="Selecionar Produto" onClick={onOpenProdutoDialog}>
            <Package className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="col-span-1">
        <Label htmlFor="unidade">Un.</Label>
        <Select
          value={novoItem.unidade}
          onValueChange={(value) => onItemChange({ ...novoItem, unidade: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Un" />
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
      
      <div className="col-span-1">
        <Label htmlFor="quantidade">Qtd.</Label>
        <Input 
          id="quantidade" 
          type="number"
          min="1"
          value={novoItem.quantidade.toString()}
          onChange={(e) => onItemChange({ ...novoItem, quantidade: Number(e.target.value) })}
        />
      </div>
      
      <div className="col-span-2">
        <Label htmlFor="valorUnitario">Valor Unit. (R$)</Label>
        <Input 
          id="valorUnitario" 
          type="number"
          step="0.01"
          min="0"
          value={novoItem.valorUnitario.toString()}
          onChange={(e) => onItemChange({ ...novoItem, valorUnitario: Number(e.target.value) })}
        />
      </div>
      
      <div className="col-span-2">
        <Button className="w-full" onClick={onAdicionarItem}>
          <Plus className="mr-1 h-4 w-4" /> Adicionar Item
        </Button>
      </div>
    </div>
  );
};
