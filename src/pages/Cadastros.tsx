
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ListChecks, Users, Building, Truck, FileText, Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProdutosProvider, useProdutos } from "@/contexts/ProdutosContext";
import { InsumosProvider, useInsumos } from "@/contexts/InsumosContext";
import { ProdutosTabsContainer } from "@/components/produtos/ProdutosTabsContainer";
import { ProdutosDialogContainer } from "@/components/produtos/ProdutosDialogContainer";
import { ProdutosSummaryCards } from "@/components/produtos/ProdutosSummaryCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/types/orcamento";
import { InsumoDialog } from "@/components/insumos/InsumoDialog";
import { categoriasInsumo } from "@/types/insumo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const CadastroInsumosContent = () => {
  const {
    insumos,
    insumosFiltrados,
    searchTerm,
    setSearchTerm,
    filtroCategoria,
    setFiltroCategoria,
    filtroRevenda,
    setFiltroRevenda,
    handleSalvarInsumo,
    handleEditarInsumo,
    handlePreExcluirInsumo,
    handleVerDetalhesInsumo,
    setIsInsumoDialogOpen,
    isInsumoDialogOpen,
    setIsInsumoDialogOpen: setInsumoDialogOpen,
    setNovoInsumo,
    insumoVazio,
    insumoAtual,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleExcluirInsumo,
    formatarData,
    novoInsumo
  } = useInsumos();

  // Função para adicionar novo insumo
  const handleNovoInsumo = () => {
    setNovoInsumo(insumoVazio);
    setInsumoDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Cadastro de Insumos
          </CardTitle>
          <CardDescription>
            Gerencie o cadastro de insumos para composição de produtos
          </CardDescription>
        </div>
        <Button onClick={handleNovoInsumo}>
          <Plus className="mr-1 h-4 w-4" /> Novo Insumo
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <Input 
              placeholder="Buscar insumos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <Select 
              value={filtroCategoria || ""} 
              onValueChange={(v) => setFiltroCategoria(v || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas categorias</SelectItem>
                {categoriasInsumo.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select 
              value={filtroRevenda || ""} 
              onValueChange={(v) => setFiltroRevenda(v || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Revenda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="sim">Pode revender</SelectItem>
                <SelectItem value="nao">Sem revenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabela de Insumos */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Revenda</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insumosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum insumo encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                insumosFiltrados.map((insumo) => (
                  <TableRow key={insumo.id}>
                    <TableCell><Badge variant="outline">{insumo.codigo}</Badge></TableCell>
                    <TableCell>{insumo.nome}</TableCell>
                    <TableCell>{insumo.categoria}</TableCell>
                    <TableCell>{formatCurrency(insumo.valorCusto)}</TableCell>
                    <TableCell>
                      <span className={insumo.quantidadeEstoque < 10 ? 'text-red-500' : ''}>
                        {insumo.quantidadeEstoque} {insumo.unidadeMedida}
                      </span>
                    </TableCell>
                    <TableCell>
                      {insumo.podeSerRevendido ? 
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Sim</Badge> : 
                        <Badge variant="outline">Não</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditarInsumo(insumo)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handlePreExcluirInsumo(insumo)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Dialogs necessários */}
        <InsumoDialog
          isOpen={isInsumoDialogOpen}
          onOpenChange={setIsInsumoDialogOpen}
          insumoAtual={insumoAtual}
          novoInsumo={novoInsumo}
          setNovoInsumo={setNovoInsumo}
          onSalvar={handleSalvarInsumo}
          categorias={categoriasInsumo}
        />
        
        {/* Dialog para exclusão */}
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleExcluirInsumo}
          title="Excluir Insumo"
          description="Tem certeza que deseja excluir este insumo? Esta ação não pode ser desfeita."
        />
      </CardContent>
    </Card>
  );
};

// Dialog simples de confirmação de exclusão (reutilizável)
const ConfirmDeleteDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Excluir item",
  description = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Cadastros = () => {
  return (
    <InsumosProvider>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Cadastros</h1>
        
        <Tabs defaultValue="produtos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="insumos">Insumos</TabsTrigger>
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

          <TabsContent value="insumos">
            <CadastroInsumosContent />
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
    </InsumosProvider>
  );
};

export default Cadastros;
