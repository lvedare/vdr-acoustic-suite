
import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProdutosTabsContainer } from '@/components/produtos/ProdutosTabsContainer';
import { ProdutosDialogContainer } from '@/components/produtos/ProdutosDialogContainer';
import { ProdutosSummaryCards } from '@/components/produtos/ProdutosSummaryCards';
import { useProdutos } from '@/contexts/ProdutosContext';

export const CadastroProdutosContent = () => {
  const { 
    produtos, 
    vendasProdutos, 
    setIsProdutoDialogOpen, 
    produtoAtual, 
    setProdutoAtual, 
    setNovoProduto, 
    produtoVazio,
    isLoading 
  } = useProdutos();
  
  const handleNovoProduto = () => {
    setProdutoAtual(null);
    setNovoProduto(produtoVazio);
    setIsProdutoDialogOpen(true);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Produtos ({produtos.length})
          </CardTitle>
          <CardDescription>
            Gerencie o cadastro de produtos acabados
            {isLoading && " - Carregando..."}
          </CardDescription>
        </div>
        <Button onClick={handleNovoProduto} disabled={isLoading}>
          <Plus className="mr-1 h-4 w-4" /> Novo Produto
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProdutosSummaryCards produtos={produtos} vendasProdutos={vendasProdutos} />
        <div className="mt-6">
          <ProdutosTabsContainer />
        </div>
        <ProdutosDialogContainer />
      </CardContent>
    </Card>
  );
};
