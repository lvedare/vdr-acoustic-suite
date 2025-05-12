
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProdutosListaTab } from "./ProdutosListaTab";
import { ProdutosCardsTab } from "./ProdutosCardsTab";
import { ProdutosRelatorioTab } from "./ProdutosRelatorioTab";
import { useProdutos } from "@/contexts/ProdutosContext";

export const ProdutosTabsContainer: React.FC = () => {
  const { 
    produtosFiltrados,
    handleEditarProduto,
    handlePreExcluirProduto,
    handleVerDetalhesProduto,
    handleCriarItemOrcamento,
    produtos,
    vendasProdutos
  } = useProdutos();

  return (
    <Tabs defaultValue="lista" className="space-y-4">
      <TabsList>
        <TabsTrigger value="lista">Lista de Produtos</TabsTrigger>
        <TabsTrigger value="cards">Cartões</TabsTrigger>
        <TabsTrigger value="relatorio">Relatório de Vendas</TabsTrigger>
      </TabsList>
      
      {/* Tab de Lista */}
      <TabsContent value="lista">
        <ProdutosListaTab 
          produtosFiltrados={produtosFiltrados}
          onEditarProduto={handleEditarProduto}
          onExcluirProduto={handlePreExcluirProduto}
          onVerDetalhes={handleVerDetalhesProduto}
          onCriarItemOrcamento={handleCriarItemOrcamento}
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
      
      {/* Tab de Relatórios */}
      <TabsContent value="relatorio">
        <ProdutosRelatorioTab 
          produtos={produtos}
          vendasProdutos={vendasProdutos}
        />
      </TabsContent>
    </Tabs>
  );
};
