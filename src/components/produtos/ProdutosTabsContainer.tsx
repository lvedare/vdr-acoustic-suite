
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProdutosListaTab } from "./ProdutosListaTab";
import { ProdutosCardsTab } from "./ProdutosCardsTab";
import { useProdutos } from "@/contexts/ProdutosContext";

export const ProdutosTabsContainer: React.FC = () => {
  const { 
    produtosFiltrados,
    handleEditarProduto,
    handlePreExcluirProduto,
    handleVerDetalhesProduto,
    handleCriarItemOrcamento,
    handleEditarComposicao
  } = useProdutos();

  return (
    <Tabs defaultValue="lista" className="space-y-4">
      <TabsList>
        <TabsTrigger value="lista">Lista de Produtos</TabsTrigger>
        <TabsTrigger value="cards">Cartões</TabsTrigger>
      </TabsList>
      
      {/* Tab de Lista */}
      <TabsContent value="lista">
        <ProdutosListaTab 
          produtosFiltrados={produtosFiltrados}
          onEditarProduto={handleEditarProduto}
          onExcluirProduto={handlePreExcluirProduto}
          onVerDetalhes={handleVerDetalhesProduto}
          onCriarItemOrcamento={handleCriarItemOrcamento}
          onEditarComposicao={handleEditarComposicao}
        />
      </TabsContent>
      
      {/* Tab de Cartões */}
      <TabsContent value="cards">
        <ProdutosCardsTab 
          produtosFiltrados={produtosFiltrados}
          onVerDetalhes={handleVerDetalhesProduto}
          onCriarItemOrcamento={handleCriarItemOrcamento}
        />
      </TabsContent>
    </Tabs>
  );
};
