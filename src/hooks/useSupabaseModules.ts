
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  insumoService,
  produtoAcabadoService,
  projetoService,
  obraService,
  ordemProducaoService,
  movimentacaoEstoqueService,
  vendaProdutoService
} from '@/services/supabaseExtendedService';

// Hook para Insumos
export const useInsumos = () => {
  const queryClient = useQueryClient();

  const {
    data: insumos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['insumos'],
    queryFn: insumoService.listarTodos,
  });

  const criarInsumoMutation = useMutation({
    mutationFn: insumoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar insumo:', error);
      toast.error('Erro ao criar insumo');
    },
  });

  const atualizarInsumoMutation = useMutation({
    mutationFn: ({ id, insumo }: { id: string; insumo: any }) =>
      insumoService.atualizar(id, insumo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar insumo:', error);
      toast.error('Erro ao atualizar insumo');
    },
  });

  const excluirInsumoMutation = useMutation({
    mutationFn: insumoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir insumo:', error);
      toast.error('Erro ao excluir insumo');
    },
  });

  return {
    insumos,
    isLoading,
    error,
    criarInsumo: criarInsumoMutation.mutate,
    atualizarInsumo: atualizarInsumoMutation.mutate,
    excluirInsumo: excluirInsumoMutation.mutate,
    isCriando: criarInsumoMutation.isPending,
    isAtualizando: atualizarInsumoMutation.isPending,
    isExcluindo: excluirInsumoMutation.isPending,
  };
};

// Hook para Produtos Acabados  
export const useProdutosAcabados = () => {
  const queryClient = useQueryClient();

  const {
    data: produtos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['produtos-acabados'],
    queryFn: produtoAcabadoService.listarTodos,
  });

  const criarProdutoMutation = useMutation({
    mutationFn: produtoAcabadoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto');
    },
  });

  const atualizarProdutoMutation = useMutation({
    mutationFn: ({ id, produto }: { id: string; produto: any }) =>
      produtoAcabadoService.atualizar(id, produto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
    },
  });

  const excluirProdutoMutation = useMutation({
    mutationFn: produtoAcabadoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    },
  });

  return {
    produtos,
    isLoading,
    error,
    criarProduto: criarProdutoMutation.mutate,
    atualizarProduto: atualizarProdutoMutation.mutate,
    excluirProduto: excluirProdutoMutation.mutate,
    isCriando: criarProdutoMutation.isPending,
    isAtualizando: atualizarProdutoMutation.isPending,
    isExcluindo: excluirProdutoMutation.isPending,
  };
};

// Hook para Projetos
export const useProjetos = () => {
  const queryClient = useQueryClient();

  const {
    data: projetos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['projetos'],
    queryFn: projetoService.listarTodos,
  });

  const criarProjetoMutation = useMutation({
    mutationFn: projetoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto');
    },
  });

  const atualizarProjetoMutation = useMutation({
    mutationFn: ({ id, projeto }: { id: string; projeto: any }) =>
      projetoService.atualizar(id, projeto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Erro ao atualizar projeto');
    },
  });

  const excluirProjetoMutation = useMutation({
    mutationFn: projetoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    },
  });

  return {
    projetos,
    isLoading,
    error,
    criarProjeto: criarProjetoMutation.mutate,
    atualizarProjeto: atualizarProjetoMutation.mutate,
    excluirProjeto: excluirProjetoMutation.mutate,
    isCriando: criarProjetoMutation.isPending,
    isAtualizando: atualizarProjetoMutation.isPending,
    isExcluindo: excluirProjetoMutation.isPending,
  };
};

// Hook para Obras
export const useObras = () => {
  const queryClient = useQueryClient();

  const {
    data: obras = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['obras'],
    queryFn: obraService.listarTodas,
  });

  const criarObraMutation = useMutation({
    mutationFn: obraService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar obra:', error);
      toast.error('Erro ao criar obra');
    },
  });

  const atualizarObraMutation = useMutation({
    mutationFn: ({ id, obra }: { id: string; obra: any }) =>
      obraService.atualizar(id, obra),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar obra:', error);
      toast.error('Erro ao atualizar obra');
    },
  });

  const excluirObraMutation = useMutation({
    mutationFn: obraService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir obra:', error);
      toast.error('Erro ao excluir obra');
    },
  });

  return {
    obras,
    isLoading,
    error,
    criarObra: criarObraMutation.mutate,
    atualizarObra: atualizarObraMutation.mutate,
    excluirObra: excluirObraMutation.mutate,
    isCriando: criarObraMutation.isPending,
    isAtualizando: atualizarObraMutation.isPending,
    isExcluindo: excluirObraMutation.isPending,
  };
};

// Hook para Ordens de Produção
export const useOrdensProducao = () => {
  const queryClient = useQueryClient();

  const {
    data: ordensProducao = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['ordens-producao'],
    queryFn: ordemProducaoService.listarTodas,
  });

  const criarOrdemMutation = useMutation({
    mutationFn: ordemProducaoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast.success('Ordem de produção criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar ordem de produção:', error);
      toast.error('Erro ao criar ordem de produção');
    },
  });

  const atualizarOrdemMutation = useMutation({
    mutationFn: ({ id, ordem }: { id: string; ordem: any }) =>
      ordemProducaoService.atualizar(id, ordem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast.success('Ordem de produção atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar ordem de produção:', error);
      toast.error('Erro ao atualizar ordem de produção');
    },
  });

  const excluirOrdemMutation = useMutation({
    mutationFn: ordemProducaoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast.success('Ordem de produção excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir ordem de produção:', error);
      toast.error('Erro ao excluir ordem de produção');
    },
  });

  return {
    ordensProducao,
    isLoading,
    error,
    criarOrdem: criarOrdemMutation.mutate,
    atualizarOrdem: atualizarOrdemMutation.mutate,
    excluirOrdem: excluirOrdemMutation.mutate,
    isCriando: criarOrdemMutation.isPending,
    isAtualizando: atualizarOrdemMutation.isPending,
    isExcluindo: excluirOrdemMutation.isPending,
  };
};
