import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProdutoAcabado, ComposicaoProduto } from '@/types/orcamento';
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

// Dados mockados para produtos acabados (agora incluindo composição)
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
    dataCadastro: "2025-01-15",
    composicao: {
      insumos: [
        { id: 101, insumoId: 1, nome: "Madeira MDF 15mm", quantidade: 0.5, valorUnitario: 185.00, valorTotal: 92.50 },
        { id: 102, insumoId: 3, nome: "Perfil Metálico 30mm", quantidade: 2, valorUnitario: 32.50, valorTotal: 65.00 }
      ],
      maoDeObra: {
        fabricacao: 25.00,
        instalacao: 35.00
      },
      despesaAdministrativa: 15.00,
      margemVenda: 30
    }
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
    dataCadastro: "2025-01-20",
    composicao: {
      insumos: [
        { id: 103, insumoId: 1, nome: "Madeira MDF 15mm", quantidade: 1, valorUnitario: 185.00, valorTotal: 185.00 },
        { id: 104, insumoId: 3, nome: "Perfil Metálico 30mm", quantidade: 1, valorUnitario: 32.50, valorTotal: 32.50 }
      ],
      maoDeObra: {
        fabricacao: 30.00,
        instalacao: 40.00
      },
      despesaAdministrativa: 18.00,
      margemVenda: 25
    }
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

export interface VendaProduto {
  id: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  data: string;
}

// Categorias de produtos
export const categorias = [
  "Painéis Acústicos",
  "Absorvedores",
  "Portas Acústicas",
  "Divisórias",
  "Revestimentos",
  "Acessórios"
];

export interface ProdutoVazio extends Omit<ProdutoAcabado, "id"> {}

interface ProdutosContextProps {
  produtos: ProdutoAcabado[];
  setProdutos: React.Dispatch<React.SetStateAction<ProdutoAcabado[]>>;
  vendasProdutos: VendaProduto[];
  setVendasProdutos: React.Dispatch<React.SetStateAction<VendaProduto[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filtroCategoria: string | null;
  setFiltroCategoria: React.Dispatch<React.SetStateAction<string | null>>;
  filtroEstoque: string | null;
  setFiltroEstoque: React.Dispatch<React.SetStateAction<string | null>>;
  produtoAtual: ProdutoAcabado | null;
  setProdutoAtual: React.Dispatch<React.SetStateAction<ProdutoAcabado | null>>;
  isProdutoDialogOpen: boolean;
  setIsProdutoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProdutoDetailOpen: boolean;
  setIsProdutoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isComposicaoDialogOpen: boolean;
  setIsComposicaoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  novoProduto: ProdutoVazio;
  setNovoProduto: React.Dispatch<React.SetStateAction<ProdutoVazio>>;
  composicaoAtual: ComposicaoProduto | null;
  setComposicaoAtual: React.Dispatch<React.SetStateAction<ComposicaoProduto | null>>;
  produtoVazio: ProdutoVazio;
  produtosFiltrados: ProdutoAcabado[];
  formatarData: (data: string) => string;
  calcularValorTotal: (composicao: ComposicaoProduto) => number;
  handleSalvarProduto: () => void;
  handleEditarProduto: (produto: ProdutoAcabado) => void;
  handlePreExcluirProduto: (produto: ProdutoAcabado) => void;
  handleExcluirProduto: () => void;
  handleForceExcluirProduto: () => void;
  handleVerDetalhesProduto: (produto: ProdutoAcabado) => void;
  handleCriarItemOrcamento: (produto: ProdutoAcabado) => void;
  handleEditarComposicao: (produto: ProdutoAcabado) => void;
  handleSalvarComposicao: () => void;
}

const ProdutosContext = createContext<ProdutosContextProps | undefined>(undefined);

export const ProdutosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<ProdutoAcabado[]>(produtosMock);
  const [vendasProdutos, setVendasProdutos] = useState<VendaProduto[]>(vendasProdutosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroEstoque, setFiltroEstoque] = useState<string | null>(null);
  const [isProdutoDialogOpen, setIsProdutoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProdutoDetailOpen, setIsProdutoDetailOpen] = useState(false);
  const [isComposicaoDialogOpen, setIsComposicaoDialogOpen] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState<ProdutoAcabado | null>(null);
  const [composicaoAtual, setComposicaoAtual] = useState<ComposicaoProduto | null>(null);

  // Produto vazio para novo cadastro
  const produtoVazio: ProdutoVazio = {
    codigo: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidadeMedida: "UN",
    valorBase: 0,
    quantidadeEstoque: 0,
    dataCadastro: new Date().toISOString().split('T')[0],
    composicao: {
      insumos: [],
      maoDeObra: {
        fabricacao: 0,
        instalacao: 0
      },
      despesaAdministrativa: 10, // Valor padrão como porcentagem
      margemVenda: 30 // Valor padrão como markup
    }
  };

  const [novoProduto, setNovoProduto] = useState<ProdutoVazio>(produtoVazio);

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

  // Cálculo do valor total com base na composição - atualizado para usar despesa como % e markup
  const calcularValorTotal = (composicao: ComposicaoProduto): number => {
    // Soma do valor dos insumos
    const valorInsumos = composicao.insumos.reduce((acc, insumo) => acc + insumo.valorTotal, 0);
    
    // Soma mão de obra
    const valorMaoDeObra = composicao.maoDeObra.fabricacao + composicao.maoDeObra.instalacao;
    
    // Custo base
    const custoBase = valorInsumos + valorMaoDeObra;
    
    // Despesa administrativa (como percentual do custo base)
    const valorDespesaAdm = (custoBase * composicao.despesaAdministrativa) / 100;
    
    // Subtotal
    const subtotal = custoBase + valorDespesaAdm;
    
    // Aplicação do markup (diferente da margem)
    // Fórmula de markup: Preço = Custo * (1 + Markup/100)
    const valorComMarkup = subtotal * (1 + composicao.margemVenda / 100);
    
    return parseFloat(valorComMarkup.toFixed(2));
  };

  // Importando useNavigate do react-router-dom
  const navigate = useNavigate();
  
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
      dataCadastro: produto.dataCadastro,
      composicao: produto.composicao
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

  // Editar composição do produto
  const handleEditarComposicao = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    if (produto.composicao) {
      setComposicaoAtual({...produto.composicao});
    } else {
      // Se não tiver composição, cria uma nova
      setComposicaoAtual({
        insumos: [],
        maoDeObra: {
          fabricacao: 0,
          instalacao: 0
        },
        despesaAdministrativa: 0,
        margemVenda: 20
      });
    }
    setIsComposicaoDialogOpen(true);
  };

  // Salvar composição do produto
  const handleSalvarComposicao = () => {
    if (!produtoAtual || !composicaoAtual) return;

    // Calcula o valor base com base na composição
    const valorBase = calcularValorTotal(composicaoAtual);
    
    // Atualiza o produto
    const produtosAtualizados = produtos.map(p => 
      p.id === produtoAtual.id ? { 
        ...p, 
        composicao: composicaoAtual,
        valorBase
      } : p
    );
    
    setProdutos(produtosAtualizados);
    setIsComposicaoDialogOpen(false);
    setProdutoAtual(null);
    setComposicaoAtual(null);
    toast.success("Composição do produto atualizada com sucesso!");
  };

  const value = {
    produtos,
    setProdutos,
    vendasProdutos,
    setVendasProdutos,
    searchTerm,
    setSearchTerm,
    filtroCategoria,
    setFiltroCategoria,
    filtroEstoque,
    setFiltroEstoque,
    produtoAtual,
    setProdutoAtual,
    isProdutoDialogOpen,
    setIsProdutoDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    isProdutoDetailOpen,
    setIsProdutoDetailOpen,
    isComposicaoDialogOpen,
    setIsComposicaoDialogOpen,
    novoProduto,
    setNovoProduto,
    composicaoAtual,
    setComposicaoAtual,
    produtoVazio,
    produtosFiltrados,
    formatarData,
    calcularValorTotal,
    handleSalvarProduto,
    handleEditarProduto,
    handlePreExcluirProduto,
    handleExcluirProduto,
    handleForceExcluirProduto,
    handleVerDetalhesProduto,
    handleCriarItemOrcamento,
    handleEditarComposicao,
    handleSalvarComposicao
  };

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  );
};

export const useProdutos = () => {
  const context = useContext(ProdutosContext);
  if (context === undefined) {
    throw new Error("useProdutos must be used within a ProdutosProvider");
  }
  return context;
};
