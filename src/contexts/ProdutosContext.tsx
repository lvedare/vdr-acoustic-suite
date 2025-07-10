import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProdutosAcabados } from '@/hooks/useProdutosAcabados';
import { useComposicaoProduto } from '@/hooks/useComposicaoProduto';
import { useVendaProduto } from '@/hooks/useVendaProduto';
import { categoriasAcusticas } from '@/types/supabase-extended';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  unidadeMedida: string;
  quantidadeEstoque: number;
  dataCadastro: string;
  valorBase: number;
}

interface Composicao {
  id: string;
  produtoId: string;
  insumoId: string;
  quantidade: number;
  observacao: string | null;
}

interface VendaProduto {
  id: string;
  produtoId: string | null;
  clienteId: string | null;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataVenda: string;
  observacoes: string | null;
}

interface ProdutoContextType {
  produtos: Produto[];
  isLoading: boolean;
  error: any;
  produtoAtual: Produto | null;
  novoProduto: Omit<Produto, 'id'>;
  setNovoProduto: (produto: Omit<Produto, 'id'>) => void;
  composicaoAtual: Composicao | null;
  setComposicaoAtual: (composicao: Composicao | null) => void;
  composicoes: Composicao[];
  vendasProdutos: VendaProduto[];
  isProdutoDialogOpen: boolean;
  setIsProdutoDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  isProdutoDetailOpen: boolean;
  setIsProdutoDetailOpen: (open: boolean) => void;
  isComposicaoDialogOpen: boolean;
  setIsComposicaoDialogOpen: (open: boolean) => void;
  setProdutoAtual: (produto: Produto | null) => void;
  handleSalvarProduto: () => Promise<void>;
  handleExcluirProduto: () => void;
  handleForceExcluirProduto: () => void;
  handleVerDetalhesProduto: (produto: Produto) => void;
  handleEditarComposicao: (composicao: Composicao) => void;
  handleSalvarComposicao: (composicao: Composicao) => Promise<void>;
  formatarData: (data: string) => string;
  calcularValorTotal: () => number;
  categorias: string[];
  produtoVazio: Omit<Produto, 'id'>;
}

export const categorias = categoriasAcusticas;

const ProdutosContext = createContext<ProdutoContextType | undefined>(undefined);

export const ProdutosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    produtos,
    isLoading,
    error,
    criarProduto,
    atualizarProduto,
    excluirProduto
  } = useProdutosAcabados();
  const {
    composicoes,
    criarComposicao,
    atualizarComposicao,
    excluirComposicao
  } = useComposicaoProduto();
  const {
    vendasProdutos,
    criarVendaProduto,
    atualizarVendaProduto,
    excluirVendaProduto
  } = useVendaProduto();

  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
  const [novoProduto, setNovoProduto] = useState<Omit<Produto, 'id'>>({
    codigo: '',
    nome: '',
    descricao: '',
    categoria: '',
    unidadeMedida: 'un',
    quantidadeEstoque: 0,
    dataCadastro: new Date().toISOString().split('T')[0],
    valorBase: 0
  });
  const [composicaoAtual, setComposicaoAtual] = useState<Composicao | null>(null);
  const [isProdutoDialogOpen, setIsProdutoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProdutoDetailOpen, setIsProdutoDetailOpen] = useState(false);
  const [isComposicaoDialogOpen, setIsComposicaoDialogOpen] = useState(false);

  const produtoVazio = {
    codigo: '',
    nome: '',
    descricao: '',
    categoria: '',
    unidadeMedida: 'un',
    quantidadeEstoque: 0,
    dataCadastro: new Date().toISOString().split('T')[0],
  };

  // Gerar próximo código automaticamente
  const gerarProximoCodigo = async () => {
    try {
      const { data, error } = await supabase.rpc('gerar_proximo_codigo_produto');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      return 'PA001'; // fallback
    }
  };

  const handleSalvarProduto = async () => {
    try {
      if (produtoAtual) {
        // Editar produto existente
        atualizarProduto({
          id: produtoAtual.id,
          produto: {
            ...novoProduto,
            // Remove valor_base - será calculado pela composição
            valor_base: 0
          }
        });
      } else {
        // Criar novo produto
        const proximoCodigo = await gerarProximoCodigo();
        const produtoData = {
          ...novoProduto,
          codigo: proximoCodigo,
          valor_base: 0, // Remove valor base
          quantidade_estoque: novoProduto.quantidadeEstoque || 0,
          unidade_medida: novoProduto.unidadeMedida,
          data_cadastro: novoProduto.dataCadastro
        };
        
        criarProduto(produtoData);
      }
      setIsProdutoDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    }
  };

  const handleExcluirProduto = () => {
    if (produtoAtual) {
      excluirProduto(produtoAtual.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleForceExcluirProduto = () => {
    // Implementar lógica para exclusão forçada (se necessário)
    setIsConfirmDialogOpen(false);
  };

  const handleVerDetalhesProduto = (produto: Produto) => {
    setProdutoAtual(produto);
    setIsProdutoDetailOpen(true);
  };

  const handleEditarComposicao = (composicao: Composicao) => {
    setComposicaoAtual(composicao);
    setIsComposicaoDialogOpen(true);
  };

  const handleSalvarComposicao = async (composicao: Composicao) => {
    try {
      if (composicaoAtual) {
        // Editar composição existente
        atualizarComposicao({
          id: composicaoAtual.id,
          composicao: composicao
        });
      } else {
        // Criar nova composição
        criarComposicao(composicao);
      }
      setIsComposicaoDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar composição:', error);
      toast.error('Erro ao salvar composição');
    }
  };

  const formatarData = (data: string): string => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const calcularValorTotal = (): number => {
    // Implementar lógica para calcular o valor total do produto
    return 0;
  };

  return (
    <ProdutosContext.Provider value={{
      produtos,
      isLoading,
      error,
      produtoAtual,
      novoProduto,
      setNovoProduto,
      composicaoAtual,
      setComposicaoAtual,
      composicoes,
      vendasProdutos,
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
      setProdutoAtual,
      handleSalvarProduto,
      handleExcluirProduto,
      handleForceExcluirProduto,
      handleVerDetalhesProduto,
      handleEditarComposicao,
      handleSalvarComposicao,
      formatarData,
      calcularValorTotal,
      categorias,
      produtoVazio,
    }}>
      {children}
    </ProdutosContext.Provider>
  );
};

export const useProdutos = () => {
  const context = useContext(ProdutosContext);
  if (context === undefined) {
    throw new Error('useProdutos must be used within a ProdutosProvider');
  }
  return context;
};
