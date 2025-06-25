
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { useProdutosAcabados } from "@/hooks/useSupabaseModules";

interface ItemProdutoProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
  produtosAcabados: ProdutoAcabado[];
}

const ItemProduto = ({ proposta, setProposta, produtosAcabados }: ItemProdutoProps) => {
  const navigate = useNavigate();
  const { produtos: produtosEstoque, isLoading: loadingProdutos } = useProdutosAcabados();
  
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

  // Usar apenas produtos que estão no estoque
  const produtosDisponiveis = produtosEstoque.filter(produto => produto.quantidade_estoque > 0);

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

  const handleAdicionarProdutoAcabado = (produto: any) => {
    setNovoItem({
      codigo: produto.codigo,
      descricao: produto.nome,
      unidade: produto.unidade_medida,
      quantidade: 1,
      valorUnitario: produto.valor_base
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

  const handleIrParaCadastroPA = () => {
    navigate("/estoque", { state: { activeTab: "produtos" } });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Itens da Proposta</CardTitle>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleIrParaCadastroPA}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Cadastrar Novo PA
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">Produtos disponíveis no estoque:</p>
            <p className="text-sm text-muted-foreground">
              {loadingProdutos ? "Carregando..." : `${produtosDisponiveis.length} produtos com estoque disponível`}
            </p>
          </div>
          <Button 
            onClick={() => setDialogProdutosAberto(true)}
            disabled={loadingProdutos || produtosDisponiveis.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Selecionar do Estoque
          </Button>
        </div>

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
          produtos={produtosDisponiveis}
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
