
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CadastroProdutosContent } from '@/components/estoque/CadastroProdutosContent';
import { CadastroInsumosContent } from '@/components/estoque/CadastroInsumosContent';
import { CadastroFornecedoresContent } from '@/components/estoque/CadastroFornecedoresContent';
import { InsumosProvider } from '@/contexts/InsumosContext';
import { ProdutosProvider } from '@/contexts/ProdutosContext';

const EstoqueContent = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Estoque</h1>
      
      <Tabs defaultValue="produtos" className="mt-6">
        <TabsList>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="insumos">Insumos</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="produtos">
          <ProdutosProvider>
            <CadastroProdutosContent />
          </ProdutosProvider>
        </TabsContent>
        
        <TabsContent value="insumos">
          <CadastroInsumosContent />
        </TabsContent>
        
        <TabsContent value="fornecedores">
          <CadastroFornecedoresContent />
        </TabsContent>
      </Tabs>
    </>
  );
};

const Estoque = () => {
  return (
    <InsumosProvider>
      <EstoqueContent />
    </InsumosProvider>
  );
};

export default Estoque;
