
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { ProdutoAcabado } from "@/types/orcamento";

// Componentes importados
import { ProdutoDialog } from "@/components/produtos/ProdutoDialog";
import { ConfirmDeleteDialog } from "@/components/produtos/ConfirmDeleteDialog";
import { ForceDeleteDialog } from "@/components/produtos/ForceDeleteDialog";
import { ProdutoDetailDialog } from "@/components/produtos/ProdutoDetailDialog";
import { ProdutoCard } from "@/components/produtos/ProdutoCard";
import { ProdutoTable } from "@/components/produtos/ProdutoTable";
import { ProdutoFilterBar } from "@/components/produtos/ProdutoFilterBar";
import { EstoqueSummaryCards } from "@/components/produtos/EstoqueSummaryCards";
import { ProdutoVendasTable } from "@/components/produtos/ProdutoVendasTable";

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
  
  // Preparar para excluir produto
  const handlePreExcluirProduto = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setIsDeleteDialogOpen(true);
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
        <Button onClick={() => {
          setProdutoAtual(null);
          setNovoProduto(produtoVazio);
          setIsProdutoDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      {/* Cards de resumo */}
      <EstoqueSummaryCards produtos={produtos} vendasProdutos={vendasProdutos} />
      
      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Produtos</TabsTrigger>
          <TabsTrigger value="cards">Cartões</TabsTrigger>
          <TabsTrigger value="relatorio">Relatório de Vendas</TabsTrigger>
        </TabsList>
        
        {/* Tab de Lista */}
        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Produtos Cadastrados</CardTitle>
                <ProdutoFilterBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filtroCategoria={filtroCategoria}
                  setFiltroCategoria={setFiltroCategoria}
                  filtroEstoque={filtroEstoque}
                  setFiltroEstoque={setFiltroEstoque}
                  categorias={categorias}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ProdutoTable
                produtos={produtosFiltrados}
                onEditarProduto={handleEditarProduto}
                onExcluirProduto={handlePreExcluirProduto}
                onVerDetalhes={handleVerDetalhesProduto}
                onCriarItemOrcamento={handleCriarItemOrcamento}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab de Cartões */}
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {produtosFiltrados.length === 0 ? (
              <Card className="col-span-full p-6 text-center text-muted-foreground">
                Nenhum produto encontrado.
              </Card>
            ) : (
              produtosFiltrados.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onVerDetalhes={handleVerDetalhesProduto}
                  onCriarItemOrcamento={handleCriarItemOrcamento}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Tab de Relatórios */}
        <TabsContent value="relatorio">
          <ProdutoVendasTable produtos={produtos} vendasProdutos={vendasProdutos} />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <ProdutoDialog
        isOpen={isProdutoDialogOpen}
        onOpenChange={setIsProdutoDialogOpen}
        produtoAtual={produtoAtual}
        novoProduto={novoProduto}
        setNovoProduto={setNovoProduto}
        onSalvar={handleSalvarProduto}
        categorias={categorias}
      />
      
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleExcluirProduto}
      />
      
      <ForceDeleteDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleForceExcluirProduto}
      />
      
      <ProdutoDetailDialog
        isOpen={isProdutoDetailOpen}
        onOpenChange={setIsProdutoDetailOpen}
        produto={produtoAtual}
        formatarData={formatarData}
      />
    </div>
  );
};

export default ProdutosAcabados;
