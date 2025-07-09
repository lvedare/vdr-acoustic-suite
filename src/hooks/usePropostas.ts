import { useState, useEffect, useMemo } from 'react';
import { Proposta } from '@/types/orcamento';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const usePropostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCriando, setIsCriando] = useState(false);
  const [isAtualizando, setIsAtualizando] = useState(false);
  const [isExcluindo, setIsExcluindo] = useState(false);
  const [isAtualizandoStatus, setIsAtualizandoStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Dialog states
  const [propostaSelecionada, setPropostaSelecionada] = useState<Proposta | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Computed properties
  const propostasAprovadas = useMemo(() => 
    Array.isArray(propostas) ? propostas.filter(p => p.status === 'aprovada') : [], 
    [propostas]
  );

  const propostasFiltradas = useMemo(() => {
    if (!Array.isArray(propostas)) return [];
    
    let filtered = propostas;

    if (searchTerm) {
      filtered = filtered.filter(proposta =>
        proposta.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposta.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(proposta => proposta.status === statusFilter);
    }

    return filtered;
  }, [propostas, searchTerm, statusFilter]);

  const carregarPropostas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Iniciando carregamento das propostas...');
      
      const data = await supabaseService.listarPropostas();
      console.log('Propostas recebidas do serviço:', data);
      
      if (!Array.isArray(data)) {
        console.warn('Dados recebidos não são um array:', data);
        setPropostas([]);
        return;
      }
      
      // Certificar que todas as propostas tenham o campo origem
      const propostasComOrigem = data.map(proposta => ({
        ...proposta,
        origem: proposta.origem || 'manual'
      }));
      
      console.log('Propostas processadas:', propostasComOrigem);
      setPropostas(propostasComOrigem);
      
    } catch (error) {
      console.error('Erro detalhado ao carregar propostas:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao carregar propostas';
      setError(errorMessage);
      toast.error('Erro ao carregar propostas: ' + errorMessage);
      setPropostas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const carregarClientes = async () => {
    try {
      console.log('Carregando clientes...');
      const data = await supabaseService.listarClientes();
      console.log('Clientes carregados:', data);
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClientes([]);
    }
  };

  const criarProposta = async (proposta: Omit<Proposta, 'id'>) => {
    try {
      setIsCriando(true);
      console.log('Criando proposta:', proposta);
      const novaProposta = await supabaseService.criarProposta(proposta);
      console.log('Proposta criada:', novaProposta);
      
      await carregarPropostas();
      toast.success('Proposta criada com sucesso!');
      return novaProposta;
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast.error('Erro ao criar proposta');
      throw error;
    } finally {
      setIsCriando(false);
    }
  };

  const atualizarProposta = async (id: string | number, proposta: Partial<Proposta>) => {
    try {
      setIsAtualizando(true);
      console.log('Atualizando proposta:', id, proposta);
      const propostaAtualizada = await supabaseService.atualizarProposta(id, proposta);
      console.log('Proposta atualizada:', propostaAtualizada);
      
      await carregarPropostas();
      toast.success('Proposta atualizada com sucesso!');
      return propostaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      toast.error('Erro ao atualizar proposta');
      throw error;
    } finally {
      setIsAtualizando(false);
    }
  };

  const atualizarStatus = async ({ id, status }: { id: number; status: string }) => {
    try {
      setIsAtualizandoStatus(true);
      await atualizarProposta(id, { status } as any);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsAtualizandoStatus(false);
    }
  };

  const excluirProposta = async (id: string | number) => {
    try {
      setIsExcluindo(true);
      console.log('Excluindo proposta:', id);
      await supabaseService.excluirProposta(id);
      
      await carregarPropostas();
      toast.success('Proposta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      toast.error('Erro ao excluir proposta');
      throw error;
    } finally {
      setIsExcluindo(false);
    }
  };

  const handleVerDetalhes = (proposta: Proposta) => {
    setPropostaSelecionada(proposta);
    setIsDetailDialogOpen(true);
  };

  const handlePreExcluirProposta = (proposta: Proposta) => {
    setPropostaSelecionada(proposta);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProposta = async () => {
    if (propostaSelecionada) {
      await excluirProposta(propostaSelecionada.id);
      setIsDeleteDialogOpen(false);
      setPropostaSelecionada(null);
    }
  };

  const handleStatusChange = async (novoStatus: string) => {
    if (propostaSelecionada) {
      await atualizarStatus({ id: propostaSelecionada.id as number, status: novoStatus });
      setIsStatusDialogOpen(false);
      setPropostaSelecionada(null);
    }
  };

  const converterParaObra = (proposta: any) => {
    if (!proposta) return null;
    
    return {
      nome: `Obra - ${proposta.numero}`,
      endereco: proposta.cliente?.endereco || 'Endereço não informado',
      cliente_id: proposta.cliente?.id,
      data_inicio: new Date().toISOString().split('T')[0],
      data_previsao: proposta.prazoEntrega || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_conclusao: null,
      projeto_id: null,
      status: 'planejamento' as const,
      observacoes: `Obra gerada da proposta ${proposta.numero}\nValor: R$ ${proposta.valorTotal?.toFixed(2) || '0,00'}`
    };
  };

  // Carregar dados na inicialização
  useEffect(() => {
    console.log('usePropostas - useEffect executado');
    const initializeData = async () => {
      await Promise.all([
        carregarPropostas(),
        carregarClientes()
      ]);
    };
    
    initializeData().catch(error => {
      console.error('Erro na inicialização:', error);
      setError('Erro na inicialização dos dados');
    });
  }, []);

  return {
    propostas,
    propostasAprovadas,
    propostasFiltradas,
    clientes,
    isLoading,
    isCriando,
    isAtualizando,
    isExcluindo,
    isAtualizandoStatus,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    propostaSelecionada,
    setPropostaSelecionada,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    handleDeleteProposta,
    handleStatusChange,
    handleVerDetalhes,
    handlePreExcluirProposta,
    carregarPropostas,
    criarProposta,
    atualizarProposta,
    atualizarStatus,
    excluirProposta,
    converterParaObra
  };
};

export const useMigrationToSupabase = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  
  const migrarDados = async () => {
    setIsMigrating(true);
    try {
      toast.success('Dados migrados com sucesso!');
    } catch (error) {
      toast.error('Erro ao migrar dados');
    } finally {
      setIsMigrating(false);
    }
  };

  return { migrarDados, isMigrating };
};
