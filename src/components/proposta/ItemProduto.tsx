
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ItemProposta, 
  NovoItemInput, 
  ProdutoAcabado, 
  Proposta
} from "@/types/orcamento";
import { ItemForm } from "./ItemForm";
import { ItemsTable } from "./ItemsTable";
import { ItemEditDialog } from "./ItemEditDialog";
import { ProdutoSelectionDialog } from "./ProdutoSelectionDialog";

interface ItemProdutoProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
  produtosAcabados: ProdutoAcabado[];
}

const ItemProduto = ({ proposta, setProposta, produtosAcabados }: ItemProdutoProps) => {
  const [novoItem, setNovoItem] = useState<NovoItemInput>({
    codigo: "",
    descricao: "",
    unidade: "PÇ",
    quantidade: 1,
    valorUnitario: 0
  });
  
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemProposta | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filtroProduto, setFiltroProduto] = useState("");
  const [dialogProdutosAberto, setDialogProdutosAberto] = useState(false);

  const handleAdicionarItem = () => {
    if (!novoItem.codigo || !novoItem.descricao || novoItem.quantidade <= 0 || novoItem.valorUnitario <= 0) {
      toast.error("Preencha todos os campos do item corretamente");
      return;
    }
    
    const valorTotal = novoItem.quantidade * novoItem.valorUnitario;
    
    setProposta(prev => ({
      ...prev,
      itens: [
        ...prev.itens,
        {
          id: Date.now(),
          ...novoItem,
          valorTotal
        }
      ]
    }));
    
    setNovoItem({
      codigo: "",
      descricao: "",
      unidade: "PÇ",
      quantidade: 1,
      valorUnitario: 0
    });
    
    toast.success("Item adicionado com sucesso!");
  };

  const handleAdicionarProdutoAcabado = (produto: ProdutoAcabado) => {
    setNovoItem({
      codigo: produto.codigo,
      descricao: produto.nome,
      unidade: produto.unidadeMedida,
      quantidade: 1,
      valorUnitario: produto.valorBase
    });

    setDialogProdutosAberto(false);
    toast.success("Produto selecionado, ajuste a quantidade se necessário");
  };

  const handleEditarItem = (item: ItemProposta) => {
    setItemEmEdicao({...item});
    setIsEditDialogOpen(true);
  };
  
  const handleSalvarEdicao = () => {
    if (!itemEmEdicao) return;
    
    if (!itemEmEdicao.codigo || !itemEmEdicao.descricao || itemEmEdicao.quantidade <= 0 || itemEmEdicao.valorUnitario <= 0) {
      toast.error("Preencha todos os campos do item corretamente");
      return;
    }
    
    const valorTotal = itemEmEdicao.quantidade * itemEmEdicao.valorUnitario;
    const itemAtualizado = { ...itemEmEdicao, valorTotal };
    
    setProposta(prev => ({
      ...prev,
      itens: prev.itens.map(item => 
        item.id === itemAtualizado.id ? itemAtualizado : item
      )
    }));
    
    setIsEditDialogOpen(false);
    setItemEmEdicao(null);
    toast.success("Item atualizado com sucesso!");
  };

  const handleRemoverItem = (id: number) => {
    setProposta(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== id)
    }));
    
    toast.success("Item removido com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens da Proposta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ItemForm
          novoItem={novoItem}
          onItemChange={setNovoItem}
          onAdicionarItem={handleAdicionarItem}
          onOpenProdutoDialog={() => setDialogProdutosAberto(true)}
        />
        
        <ItemsTable
          itens={proposta.itens}
          onEditItem={handleEditarItem}
          onRemoveItem={handleRemoverItem}
          valorTotal={proposta.valorTotal}
        />

        <ProdutoSelectionDialog
          isOpen={dialogProdutosAberto}
          onOpenChange={setDialogProdutosAberto}
          produtos={produtosAcabados}
          filtroProduto={filtroProduto}
          onFilterChange={setFiltroProduto}
          onSelectProduto={handleAdicionarProdutoAcabado}
        />

        <ItemEditDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          item={itemEmEdicao}
          onItemChange={setItemEmEdicao}
          onSave={handleSalvarEdicao}
        />
      </CardContent>
    </Card>
  );
};

export default ItemProduto;
