
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { atendimentoService, ligacaoService, Atendimento, Ligacao } from '@/services/atendimentoService';

export const useAtendimentos = () => {
  const queryClient = useQueryClient();

  const {
    data: atendimentos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['atendimentos'],
    queryFn: atendimentoService.listarTodos,
  });

  const criarAtendimentoMutation = useMutation({
    mutationFn: atendimentoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
      toast.success('Atendimento criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar atendimento:', error);
      toast.error('Erro ao criar atendimento');
    },
  });

  const atualizarAtendimentoMutation = useMutation({
    mutationFn: ({ id, atendimento }: { id: string; atendimento: Partial<Atendimento> }) =>
      atendimentoService.atualizar(id, atendimento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
      toast.success('Atendimento atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar atendimento:', error);
      toast.error('Erro ao atualizar atendimento');
    },
  });

  const excluirAtendimentoMutation = useMutation({
    mutationFn: atendimentoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
      toast.success('Atendimento excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir atendimento:', error);
      toast.error('Erro ao excluir atendimento');
    },
  });

  const criarLigacaoMutation = useMutation({
    mutationFn: ligacaoService.criar,
    onSuccess: () => {
      toast.success('Ligação registrada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao registrar ligação:', error);
      toast.error('Erro ao registrar ligação');
    },
  });

  return {
    atendimentos,
    isLoading,
    error,
    criarAtendimento: criarAtendimentoMutation.mutate,
    atualizarAtendimento: atualizarAtendimentoMutation.mutate,
    excluirAtendimento: excluirAtendimentoMutation.mutate,
    criarLigacao: criarLigacaoMutation.mutate,
    isCriando: criarAtendimentoMutation.isPending,
    isAtualizando: atualizarAtendimentoMutation.isPending,
    isExcluindo: excluirAtendimentoMutation.isPending,
    isCriandoLigacao: criarLigacaoMutation.isPending,
  };
};
