
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propostaService, clienteService } from '@/services/supabaseService';
import { Proposta, ClienteSimplificado } from '@/types/orcamento';
import { toast } from 'sonner';

export const usePropostas = () => {
  const queryClient = useQueryClient();

  // Query para buscar todas as propostas
  const {
    data: propostas = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: propostaService.listarTodas,
  });

  // Query para buscar clientes
  const {
    data: clientes = [],
    isLoading: isLoadingClientes
  } = useQuery({
    queryKey: ['clientes'],
    queryFn: clienteService.listarTodos,
  });

  // Propostas aprovadas para integração com outros módulos
  const propostasAprovadas = propostas.filter(p => p.status === 'aprovada');

  // Mutation para criar proposta
  const criarPropostaMutation = useMutation({
    mutationFn: propostaService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Proposta criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar proposta:', error);
      toast.error('Erro ao criar proposta');
    },
  });

  // Mutation para atualizar proposta
  const atualizarPropostaMutation = useMutation({
    mutationFn: ({ id, proposta }: { id: number; proposta: Partial<Proposta> }) =>
      propostaService.atualizar(id, proposta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Proposta atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar proposta:', error);
      toast.error('Erro ao atualizar proposta');
    },
  });

  // Mutation para excluir proposta
  const excluirPropostaMutation = useMutation({
    mutationFn: propostaService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Proposta excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir proposta:', error);
      toast.error('Erro ao excluir proposta');
    },
  });

  // Mutation para atualizar status
  const atualizarStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Proposta['status'] }) =>
      propostaService.atualizarStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      if (status === 'aprovada') {
        toast.success('Proposta aprovada! Agora pode gerar obra e ordem de produção.');
      } else {
        toast.success('Status atualizado com sucesso!');
      }
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    },
  });

  // Função para converter proposta em obra
  const converterParaObra = (proposta: Proposta) => {
    if (proposta.status !== 'aprovada') {
      toast.error('Apenas propostas aprovadas podem ser convertidas em obras');
      return null;
    }

    return {
      nome: `Obra - ${proposta.numero}`,
      endereco: proposta.observacoes || 'Endereço a definir',
      cliente_id: proposta.cliente.id.toString(),
      projeto_id: null,
      status: 'planejamento' as const,
      data_inicio: null,
      data_previsao: null,
      data_conclusao: null,
      observacoes: `Obra gerada da proposta ${proposta.numero}`
    };
  };

  // Função para converter proposta em ordem de produção
  const converterParaOrdemProducao = (proposta: Proposta) => {
    if (proposta.status !== 'aprovada') {
      toast.error('Apenas propostas aprovadas podem gerar ordens de produção');
      return [];
    }

    return proposta.itens.map(item => ({
      numero: `OP-${proposta.numero}-${item.codigo}`,
      produto_id: null, // Será definido quando selecionar produto
      quantidade: item.quantidade,
      status: 'pendente' as const,
      data_pedido: new Date().toISOString().split('T')[0],
      data_previsao: null,
      data_conclusao: null,
      observacoes: `OP gerada da proposta ${proposta.numero} - ${item.descricao}`
    }));
  };

  // Função para converter proposta em projeto
  const converterParaProjeto = (proposta: Proposta) => {
    if (proposta.status !== 'aprovada') {
      toast.error('Apenas propostas aprovadas podem ser convertidas em projetos');
      return null;
    }

    return {
      nome: `Projeto - ${proposta.numero}`,
      tipo: 'Acústico',
      cliente_id: proposta.cliente.id.toString(),
      status: 'planejamento' as const,
      data_inicio: null,
      data_previsao: null,
      data_conclusao: null,
      observacoes: `Projeto gerado da proposta ${proposta.numero}`
    };
  };

  return {
    // Dados
    propostas,
    propostasAprovadas,
    clientes,
    isLoading,
    isLoadingClientes,
    error,
    
    // Ações
    criarProposta: criarPropostaMutation.mutate,
    atualizarProposta: atualizarPropostaMutation.mutate,
    excluirProposta: excluirPropostaMutation.mutate,
    atualizarStatus: atualizarStatusMutation.mutate,
    refetch,
    
    // Conversões para outros módulos
    converterParaObra,
    converterParaOrdemProducao,
    converterParaProjeto,
    
    // Estados das mutations
    isCriando: criarPropostaMutation.isPending,
    isAtualizando: atualizarPropostaMutation.isPending,
    isExcluindo: excluirPropostaMutation.isPending,
    isAtualizandoStatus: atualizarStatusMutation.isPending,
  };
};

// Hook para migrar dados do localStorage para Supabase
export const useMigrationToSupabase = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { criarProposta } = usePropostas();

  const migrarDados = async () => {
    setIsMigrating(true);
    
    try {
      // Buscar dados do localStorage
      const propostasLocal = localStorage.getItem('propostas');
      const clientesLocal = localStorage.getItem('clientes');
      
      if (propostasLocal) {
        const propostas = JSON.parse(propostasLocal) as Proposta[];
        
        // Migrar cada proposta
        for (const proposta of propostas) {
          try {
            await propostaService.criar(proposta);
          } catch (error) {
            console.error('Erro ao migrar proposta:', proposta.numero, error);
          }
        }
        
        toast.success(`${propostas.length} propostas migradas com sucesso!`);
      }
      
      if (clientesLocal) {
        const clientes = JSON.parse(clientesLocal) as ClienteSimplificado[];
        
        // Migrar clientes que não existem
        for (const cliente of clientes) {
          try {
            await clienteService.criar(cliente);
          } catch (error) {
            // Cliente pode já existir, ignorar erro
            console.log('Cliente já existe ou erro ao criar:', cliente.nome);
          }
        }
      }
      
    } catch (error) {
      console.error('Erro na migração:', error);
      toast.error('Erro ao migrar dados');
    } finally {
      setIsMigrating(false);
    }
  };

  return {
    migrarDados,
    isMigrating
  };
};
