
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProdutosProvider, useProdutos } from "@/contexts/ProdutosContext";
import { ProdutosTabsContainer } from "@/components/produtos/ProdutosTabsContainer";
import { ProdutosDialogContainer } from "@/components/produtos/ProdutosDialogContainer";
import { ProdutosSummaryCards } from "@/components/produtos/ProdutosSummaryCards";

const ProdutosContent = () => {
  const { 
    setIsProdutoDialogOpen, 
    setProdutoAtual, 
    setNovoProduto, 
    produtoVazio,
    produtos,
    vendasProdutos
  } = useProdutos();

  const handleNovoProduto = () => {
    setProdutoAtual(null);
    setNovoProduto(produtoVazio);
    setIsProdutoDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos Acabados</h1>
        <Button onClick={handleNovoProduto}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      {/* Cards de resumo */}
      <ProdutosSummaryCards produtos={produtos} vendasProdutos={vendasProdutos} />
      
      {/* Tabs Container */}
      <ProdutosTabsContainer />
      
      {/* Dialogs */}
      <ProdutosDialogContainer />
    </div>
  );
};

const ProdutosAcabados = () => {
  return (
    <ProdutosProvider>
      <ProdutosContent />
    </ProdutosProvider>
  );
};

export default ProdutosAcabados;
