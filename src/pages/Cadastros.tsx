
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ListChecks, Users, Building, Truck, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProdutosProvider, useProdutos } from "@/contexts/ProdutosContext";
import { ProdutosTabsContainer } from "@/components/produtos/ProdutosTabsContainer";
import { ProdutosDialogContainer } from "@/components/produtos/ProdutosDialogContainer";
import { ProdutosSummaryCards } from "@/components/produtos/ProdutosSummaryCards";

// Wrapper component that uses the hooks within the provider
const CadastroProdutosContent = () => {
  const { 
    produtos, 
    vendasProdutos, 
    setIsProdutoDialogOpen, 
    produtoAtual, 
    setProdutoAtual, 
    setNovoProduto, 
    produtoVazio 
  } = useProdutos();
  
  const handleNovoProduto = () => {
    setProdutoAtual(null);
    setNovoProduto(produtoVazio);
    setIsProdutoDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Cadastro de Produtos
          </CardTitle>
          <CardDescription>
            Gerencie o cadastro de produtos e insumos
          </CardDescription>
        </div>
        <Button onClick={handleNovoProduto}>
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

const Cadastros = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cadastros</h1>
      
      <Tabs defaultValue="produtos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="transportadoras">Transportadoras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="produtos">
          <ProdutosProvider>
            <CadastroProdutosContent />
          </ProdutosProvider>
        </TabsContent>
        
        <TabsContent value="fornecedores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Cadastro de Fornecedores
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de fornecedores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar fornecedores.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colaboradores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Cadastro de Colaboradores
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar colaboradores.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unidades">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Cadastro de Unidades
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de unidades e filiais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar unidades e filiais.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transportadoras">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Cadastro de Transportadoras
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de transportadoras
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar transportadoras.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cadastros;
