
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  ItemProposta, 
  ProdutoAcabado, 
  Proposta
} from "@/types/orcamento";
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
  
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemProposta | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filtroProduto, setFiltroProduto] = useState("");
  const [dialogProdutosAberto, setDialogProdutosAberto] = useState(false);

  // Convert Supabase products to the expected format
  const produtosDisponiveis: ProdutoAcabado[] = produtosEstoque
    .filter(produto => produto.quantidade_estoque > 0)
    .map(produto => ({
      id: produto.id,
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao || "",
      categoria: produto.categoria,
      unidadeMedida: produto.unidade_medida,
      valorBase: produto.valor_base,
      quantidadeEstoque: produto.quantidade_estoque,
      dataCadastro: produto.data_cadastro
    }));

  const handleAdicionarProdutoAcabado = (produto: ProdutoAcabado) => {
    const novoItem: ItemProposta = {
      id: Date.now(),
      codigo: produto.codigo,
      descricao: produto.nome,
      unidade: produto.unidadeMedida,
      quantidade: 1,
      valorUnitario: produto.valorBase,
      valorTotal: produto.valorBase
    };

    setProposta(prev => ({
      ...prev,
      itens: [...prev.itens, novoItem]
    }));

    setDialogProdutosAberto(false);
    toast.success("Produto adicionado! Ajuste a quantidade se necessário");
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
            <Package className="h-4 w-4 mr-2" />
            Selecionar Produto
          </Button>
        </div>
        
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
