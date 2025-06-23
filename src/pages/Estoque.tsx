
import React, { useState } from 'react';
import { Package, Layers, Truck } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProdutosTabsContainer } from '@/components/produtos/ProdutosTabsContainer';
import { ProdutosDialogContainer } from '@/components/produtos/ProdutosDialogContainer';
import { ProdutosSummaryCards } from '@/components/produtos/ProdutosSummaryCards';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/types/orcamento';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InsumoDialog } from '@/components/insumos/InsumoDialog';
import { categoriasInsumo } from '@/types/insumo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InsumosProvider, useInsumos } from '@/contexts/InsumosContext';
import { ProdutosProvider, useProdutos } from '@/contexts/ProdutosContext';

// Mock fornecedores
const mockFornecedores = [
  { id: 1, nome: "Madeiras Brasil", cnpj: "12.345.678/0001-01", telefone: "(11) 1234-5678", email: "contato@madeirasbrasil.com", endereco: "Rua das Árvores, 123", cidade: "São Paulo", uf: "SP", categoria: "Madeira" },
  { id: 2, nome: "Parafusos & Cia", cnpj: "23.456.789/0001-02", telefone: "(11) 2345-6789", email: "vendas@parafusoscia.com", endereco: "Av. Industrial, 456", cidade: "São Paulo", uf: "SP", categoria: "Fixação" },
  { id: 3, nome: "Adesivos Industriais", cnpj: "34.567.890/0001-03", telefone: "(11) 3456-7890", email: "vendas@adesivosind.com", endereco: "Rua das Colas, 789", cidade: "Campinas", uf: "SP", categoria: "Adesivo" },
  { id: 4, nome: "Ferragens Gerais", cnpj: "45.678.901/0001-04", telefone: "(11) 4567-8901", email: "contato@ferragensgerais.com", endereco: "Av. das Ferramentas, 101", cidade: "Guarulhos", uf: "SP", categoria: "Fixação" },
  { id: 5, nome: "Tintas Premium", cnpj: "56.789.012/0001-05", telefone: "(11) 5678-9012", email: "vendas@tintaspremium.com", endereco: "Rua das Cores, 202", cidade: "Santo André", uf: "SP", categoria: "Pintura" },
];

// Select "categorias" options
const categorias = ['Madeira', 'Fixação', 'Adesivo', 'Pintura', 'Elétrico', 'Hidráulico', 'Ferragem', 'Outros'];

// Componente para o fornecedor
interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  uf: string;
  categoria: string;
}

// Dialog de fornecedor
interface FornecedorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor | null;
  onSalvar: (fornecedor: Fornecedor) => void;
}

const FornecedorDialog = ({ isOpen, onOpenChange, fornecedor, onSalvar }: FornecedorDialogProps) => {
  const [formData, setFormData] = useState<Omit<Fornecedor, 'id'>>({
    nome: fornecedor?.nome || '',
    cnpj: fornecedor?.cnpj || '',
    telefone: fornecedor?.telefone || '',
    email: fornecedor?.email || '',
    endereco: fornecedor?.endereco || '',
    cidade: fornecedor?.cidade || '',
    uf: fornecedor?.uf || '',
    categoria: fornecedor?.categoria || ''
  });
  
  // Estados brasileiros
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];
  
  const handleSalvar = () => {
    if (!formData.nome || !formData.cnpj) {
      toast.error("Nome e CNPJ são campos obrigatórios");
      return;
    }
    
    onSalvar({
      id: fornecedor?.id || Date.now(),
      ...formData
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
          <DialogDescription>
            {fornecedor ? "Edite as informações do fornecedor" : "Preencha as informações do novo fornecedor"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">Nome do Fornecedor *</label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cnpj" className="text-sm font-medium">CNPJ *</label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="telefone" className="text-sm font-medium">Telefone</label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="endereco" className="text-sm font-medium">Endereço</label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <label htmlFor="cidade" className="text-sm font-medium">Cidade</label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="uf" className="text-sm font-medium">UF</label>
              <Select
                value={formData.uf || "selecionar"}
                onValueChange={(value) => setFormData({ ...formData, uf: value === "selecionar" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selecionar">Selecione</SelectItem>
                  {estados.map(uf => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="categoria" className="text-sm font-medium">Categoria</label>
            <Select
              value={formData.categoria || "selecionar"}
              onValueChange={(value) => setFormData({ ...formData, categoria: value === "selecionar" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selecionar">Selecione</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>{fornecedor ? "Salvar Alterações" : "Adicionar Fornecedor"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for delete confirmation
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

// Component for the Products registration tab
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
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Produtos
          </CardTitle>
          <CardDescription>
            Gerencie o cadastro de produtos acabados
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

// Component for Insumos registration tab
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

// Component for the Fornecedores tab
const CadastroFornecedoresContent = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(mockFornecedores);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Filtrar fornecedores
  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filtroCategoria ? fornecedor.categoria === filtroCategoria : true;
    
    return matchesSearch && matchesCategoria;
  });
  
  // Manipular novo fornecedor
  const handleNovoFornecedor = () => {
    setFornecedorSelecionado(null);
    setIsDialogOpen(true);
  };
  
  // Manipular edição de fornecedor
  const handleEditarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsDialogOpen(true);
  };
  
  // Manipular pré-exclusão de fornecedor
  const handlePreExcluirFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsDeleteDialogOpen(true);
  };
  
  // Manipular exclusão de fornecedor
  const handleExcluirFornecedor = () => {
    if (fornecedorSelecionado) {
      setFornecedores(fornecedores.filter(f => f.id !== fornecedorSelecionado.id));
      toast.success("Fornecedor excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setFornecedorSelecionado(null);
    }
  };
  
  // Salvar fornecedor
  const handleSalvarFornecedor = (fornecedor: Fornecedor) => {
    if (fornecedorSelecionado) {
      // Editar
      setFornecedores(fornecedores.map(f => f.id === fornecedor.id ? fornecedor : f));
      toast.success("Fornecedor atualizado com sucesso!");
    } else {
      // Novo
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
        
        {/* Dialog de fornecedor */}
        <FornecedorDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          fornecedor={fornecedorSelecionado}
          onSalvar={handleSalvarFornecedor}
        />
        
        {/* Dialog de confirmação de exclusão */}
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

// Main component for Estoque module without materials
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
