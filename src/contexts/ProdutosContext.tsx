
import React, { createContext, useContext, useState, useEffect } from "react";
import { ProdutoAcabado } from "@/types/orcamento";
import { useProdutosSupabase } from "@/hooks/useProdutosSupabase";

interface VendaProduto {
  id: number;
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  data: string;
  cliente: string;
}

interface ProdutosContextType {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
  produtoAtual: ProdutoAcabado | null;
  novoProduto: ProdutoAcabado;
  isProdutoDialogOpen: boolean;
  isComposicaoDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  produtoVazio: ProdutoAcabado;
  setVendasProdutos: React.Dispatch<React.SetStateAction<VendaProduto[]>>;
  setProdutoAtual: React.Dispatch<React.SetStateAction<ProdutoAcabado | null>>;
  setNovoProduto: React.Dispatch<React.SetStateAction<ProdutoAcabado>>;
  setIsProdutoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsComposicaoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  salvarProduto: (produto: ProdutoAcabado) => void;
  editarProduto: (produto: ProdutoAcabado) => void;
  excluirProduto: (id: number) => void;
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

  // Carregar vendas do localStorage (manter por enquanto)
  useEffect(() => {
    const vendasSalvas = localStorage.getItem("vendasProdutos");
    if (vendasSalvas) {
      setVendasProdutos(JSON.parse(vendasSalvas));
    }
  }, []);

  const salvarProduto = (produto: ProdutoAcabado) => {
    if (produto.id === 0) {
      // Criar novo produto
      const novoProdutoData = {
        ...produto,
        id: Date.now() // Será ignorado pelo Supabase que gerará um UUID
      };
      criarProdutoSupabase(novoProdutoData);
    } else {
      // Atualizar produto existente - encontrar o UUID original
      const produtoOriginal = produtosSupabase.find(p => {
        let numericId = 0;
        if (p.id) {
          const str = p.id.toString();
          for (let i = 0; i < str.length; i++) {
            numericId = ((numericId << 5) - numericId + str.charCodeAt(i)) & 0xffffffff;
          }
          numericId = Math.abs(numericId);
        }
        return numericId === produto.id;
      });
      
      if (produtoOriginal?.id) {
        atualizarProdutoSupabase(produtoOriginal.id, produto);
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
    const produtoOriginal = produtosSupabase.find(p => {
      let numericId = 0;
      if (p.id) {
        const str = p.id.toString();
        for (let i = 0; i < str.length; i++) {
          numericId = ((numericId << 5) - numericId + str.charCodeAt(i)) & 0xffffffff;
        }
        numericId = Math.abs(numericId);
      }
      return numericId === id;
    });
    
    if (produtoOriginal?.id) {
      excluirProdutoSupabase(produtoOriginal.id);
    }
  };

  const value: ProdutosContextType = {
    produtos: produtosSupabase,
    vendasProdutos,
    produtoAtual,
    novoProduto,
    isProdutoDialogOpen,
    isComposicaoDialogOpen,
    isDeleteDialogOpen,
    produtoVazio,
    setVendasProdutos,
    setProdutoAtual,
    setNovoProduto,
    setIsProdutoDialogOpen,
    setIsComposicaoDialogOpen,
    setIsDeleteDialogOpen,
    salvarProduto,
    editarProduto,
    excluirProduto,
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
