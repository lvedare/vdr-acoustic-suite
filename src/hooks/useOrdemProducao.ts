
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordemProducaoService } from '@/services/ordemProducaoService';
import { toast } from 'sonner';

interface RelatedItem {
  type: string;
  count: number;
  items: string[];
}

export const useOrdemProducao = () => {
  const queryClient = useQueryClient();

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ['ordens-producao'],
    queryFn: ordemProducaoService.listarTodas,
  });

  const criarOrdem = useMutation({
    mutationFn: ordemProducaoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast.success('Ordem de produção criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar ordem:', error);
      toast.error('Erro ao criar ordem de produção');
    },
  });

  const atualizarOrdem = useMutation({
    mutationFn: ({ id, ordem }: { id: string; ordem: any }) =>
      ordemProducaoService.atualizar(id, ordem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast.success('Ordem atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar ordem:', error);
      toast.error('Erro ao atualizar ordem');
    },
  });

  const excluirOrdem = useMutation({
    mutationFn: ordemProducaoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast.success('Ordem excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir ordem:', error);
      toast.error('Erro ao excluir ordem');
    },
  });

  // Verificar relacionamentos antes da exclusão
  const verificarRelacionamentos = async (ordemId: string): Promise<RelatedItem[]> => {
    try {
      const relacionamentos: RelatedItem[] = [];
      
      // Aqui você pode verificar se existe algum relacionamento
      // Por exemplo, verificar se há movimentações de estoque relacionadas
      console.log('Verificando relacionamentos para ordem:', ordemId);
      
      return relacionamentos;
    } catch (error) {
      console.error('Erro ao verificar relacionamentos:', error);
      return [];
    }
  };

  return {
    ordens,
    isLoading,
    criarOrdem: criarOrdem.mutate,
    atualizarOrdem: atualizarOrdem.mutate,
    excluirOrdem: excluirOrdem.mutate,
    verificarRelacionamentos,
    isCriando: criarOrdem.isPending,
    isAtualizando: atualizarOrdem.isPending,
    isExcluindo: excluirOrdem.isPending,
  };
};
