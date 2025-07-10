
import React, { useState } from 'react';
import { Truck, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { FornecedorDialog } from '@/components/fornecedores/FornecedorDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { useFornecedores } from '@/hooks/useFornecedores';
import { categoriasAcusticas } from '@/types/supabase-extended';

export const CadastroFornecedoresContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    fornecedores, 
    isLoading, 
    criarFornecedor, 
    atualizarFornecedor, 
    excluirFornecedor 
  } = useFornecedores();
  
  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (fornecedor.cnpj && fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategoria = filtroCategoria ? fornecedor.categoria === filtroCategoria : true;
    
    return matchesSearch && matchesCategoria;
  });
  
  const handleNovoFornecedor = () => {
    setFornecedorSelecionado(null);
    setIsDialogOpen(true);
  };
  
  const handleEditarFornecedor = (fornecedor: any) => {
    setFornecedorSelecionado(fornecedor);
    setIsDialogOpen(true);
  };
  
  const handlePreExcluirFornecedor = (fornecedor: any) => {
    setFornecedorSelecionado(fornecedor);
    setIsDeleteDialogOpen(true);
  };
  
  const handleExcluirFornecedor = () => {
    if (fornecedorSelecionado) {
      excluirFornecedor(fornecedorSelecionado.id);
      setIsDeleteDialogOpen(false);
      setFornecedorSelecionado(null);
    }
  };
  
  const handleSalvarFornecedor = (fornecedorData: any) => {
    if (fornecedorSelecionado) {
      atualizarFornecedor({ id: fornecedorSelecionado.id, fornecedor: fornecedorData });
    } else {
      criarFornecedor(fornecedorData);
    }
    setIsDialogOpen(false);
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Fornecedores ({fornecedores.length})
          </CardTitle>
          <CardDescription>
            Gerencie o cadastro de fornecedores
            {isLoading && " - Carregando..."}
          </CardDescription>
        </div>
        <Button onClick={handleNovoFornecedor} disabled={isLoading}>
          <Plus className="mr-1 h-4 w-4" /> Novo Fornecedor
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <Input
              placeholder="Buscar fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <Select
              value={filtroCategoria || "todas"}
              onValueChange={(v) => setFiltroCategoria(v === "todas" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas categorias</SelectItem>
                {categoriasAcusticas.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabela de Fornecedores */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedoresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                fornecedoresFiltrados.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">{fornecedor.telefone}</TableCell>
                    <TableCell className="hidden md:table-cell">{fornecedor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{fornecedor.categoria}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarFornecedor(fornecedor)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handlePreExcluirFornecedor(fornecedor)}
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
        
        <FornecedorDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          fornecedor={fornecedorSelecionado}
          onSalvar={handleSalvarFornecedor}
        />
        
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleExcluirFornecedor}
          title="Excluir Fornecedor"
          description="Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita."
        />
      </CardContent>
    </Card>
  );
};
