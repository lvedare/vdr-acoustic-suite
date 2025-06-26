
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { financeiroService, Financeiro } from '@/services/financeiroService';

export const useFinanceiro = () => {
  const queryClient = useQueryClient();

  const {
    data: financeiro = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['financeiro'],
    queryFn: financeiroService.listarTodos,
  });

  const criarFinanceiroMutation = useMutation({
    mutationFn: financeiroService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      toast.success('Item financeiro criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar item financeiro:', error);
      toast.error('Erro ao criar item financeiro');
    },
  });

  const atualizarFinanceiroMutation = useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<Financeiro> }) =>
      financeiroService.atualizar(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      toast.success('Item financeiro atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar item financeiro:', error);
      toast.error('Erro ao atualizar item financeiro');
    },
  });

  const excluirFinanceiroMutation = useMutation({
    mutationFn: financeiroService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      toast.success('Item financeiro excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir item financeiro:', error);
      toast.error('Erro ao excluir item financeiro');
    },
  });

  return {
    financeiro,
    isLoading,
    error,
    criarFinanceiro: criarFinanceiroMutation.mutate,
    atualizarFinanceiro: atualizarFinanceiroMutation.mutate,
    excluirFinanceiro: excluirFinanceiroMutation.mutate,
    isCriando: criarFinanceiroMutation.isPending,
    isAtualizando: atualizarFinanceiroMutation.isPending,
    isExcluindo: excluirFinanceiroMutation.isPending,
  };
};
