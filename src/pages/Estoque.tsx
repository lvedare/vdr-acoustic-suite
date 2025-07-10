
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, FileX, ArrowUpDown } from 'lucide-react';
import { CadastroProdutosContent } from '@/components/estoque/CadastroProdutosContent';
import { CadastroInsumosContent } from '@/components/estoque/CadastroInsumosContent';
import { CadastroFornecedoresContent } from '@/components/estoque/CadastroFornecedoresContent';
import { MovimentacaoEstoqueCentralDialog } from '@/components/estoque/MovimentacaoEstoqueCentralDialog';
import { InsumosProvider } from '@/contexts/InsumosContext';
import { ProdutosProvider } from '@/contexts/ProdutosContext';

const EstoqueContent = () => {
  const [isMovimentacaoDialogOpen, setIsMovimentacaoDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Estoque</h1>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsMovimentacaoDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Movimentação de Estoque
          </Button>
        </div>
      </div>
      
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

      <MovimentacaoEstoqueCentralDialog
        isOpen={isMovimentacaoDialogOpen}
        onOpenChange={setIsMovimentacaoDialogOpen}
      />
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
