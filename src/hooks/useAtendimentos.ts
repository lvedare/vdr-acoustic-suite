
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atendimentoService, ligacaoService, Ligacao } from '@/services/atendimentoService';
import { toast } from 'sonner';

export const useAtendimentos = () => {
  const queryClient = useQueryClient();

  const { data: atendimentos = [], isLoading, refetch } = useQuery({
    queryKey: ['atendimentos'],
    queryFn: atendimentoService.listarTodos,
  });

  const criarAtendimento = useMutation({
    mutationFn: atendimentoService.criar,
    onSuccess: (novoAtendimento) => {
      // Forçar recarregamento da lista
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
      queryClient.refetchQueries({ queryKey: ['atendimentos'] });
      
      // Adicionar o novo atendimento diretamente à lista para feedback imediato
      queryClient.setQueryData(['atendimentos'], (old: any[] = []) => [novoAtendimento, ...old]);
      
      toast.success('Atendimento criado com sucesso!');
      console.log('Novo atendimento criado:', novoAtendimento);
    },
    onError: (error) => {
      console.error('Erro ao criar atendimento:', error);
      toast.error('Erro ao criar atendimento');
    },
  });

  const atualizarAtendimento = useMutation({
    mutationFn: ({ id, atendimento }: { id: string; atendimento: any }) =>
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

  const excluirAtendimento = useMutation({
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

  const criarLigacao = useMutation({
    mutationFn: ligacaoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ligacoes'] });
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
    refetch,
    criarAtendimento: criarAtendimento.mutate,
    atualizarAtendimento: atualizarAtendimento.mutate,
    excluirAtendimento: excluirAtendimento.mutate,
    criarLigacao: criarLigacao.mutate,
    isCriando: criarAtendimento.isPending,
    isAtualizando: atualizarAtendimento.isPending,
    isExcluindo: excluirAtendimento.isPending,
    isCriandoLigacao: criarLigacao.isPending,
  };
};
