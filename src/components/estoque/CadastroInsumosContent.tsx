
import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/types/orcamento';
import { InsumoDialog } from '@/components/insumos/InsumoDialog';
import { categoriasInsumo } from '@/types/insumo';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { useInsumos } from '@/contexts/InsumosContext';

export const CadastroInsumosContent = () => {
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

  const handleNovoInsumo = () => {
    setNovoInsumo(insumoVazio);
    setInsumoDialogOpen(true);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Insumos
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
              value={filtroCategoria || "todas_categorias"} 
              onValueChange={(v) => setFiltroCategoria(v === "todas_categorias" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas_categorias">Todas categorias</SelectItem>
                {categoriasInsumo.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select 
              value={filtroRevenda || "todos"} 
              onValueChange={(v) => setFiltroRevenda(v === "todos" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Revenda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
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
