
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Insumo } from '@/types/insumo';

interface InsumoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  insumoAtual: Insumo | null;
  novoInsumo: Omit<Insumo, "id">;
  setNovoInsumo: React.Dispatch<React.SetStateAction<Omit<Insumo, "id">>>;
  onSalvar: () => void;
  categorias: string[];
}

export function InsumoDialog({
  isOpen,
  onOpenChange,
  insumoAtual,
  novoInsumo,
  setNovoInsumo,
  onSalvar,
  categorias
}: InsumoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{insumoAtual ? "Editar Insumo" : "Novo Insumo"}</DialogTitle>
          <DialogDescription>
            {insumoAtual 
              ? "Atualize os dados do insumo abaixo" 
              : "Preencha os dados do novo insumo abaixo"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input 
                id="codigo" 
                value={novoInsumo.codigo}
                onChange={(e) => setNovoInsumo({...novoInsumo, codigo: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select 
                value={novoInsumo.categoria || "selecionar"} 
                onValueChange={(value) => setNovoInsumo({...novoInsumo, categoria: value === "selecionar" ? "" : value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selecionar">Selecione uma categoria</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input 
              id="nome" 
              value={novoInsumo.nome}
              onChange={(e) => setNovoInsumo({...novoInsumo, nome: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              value={novoInsumo.descricao}
              onChange={(e) => setNovoInsumo({...novoInsumo, descricao: e.target.value})}
              className="h-20"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidadeMedida">Unidade de Medida</Label>
              <Select 
                value={novoInsumo.unidadeMedida || "UN"}
                onValueChange={(value) => setNovoInsumo({...novoInsumo, unidadeMedida: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UN">UN (Unidade)</SelectItem>
                  <SelectItem value="M²">M² (Metro Quadrado)</SelectItem>
                  <SelectItem value="M">M (Metro Linear)</SelectItem>
                  <SelectItem value="PÇ">PÇ (Peça)</SelectItem>
                  <SelectItem value="CJ">CJ (Conjunto)</SelectItem>
                  <SelectItem value="KG">KG (Quilograma)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valorCusto">Valor de Custo (R$)</Label>
              <Input 
                id="valorCusto" 
                type="number"
                step="0.01"
                value={novoInsumo.valorCusto || ""}
                onChange={(e) => setNovoInsumo({...novoInsumo, valorCusto: Number(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantidadeEstoque">Quantidade em Estoque</Label>
              <Input 
                id="quantidadeEstoque" 
                type="number"
                value={novoInsumo.quantidadeEstoque || ""}
                onChange={(e) => setNovoInsumo({...novoInsumo, quantidadeEstoque: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input 
                id="fornecedor" 
                value={novoInsumo.fornecedor || ""}
                onChange={(e) => setNovoInsumo({...novoInsumo, fornecedor: e.target.value})}
              />
            </div>
            
            <div className="flex items-center justify-between space-y-0 pt-5">
              <Label htmlFor="podeSerRevendido">Pode ser revendido</Label>
              <Switch 
                id="podeSerRevendido" 
                checked={novoInsumo.podeSerRevendido}
                onCheckedChange={(checked) => setNovoInsumo({...novoInsumo, podeSerRevendido: checked})}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSalvar}>
            {insumoAtual ? "Atualizar Insumo" : "Salvar Insumo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
