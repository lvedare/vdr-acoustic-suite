
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
import { toast } from "@/components/ui/sonner";
import { ProdutoAcabado } from "@/types/orcamento";

interface ProdutoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  produtoAtual: ProdutoAcabado | null;
  novoProduto: Omit<ProdutoAcabado, "id">;
  setNovoProduto: React.Dispatch<React.SetStateAction<Omit<ProdutoAcabado, "id">>>;
  onSalvar: () => void;
  categorias: string[];
}

export function ProdutoDialog({
  isOpen,
  onOpenChange,
  produtoAtual,
  novoProduto,
  setNovoProduto,
  onSalvar,
  categorias
}: ProdutoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{produtoAtual ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {produtoAtual 
              ? "Atualize os dados do produto abaixo" 
              : "Preencha os dados do novo produto abaixo"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input 
                id="codigo" 
                value={novoProduto.codigo}
                onChange={(e) => setNovoProduto({...novoProduto, codigo: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select 
                value={novoProduto.categoria}
                onValueChange={(value) => setNovoProduto({...novoProduto, categoria: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
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
              value={novoProduto.nome}
              onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              value={novoProduto.descricao}
              onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}
              className="h-20"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidadeMedida">Unidade de Medida</Label>
              <Select 
                value={novoProduto.unidadeMedida}
                onValueChange={(value) => setNovoProduto({...novoProduto, unidadeMedida: value})}
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
              <Label htmlFor="valorBase">Valor Base (R$)</Label>
              <Input 
                id="valorBase" 
                type="number"
                step="0.01"
                value={novoProduto.valorBase || ""}
                onChange={(e) => setNovoProduto({...novoProduto, valorBase: Number(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantidadeEstoque">Quantidade em Estoque</Label>
              <Input 
                id="quantidadeEstoque" 
                type="number"
                value={novoProduto.quantidadeEstoque || ""}
                onChange={(e) => setNovoProduto({...novoProduto, quantidadeEstoque: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSalvar}>
            {produtoAtual ? "Atualizar Produto" : "Salvar Produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
