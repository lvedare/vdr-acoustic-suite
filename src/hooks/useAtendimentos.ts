
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atendimentoService, ligacaoService, Ligacao } from '@/services/atendimentoService';
import { toast } from 'sonner';

export const useAtendimentos = () => {
  const queryClient = useQueryClient();

  const { data: atendimentos = [], isLoading, refetch } = useQuery({
    queryKey: ['atendimentos'],
    queryFn: atendimentoService.listarTodos,
  });

  console.log('useAtendimentos - dados carregados:', atendimentos);

  const criarAtendimento = useMutation({
    mutationFn: atendimentoService.criar,
    onSuccess: (novoAtendimento) => {
      console.log('Atendimento criado com sucesso:', novoAtendimento);
      // Invalidar e recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
      toast.success('Atendimento criado com sucesso!');
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
      console.log('Atendimento atualizado com sucesso');
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
      console.log('Atendimento excluído com sucesso');
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
      console.log('Ligação registrada com sucesso');
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
