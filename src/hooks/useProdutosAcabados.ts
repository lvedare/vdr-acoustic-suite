
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produtoAcabadoService } from '@/services/produtoAcabadoService';
import { toast } from 'sonner';

export const useProdutosAcabados = () => {
  const queryClient = useQueryClient();

  const {
    data: produtos = [],
    isLoading,
    error,
    refetch
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

  const adicionarEstoqueMutation = useMutation({
    mutationFn: ({ id, quantidade }: { id: string; quantidade: number }) =>
      produtoAcabadoService.adicionarEstoque(id, quantidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      toast.success('Estoque adicionado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao adicionar estoque:', error);
      toast.error('Erro ao adicionar estoque');
    },
  });

  const removerEstoqueMutation = useMutation({
    mutationFn: ({ id, quantidade }: { id: string; quantidade: number }) =>
      produtoAcabadoService.removerEstoque(id, quantidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      toast.success('Estoque removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover estoque:', error);
      toast.error('Erro ao remover estoque');
    },
  });

  return {
    produtos,
    isLoading,
    error,
    refetch,
    criarProduto: criarProdutoMutation.mutate,
    atualizarProduto: atualizarProdutoMutation.mutate,
    excluirProduto: excluirProdutoMutation.mutate,
    adicionarEstoque: adicionarEstoqueMutation.mutate,
    removerEstoque: removerEstoqueMutation.mutate,
    isCriando: criarProdutoMutation.isPending,
    isAtualizando: atualizarProdutoMutation.isPending,
    isExcluindo: excluirProdutoMutation.isPending,
    isAdicionandoEstoque: adicionarEstoqueMutation.isPending,
    isRemovendoEstoque: removerEstoqueMutation.isPending,
  };
};
