
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart,
  Box,
  CalculatorIcon,
  FileText,
  Filter,
  Grid3X3,
  Image,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  TagIcon,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ProdutoAcabado, formatCurrency } from "@/types/orcamento";
import { Separator } from "@/components/ui/separator";

// Dados mockados para produtos acabados
const produtosMock: ProdutoAcabado[] = [
  {
    id: 1,
    codigo: "PA-001",
    nome: "Painel Acústico Perfurado",
    descricao: "Painel acústico com perfurações regulares para absorção sonora. Acabamento em melamina. Dimensões: 1200x600mm",
    categoria: "Painéis Acústicos",
    unidadeMedida: "UN",
    valorBase: 195.50,
    quantidadeEstoque: 32,
    dataCadastro: "2025-01-15"
  },
  {
    id: 2,
    codigo: "PA-002",
    nome: "Painel Acústico Ranhurado",
    descricao: "Painel acústico com ranhuras lineares para absorção sonora. Acabamento em madeira natural. Dimensões: 1200x600mm",
    categoria: "Painéis Acústicos",
    unidadeMedida: "UN",
    valorBase: 245.90,
    quantidadeEstoque: 28,
    dataCadastro: "2025-01-20"
  },
  {
    id: 3,
    codigo: "PA-003",
    nome: "Baffles Acústicos",
    descricao: "Baffles suspensos para absorção acústica em tetos. Dimensões: 1200x300x50mm",
    categoria: "Absorvedores",
    unidadeMedida: "UN",
    valorBase: 120.00,
    quantidadeEstoque: 45,
    dataCadastro: "2025-02-05"
  },
  {
    id: 4,
    codigo: "PA-004",
    nome: "Porta Acústica 35dB",
    descricao: "Porta acústica com redução sonora de 35dB. Dimensões: 900x2100mm",
    categoria: "Portas Acústicas",
    unidadeMedida: "UN",
    valorBase: 2450.00,
    quantidadeEstoque: 6,
    dataCadastro: "2025-02-10"
  },
  {
    id: 5,
    codigo: "PA-005",
    nome: "Porta Acústica 40dB",
    descricao: "Porta acústica com redução sonora de 40dB. Dimensões: 900x2100mm",
    categoria: "Portas Acústicas",
    unidadeMedida: "UN",
    valorBase: 3200.00,
    quantidadeEstoque: 4,
    dataCadastro: "2025-02-10"
  },
  {
    id: 6,
    codigo: "PA-006",
    nome: "Nuvem Acústica",
    descricao: "Painel acústico suspenso em formato de nuvem. Dimensões: 1200x800mm",
    categoria: "Absorvedores",
    unidadeMedida: "UN",
    valorBase: 280.00,
    quantidadeEstoque: 12,
    dataCadastro: "2025-03-01"
  },
  {
    id: 7,
    codigo: "PA-007",
    nome: "Divisória Acústica Móvel",
    descricao: "Divisória acústica móvel com rodízios. Dimensões: 1800x1500mm",
    categoria: "Divisórias",
    unidadeMedida: "UN",
    valorBase: 1850.00,
    quantidadeEstoque: 8,
    dataCadastro: "2025-03-15"
  }
];

// Dados de vendas por produto (para relatórios)
const vendasProdutosMock = [
  { id: 1, produtoId: 1, quantidade: 15, valorTotal: 2932.50, data: "2025-04-01" },
  { id: 2, produtoId: 2, quantidade: 10, valorTotal: 2459.00, data: "2025-04-05" },
  { id: 3, produtoId: 3, quantidade: 20, valorTotal: 2400.00, data: "2025-04-10" },
  { id: 4, produtoId: 4, quantidade: 2, valorTotal: 4900.00, data: "2025-04-12" },
  { id: 5, produtoId: 6, quantidade: 8, valorTotal: 2240.00, data: "2025-04-15" },
  { id: 6, produtoId: 1, quantidade: 5, valorTotal: 977.50, data: "2025-04-20" },
  { id: 7, produtoId: 3, quantidade: 12, valorTotal: 1440.00, data: "2025-04-25" },
  { id: 8, produtoId: 7, quantidade: 3, valorTotal: 5550.00, data: "2025-04-28" },
];

// Categorias de produtos
const categorias = [
  "Painéis Acústicos",
  "Absorvedores",
  "Portas Acústicas",
  "Divisórias",
  "Revestimentos",
  "Acessórios"
];

interface VendaProduto {
  id: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  data: string;
}

const ProdutosAcabados = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<ProdutoAcabado[]>(produtosMock);
  const [vendasProdutos, setVendasProdutos] = useState<VendaProduto[]>(vendasProdutosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroEstoque, setFiltroEstoque] = useState<string | null>(null);
  const [isProdutoDialogOpen, setIsProdutoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProdutoDetailOpen, setIsProdutoDetailOpen] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState<ProdutoAcabado | null>(null);

  // Produto vazio para novo cadastro
  const produtoVazio: Omit<ProdutoAcabado, "id"> = {
    codigo: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidadeMedida: "UN",
    valorBase: 0,
    quantidadeEstoque: 0,
    dataCadastro: new Date().toISOString().split('T')[0]
  };

  const [novoProduto, setNovoProduto] = useState<Omit<ProdutoAcabado, "id">>(produtoVazio);
  
  // Filtragem de produtos
  const produtosFiltrados = produtos.filter(produto => {
    const matchesSearch = 
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !filtroCategoria || produto.categoria === filtroCategoria;
    
    const matchesEstoque = !filtroEstoque || 
      (filtroEstoque === "baixo" && produto.quantidadeEstoque < 10) ||
      (filtroEstoque === "normal" && produto.quantidadeEstoque >= 10);
    
    return matchesSearch && matchesCategoria && matchesEstoque;
  });
  
  // Formatação de data
  const formatarData = (data: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };
  
  // Calcular valor total em estoque
  const calcularValorTotalEstoque = (): number => {
    return produtos.reduce((total, produto) => {
      return total + (produto.quantidadeEstoque * produto.valorBase);
    }, 0);
  };
  
  // Calcular produtos com estoque baixo
  const contarProdutosBaixoEstoque = (): number => {
    return produtos.filter(p => p.quantidadeEstoque < 10).length;
  };
  
  // Calcular vendas recentes (último mês)
  const calcularVendasRecentesMes = (): number => {
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);
    
    return vendasProdutos
      .filter(v => new Date(v.data) >= umMesAtras)
      .reduce((total, venda) => total + venda.valorTotal, 0);
  };

  // Obter vendas por produto
  const getVendasPorProduto = (produtoId: number): VendaProduto[] => {
    return vendasProdutos.filter(venda => venda.produtoId === produtoId);
  };
  
  // Salvar novo produto ou editar existente
  const handleSalvarProduto = () => {
    if (!novoProduto.codigo || !novoProduto.nome || !novoProduto.categoria) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    if (produtoAtual) {
      // Atualizar produto existente
      const produtosAtualizados = produtos.map(p => 
        p.id === produtoAtual.id ? { ...p, ...novoProduto } : p
      );
      setProdutos(produtosAtualizados);
      toast.success("Produto atualizado com sucesso!");
    } else {
      // Adicionar novo produto
      const novoProdutoCompleto: ProdutoAcabado = {
        id: Date.now(),
        ...novoProduto
      };
      
      setProdutos([...produtos, novoProdutoCompleto]);
      toast.success("Produto adicionado com sucesso!");
    }
    
    // Fechar dialog e resetar estado
    setIsProdutoDialogOpen(false);
    setProdutoAtual(null);
    setNovoProduto(produtoVazio);
  };
  
  // Editar produto
  const handleEditarProduto = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setNovoProduto({
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao,
      categoria: produto.categoria,
      unidadeMedida: produto.unidadeMedida,
      valorBase: produto.valorBase,
      quantidadeEstoque: produto.quantidadeEstoque,
      dataCadastro: produto.dataCadastro
    });
    setIsProdutoDialogOpen(true);
  };
  
  // Excluir produto
  const handleExcluirProduto = () => {
    if (!produtoAtual) return;
    
    // Verificar se o produto tem vendas associadas
    const temVendas = vendasProdutos.some(v => v.produtoId === produtoAtual.id);
    
    if (temVendas) {
      setIsDeleteDialogOpen(false);
      setIsConfirmDialogOpen(true);
      return;
    }
    
    // Excluir produto
    const produtosAtualizados = produtos.filter(p => p.id !== produtoAtual.id);
    setProdutos(produtosAtualizados);
    toast.success("Produto excluído com sucesso!");
    
    setIsDeleteDialogOpen(false);
    setProdutoAtual(null);
  };
  
  // Confirmação forçada para exclusão de produto com vendas
  const handleForceExcluirProduto = () => {
    if (!produtoAtual) return;
    
    // Excluir produto e vendas associadas
    const produtosAtualizados = produtos.filter(p => p.id !== produtoAtual.id);
    const vendasAtualizadas = vendasProdutos.filter(v => v.produtoId !== produtoAtual.id);
    
    setProdutos(produtosAtualizados);
    setVendasProdutos(vendasAtualizadas);
    toast.success("Produto e vendas associadas excluídos com sucesso!");
    
    setIsConfirmDialogOpen(false);
    setProdutoAtual(null);
  };

  // Ver detalhes do produto
  const handleVerDetalhesProduto = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setIsProdutoDetailOpen(true);
  };

  // Criar produto para orçamento
  const handleCriarItemOrcamento = (produto: ProdutoAcabado) => {
    navigate('/orcamentos/novo', { state: { produtoSelecionado: produto } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos Acabados</h1>
        <Dialog open={isProdutoDialogOpen} onOpenChange={setIsProdutoDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setProdutoAtual(null);
              setNovoProduto(produtoVazio);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{produtoAtual ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription>
                {produtoAtual 
                  ? "Atualize os dados do produto abaixo" 
                  : "Preencha os dados do novo produto abaixo"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input 
                    id="codigo" 
                    value={novoProduto.codigo}
                    onChange={(e) => setNovoProduto({...novoProduto, codigo: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select 
                    value={novoProduto.categoria}
                    onValueChange={(value) => setNovoProduto({...novoProduto, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input 
                  id="nome" 
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}
                  className="h-20"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidadeMedida">Unidade de Medida</Label>
                  <Select 
                    value={novoProduto.unidadeMedida}
                    onValueChange={(value) => setNovoProduto({...novoProduto, unidadeMedida: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN (Unidade)</SelectItem>
                      <SelectItem value="M²">M² (Metro Quadrado)</SelectItem>
                      <SelectItem value="M">M (Metro Linear)</SelectItem>
                      <SelectItem value="PÇ">PÇ (Peça)</SelectItem>
                      <SelectItem value="CJ">CJ (Conjunto)</SelectItem>
                      <SelectItem value="KG">KG (Quilograma)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valorBase">Valor Base (R$)</Label>
                  <Input 
                    id="valorBase" 
                    type="number"
                    step="0.01"
                    value={novoProduto.valorBase || ""}
                    onChange={(e) => setNovoProduto({...novoProduto, valorBase: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidadeEstoque">Quantidade em Estoque</Label>
                  <Input 
                    id="quantidadeEstoque" 
                    type="number"
                    value={novoProduto.quantidadeEstoque || ""}
                    onChange={(e) => setNovoProduto({...novoProduto, quantidadeEstoque: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsProdutoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarProduto}>
                {produtoAtual ? "Atualizar Produto" : "Salvar Produto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {produtos.length}
              <span className="text-sm font-normal text-muted-foreground ml-2">itens</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calcularValorTotalEstoque())}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contarProdutosBaixoEstoque()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calcularVendasRecentesMes())}
              <span className="text-sm font-normal text-muted-foreground ml-2">último mês</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Produtos</TabsTrigger>
          <TabsTrigger value="cards">Cartões</TabsTrigger>
          <TabsTrigger value="relatorio">Relatório de Vendas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Produtos Cadastrados</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={filtroCategoria || ""}
                      onValueChange={(value) => setFiltroCategoria(value === "" ? null : value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{filtroCategoria || "Todas as Categorias"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as Categorias</SelectItem>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={filtroEstoque || ""}
                      onValueChange={(value) => setFiltroEstoque(value === "" ? null : value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <div className="flex items-center gap-2">
                          <span>{filtroEstoque === "baixo" ? "Estoque Baixo" : filtroEstoque === "normal" ? "Estoque Normal" : "Todos"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="baixo">Estoque Baixo</SelectItem>
                        <SelectItem value="normal">Estoque Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead className="text-right">Valor Base</TableHead>
                      <TableHead className="text-right">Em Estoque</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum produto encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      produtosFiltrados.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">{produto.codigo}</TableCell>
                          <TableCell>
                            <div>
                              {produto.nome}
                              <div className="text-xs text-muted-foreground hidden sm:block">
                                {produto.descricao.length > 60
                                  ? `${produto.descricao.substring(0, 60)}...`
                                  : produto.descricao}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary" className="font-normal">
                              {produto.categoria}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(produto.valorBase)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={produto.quantidadeEstoque < 10 ? "text-red-500" : ""}>
                                {produto.quantidadeEstoque}
                              </span>
                              <span className="text-muted-foreground">{produto.unidadeMedida}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleVerDetalhesProduto(produto)}
                                className="hidden md:flex"
                              >
                                Detalhes
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditarProduto(produto)}
                              >
                                <Pencil className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">Editar</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  setProdutoAtual(produto);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">Excluir</span>
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleCriarItemOrcamento(produto)}
                              >
                                <FileText className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">Orçar</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {produtosFiltrados.length === 0 ? (
              <Card className="col-span-full p-6 text-center text-muted-foreground">
                Nenhum produto encontrado.
              </Card>
            ) : (
              produtosFiltrados.map((produto) => (
                <Card key={produto.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {produto.codigo}
                        </Badge>
                        <CardTitle className="text-base line-clamp-2">{produto.nome}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="font-normal">
                        {produto.categoria}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="h-20 overflow-hidden text-sm text-muted-foreground mb-4">
                      {produto.descricao || "Sem descrição disponível."}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center p-2 bg-slate-50 rounded-md">
                        <div className="text-xs text-muted-foreground">Valor Base</div>
                        <div className="font-semibold">{formatCurrency(produto.valorBase)}</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-md">
                        <div className="text-xs text-muted-foreground">Em Estoque</div>
                        <div className={`font-semibold ${produto.quantidadeEstoque < 10 ? "text-red-500" : ""}`}>
                          {produto.quantidadeEstoque} {produto.unidadeMedida}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVerDetalhesProduto(produto)}
                      >
                        Detalhes
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCriarItemOrcamento(produto)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Orçar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="relatorio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-muted-foreground" />
                Relatório de Vendas por Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor Un.</TableHead>
                    <TableHead className="text-right">Qtd. Vendida</TableHead>
                    <TableHead className="text-right">Total Vendido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => {
                    const vendasDoProduto = getVendasPorProduto(produto.id);
                    const totalQuantidade = vendasDoProduto.reduce((sum, v) => sum + v.quantidade, 0);
                    const totalVendido = vendasDoProduto.reduce((sum, v) => sum + v.valorTotal, 0);
                    
                    // Só mostra produtos que tiveram vendas
                    if (totalQuantidade === 0) return null;
                    
                    return (
                      <TableRow key={produto.id}>
                        <TableCell>{produto.codigo}</TableCell>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell className="text-right">{formatCurrency(produto.valorBase)}</TableCell>
                        <TableCell className="text-right">{totalQuantidade} {produto.unidadeMedida}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(totalVendido)}</TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {produtos.filter(p => getVendasPorProduto(p.id).length > 0).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Nenhuma venda registrada para os produtos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog de Detalhes do Produto */}
      <Dialog open={isProdutoDetailOpen} onOpenChange={setIsProdutoDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {produtoAtual && (
            <>
              <DialogHeader>
                <DialogTitle>{produtoAtual.nome}</DialogTitle>
                <DialogDescription>
                  Código: {produtoAtual.codigo} | Categoria: {produtoAtual.categoria}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-2">
                    <CardHeader className="py-3">
                      <CardTitle className="flex items-center text-base">
                        <TagIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        Especificações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="space-y-3">
                        <h3 className="font-semibold">Descrição</h3>
                        <p className="text-sm text-muted-foreground">
                          {produtoAtual.descricao || "Sem descrição disponível."}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Unidade de Medida</h4>
                          <p>{produtoAtual.unidadeMedida}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</h4>
                          <p>{formatarData(produtoAtual.dataCadastro)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="flex items-center text-base">
                        <CalculatorIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        Valores
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Valor Base</div>
                          <div className="text-2xl font-bold">{formatCurrency(produtoAtual.valorBase)}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Em Estoque</div>
                          <div className={`text-xl font-semibold ${produtoAtual.quantidadeEstoque < 10 ? "text-red-500" : ""}`}>
                            {produtoAtual.quantidadeEstoque} {produtoAtual.unidadeMedida}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Valor em Estoque</div>
                          <div className="text-xl font-semibold">
                            {formatCurrency(produtoAtual.valorBase * produtoAtual.quantidadeEstoque)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="flex items-center text-base">
                      <Grid3X3 className="mr-2 h-4 w-4 text-muted-foreground" />
                      Histórico de Vendas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    {getVendasPorProduto(produtoAtual.id).length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Quantidade</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getVendasPorProduto(produtoAtual.id)
                            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                            .map((venda) => (
                              <TableRow key={venda.id}>
                                <TableCell>{formatarData(venda.data)}</TableCell>
                                <TableCell className="text-right">{venda.quantidade} {produtoAtual.unidadeMedida}</TableCell>
                                <TableCell className="text-right">{formatCurrency(venda.valorTotal)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Não há histórico de vendas para este produto.
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex items-center justify-between">
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditarProduto(produtoAtual)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar Produto
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setIsProdutoDetailOpen(false);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Produto
                    </Button>
                  </div>
                  
                  <Button onClick={() => setIsProdutoDetailOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {produtoAtual && (
            <div className="border rounded p-4 my-4">
              <div className="font-semibold">{produtoAtual.nome}</div>
              <div className="text-sm text-muted-foreground">Código: {produtoAtual.codigo}</div>
              <div className="text-sm text-muted-foreground">Categoria: {produtoAtual.categoria}</div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleExcluirProduto}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Confirmação para Excluir Produto com Vendas */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Atenção: Dados Relacionados Existentes</DialogTitle>
            <DialogDescription>
              Este produto possui vendas relacionadas. Se prosseguir com a exclusão, 
              todos os registros de venda associados também serão removidos.
            </DialogDescription>
          </DialogHeader>
          
          {produtoAtual && (
            <div className="border-l-4 border-red-400 rounded bg-red-50 p-4 my-4">
              <div className="font-semibold">{produtoAtual.nome}</div>
              <div className="text-sm">Código: {produtoAtual.codigo}</div>
              <div className="mt-2 font-medium text-red-600">
                {getVendasPorProduto(produtoAtual.id).length} registros de venda serão excluídos!
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleForceExcluirProduto}
            >
              Excluir Mesmo Assim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component para o Label
const Label = ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLLabelElement>) => {
  return (
    <p className="text-sm font-medium" {...props}>
      {children}
    </p>
  );
};

export default ProdutosAcabados;
