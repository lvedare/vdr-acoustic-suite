
import React, { useState } from 'react';
import { Truck, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { FornecedorDialog, Fornecedor } from '@/components/fornecedores/FornecedorDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';

// Mock fornecedores
const mockFornecedores = [
  { id: 1, nome: "Madeiras Brasil", cnpj: "12.345.678/0001-01", telefone: "(11) 1234-5678", email: "contato@madeirasbrasil.com", endereco: "Rua das Árvores, 123", cidade: "São Paulo", uf: "SP", categoria: "Madeira" },
  { id: 2, nome: "Parafusos & Cia", cnpj: "23.456.789/0001-02", telefone: "(11) 2345-6789", email: "vendas@parafusoscia.com", endereco: "Av. Industrial, 456", cidade: "São Paulo", uf: "SP", categoria: "Fixação" },
  { id: 3, nome: "Adesivos Industriais", cnpj: "34.567.890/0001-03", telefone: "(11) 3456-7890", email: "vendas@adesivosind.com", endereco: "Rua das Colas, 789", cidade: "Campinas", uf: "SP", categoria: "Adesivo" },
  { id: 4, nome: "Ferragens Gerais", cnpj: "45.678.901/0001-04", telefone: "(11) 4567-8901", email: "contato@ferragensgerais.com", endereco: "Av. das Ferramentas, 101", cidade: "Guarulhos", uf: "SP", categoria: "Fixação" },
  { id: 5, nome: "Tintas Premium", cnpj: "56.789.012/0001-05", telefone: "(11) 5678-9012", email: "vendas@tintaspremium.com", endereco: "Rua das Cores, 202", cidade: "Santo André", uf: "SP", categoria: "Pintura" },
];

const categorias = ['Madeira', 'Fixação', 'Adesivo', 'Pintura', 'Elétrico', 'Hidráulico', 'Ferragem', 'Outros'];

export const CadastroFornecedoresContent = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(mockFornecedores);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filtroCategoria ? fornecedor.categoria === filtroCategoria : true;
    
    return matchesSearch && matchesCategoria;
  });
  
  const handleNovoFornecedor = () => {
    setFornecedorSelecionado(null);
    setIsDialogOpen(true);
  };
  
  const handleEditarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsDialogOpen(true);
  };
  
  const handlePreExcluirFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsDeleteDialogOpen(true);
  };
  
  const handleExcluirFornecedor = () => {
    if (fornecedorSelecionado) {
      setFornecedores(fornecedores.filter(f => f.id !== fornecedorSelecionado.id));
      toast.success("Fornecedor excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setFornecedorSelecionado(null);
    }
  };
  
  const handleSalvarFornecedor = (fornecedor: Fornecedor) => {
    if (fornecedorSelecionado) {
      setFornecedores(fornecedores.map(f => f.id === fornecedor.id ? fornecedor : f));
      toast.success("Fornecedor atualizado com sucesso!");
    } else {
      setFornecedores([...fornecedores, fornecedor]);
      toast.success("Fornecedor adicionado com sucesso!");
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Fornecedores
          </CardTitle>
          <CardDescription>
            Gerencie o cadastro de fornecedores
          </CardDescription>
        </div>
        <Button onClick={handleNovoFornecedor}>
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
                {categorias.map(cat => (
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
