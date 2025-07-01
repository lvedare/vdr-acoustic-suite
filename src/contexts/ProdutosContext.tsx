import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ProdutoAcabado } from "@/types/orcamento";
import { useProdutosSupabase } from "@/hooks/useProdutosSupabase";

export interface VendaProduto {
  id: number;
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  data: string;
  cliente: string;
}

export const categorias = [
  "Eletrônicos",
  "Roupas",
  "Casa e Jardim",
  "Esportes",
  "Livros",
  "Saúde e Beleza",
  "Automóveis",
  "Outros"
];

interface ProdutosContextType {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
  produtoAtual: ProdutoAcabado | null;
  novoProduto: ProdutoAcabado;
  isProdutoDialogOpen: boolean;
  isComposicaoDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isConfirmDialogOpen: boolean;
  isProdutoDetailOpen: boolean;
  produtoVazio: ProdutoAcabado;
  searchTerm: string;
  filtroCategoria: string;
  filtroEstoque: string;
  produtosFiltrados: ProdutoAcabado[];
  composicaoAtual: any;
  setVendasProdutos: React.Dispatch<React.SetStateAction<VendaProduto[]>>;
  setProdutoAtual: React.Dispatch<React.SetStateAction<ProdutoAcabado | null>>;
  setNovoProduto: React.Dispatch<React.SetStateAction<ProdutoAcabado>>;
  setIsProdutoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsComposicaoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProdutoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFiltroCategoria: React.Dispatch<React.SetStateAction<string>>;
  setFiltroEstoque: React.Dispatch<React.SetStateAction<string>>;
  setComposicaoAtual: React.Dispatch<React.SetStateAction<any>>;
  salvarProduto: (produto: ProdutoAcabado) => void;
  editarProduto: (produto: ProdutoAcabado) => void;
  excluirProduto: (id: number) => void;
  handleSalvarProduto: () => void;
  handleExcluirProduto: () => void;
  handleForceExcluirProduto: () => void;
  handleEditarProduto: (produto: ProdutoAcabado) => void;
  handlePreExcluirProduto: (produto: ProdutoAcabado) => void;
  handleVerDetalhesProduto: (produto: ProdutoAcabado) => void;
  handleCriarItemOrcamento: (produto: ProdutoAcabado) => void;
  handleEditarComposicao: (produto: ProdutoAcabado) => void;
  handleSalvarComposicao: () => void;
  formatarData: (data: string) => string;
  calcularValorTotal: () => number;
  isLoading: boolean;
  isSaving: boolean;
}

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined);

export const produtoVazio: ProdutoAcabado = {
  id: 0,
  codigo: "",
  nome: "",
  descricao: "",
  categoria: "",
  unidadeMedida: "UN",
  valorBase: 0,
  quantidadeEstoque: 0,
  dataCadastro: new Date().toISOString().split('T')[0]
};

export const ProdutosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar o hook do Supabase
  const { 
    produtos: produtosSupabase, 
    isLoading, 
    criarProduto: criarProdutoSupabase,
    atualizarProduto: atualizarProdutoSupabase,
    excluirProduto: excluirProdutoSupabase,
    isCriando,
    isAtualizando,
    isExcluindo
  } = useProdutosSupabase();

  const [vendasProdutos, setVendasProdutos] = useState<VendaProduto[]>([]);
  const [produtoAtual, setProdutoAtual] = useState<ProdutoAcabado | null>(null);
  const [novoProduto, setNovoProduto] = useState<ProdutoAcabado>(produtoVazio);
  const [isProdutoDialogOpen, setIsProdutoDialogOpen] = useState(false);
  const [isComposicaoDialogOpen, setIsComposicaoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProdutoDetailOpen, setIsProdutoDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstoque, setFiltroEstoque] = useState("");
  const [composicaoAtual, setComposicaoAtual] = useState<any>(null);

  // Carregar vendas do localStorage (manter por enquanto)
  useEffect(() => {
    const vendasSalvas = localStorage.getItem("vendasProdutos");
    if (vendasSalvas) {
      setVendasProdutos(JSON.parse(vendasSalvas));
    }
  }, []);

  // Filtrar produtos
  const produtosFiltrados = useMemo(() => {
    return produtosSupabase.filter(produto => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = !filtroCategoria || produto.categoria === filtroCategoria;
      const matchesEstoque = !filtroEstoque || 
        (filtroEstoque === "baixo" && produto.quantidadeEstoque < 10) ||
        (filtroEstoque === "alto" && produto.quantidadeEstoque >= 10);
      
      return matchesSearch && matchesCategoria && matchesEstoque;
    });
  }, [produtosSupabase, searchTerm, filtroCategoria, filtroEstoque]);

  // Helper function to find original UUID by numeric ID
  const findOriginalUUID = (numericId: number): string | null => {
    const produtoOriginal = produtosSupabase.find(p => {
      let generatedId = 0;
      if (p.id) {
        const str = p.id.toString();
        for (let i = 0; i < str.length; i++) {
          generatedId = ((generatedId << 5) - generatedId + str.charCodeAt(i)) & 0xffffffff;
        }
        generatedId = Math.abs(generatedId);
      }
      return generatedId === numericId;
    });
    
    return produtoOriginal?.id || null;
  };

  const salvarProduto = (produto: ProdutoAcabado) => {
    if (produto.id === 0) {
      // Criar novo produto - usar a função de criação que aceita objeto sem ID
      criarProdutoSupabase({
        codigo: produto.codigo,
        nome: produto.nome,
        descricao: produto.descricao,
        categoria: produto.categoria,
        unidade_medida: produto.unidadeMedida,
        valor_base: produto.valorBase,
        quantidade_estoque: produto.quantidadeEstoque,
        data_cadastro: produto.dataCadastro
      });
    } else {
      // Atualizar produto existente - encontrar o UUID original
      const originalUUID = findOriginalUUID(produto.id);
      
      if (originalUUID) {
        atualizarProdutoSupabase(originalUUID, produto);
      }
    }
  };

  const editarProduto = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setNovoProduto(produto);
    setIsProdutoDialogOpen(true);
  };

  const excluirProduto = (id: number) => {
    // Encontrar o UUID original do produto
    const originalUUID = findOriginalUUID(id);
    
    if (originalUUID) {
      excluirProdutoSupabase(originalUUID);
    }
  };

  // Handlers for components
  const handleSalvarProduto = () => {
    salvarProduto(novoProduto);
    setIsProdutoDialogOpen(false);
    setNovoProduto(produtoVazio);
    setProdutoAtual(null);
  };

  const handleExcluirProduto = () => {
    if (produtoAtual) {
      excluirProduto(produtoAtual.id);
      setIsDeleteDialogOpen(false);
      setProdutoAtual(null);
    }
  };

  const handleForceExcluirProduto = () => {
    if (produtoAtual) {
      excluirProduto(produtoAtual.id);
      setIsConfirmDialogOpen(false);
      setProdutoAtual(null);
    }
  };

  const handleEditarProduto = (produto: ProdutoAcabado) => {
    editarProduto(produto);
  };

  const handlePreExcluirProduto = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setIsDeleteDialogOpen(true);
  };

  const handleVerDetalhesProduto = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setIsProdutoDetailOpen(true);
  };

  const handleCriarItemOrcamento = (produto: ProdutoAcabado) => {
    console.log("Criar item orçamento:", produto);
  };

  const handleEditarComposicao = (produto: ProdutoAcabado) => {
    setProdutoAtual(produto);
    setComposicaoAtual(null);
    setIsComposicaoDialogOpen(true);
  };

  const handleSalvarComposicao = () => {
    setIsComposicaoDialogOpen(false);
    setComposicaoAtual(null);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularValorTotal = () => {
    return 0; // Placeholder
  };

  const value: ProdutosContextType = {
    produtos: produtosSupabase,
    vendasProdutos,
    produtoAtual,
    novoProduto,
    isProdutoDialogOpen,
    isComposicaoDialogOpen,
    isDeleteDialogOpen,
    isConfirmDialogOpen,
    isProdutoDetailOpen,
    produtoVazio,
    searchTerm,
    filtroCategoria,
    filtroEstoque,
    produtosFiltrados,
    composicaoAtual,
    setVendasProdutos,
    setProdutoAtual,
    setNovoProduto,
    setIsProdutoDialogOpen,
    setIsComposicaoDialogOpen,
    setIsDeleteDialogOpen,
    setIsConfirmDialogOpen,
    setIsProdutoDetailOpen,
    setSearchTerm,
    setFiltroCategoria,
    setFiltroEstoque,
    setComposicaoAtual,
    salvarProduto,
    editarProduto,
    excluirProduto,
    handleSalvarProduto,
    handleExcluirProduto,
    handleForceExcluirProduto,
    handleEditarProduto,
    handlePreExcluirProduto,
    handleVerDetalhesProduto,
    handleCriarItemOrcamento,
    handleEditarComposicao,
    handleSalvarComposicao,
    formatarData,
    calcularValorTotal,
    isLoading,
    isSaving: isCriando || isAtualizando || isExcluindo
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
    throw new Error("useProdutos deve ser usado dentro de um ProdutosProvider");
  }
  return context;
};
