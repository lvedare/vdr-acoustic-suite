
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cronogramaService, EventoCronograma } from '@/services/cronogramaService';

export const useCronograma = () => {
  const queryClient = useQueryClient();

  const {
    data: eventos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['cronograma'],
    queryFn: cronogramaService.listarTodos,
  });

  const criarEventoMutation = useMutation({
    mutationFn: cronogramaService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
      toast.success('Evento criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
    },
  });

  const atualizarEventoMutation = useMutation({
    mutationFn: ({ id, evento }: { id: string; evento: Partial<EventoCronograma> }) =>
      cronogramaService.atualizar(id, evento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
      toast.success('Evento atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
    },
  });

  const excluirEventoMutation = useMutation({
    mutationFn: cronogramaService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
      toast.success('Evento excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento');
    },
  });

  return {
    eventos,
    isLoading,
    error,
    criarEvento: criarEventoMutation.mutate,
    atualizarEvento: atualizarEventoMutation.mutate,
    excluirEvento: excluirEventoMutation.mutate,
    isCriando: criarEventoMutation.isPending,
    isAtualizando: atualizarEventoMutation.isPending,
    isExcluindo: excluirEventoMutation.isPending,
  };
};
