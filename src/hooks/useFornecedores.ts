
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fornecedorService } from '@/services/fornecedorService';
import { toast } from 'sonner';

export const useFornecedores = () => {
  const queryClient = useQueryClient();

  const {
    data: fornecedores = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: fornecedorService.listarTodos,
  });

  const criarFornecedorMutation = useMutation({
    mutationFn: fornecedorService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast.success('Fornecedor criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar fornecedor:', error);
      toast.error('Erro ao criar fornecedor');
    },
  });

  const atualizarFornecedorMutation = useMutation({
    mutationFn: ({ id, fornecedor }: { id: string; fornecedor: any }) =>
      fornecedorService.atualizar(id, fornecedor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast.success('Fornecedor atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor');
    },
  });

  const excluirFornecedorMutation = useMutation({
    mutationFn: fornecedorService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast.success('Fornecedor excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir fornecedor:', error);
      toast.error('Erro ao excluir fornecedor');
    },
  });

  return {
    fornecedores,
    isLoading,
    error,
    refetch,
    criarFornecedor: criarFornecedorMutation.mutate,
    atualizarFornecedor: atualizarFornecedorMutation.mutate,
    excluirFornecedor: excluirFornecedorMutation.mutate,
    isCriando: criarFornecedorMutation.isPending,
    isAtualizando: atualizarFornecedorMutation.isPending,
    isExcluindo: excluirFornecedorMutation.isPending,
  };
};
