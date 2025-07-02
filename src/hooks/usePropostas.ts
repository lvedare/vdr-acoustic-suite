
import { useState, useEffect } from 'react';
import { Proposta } from '@/types/orcamento';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const usePropostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPropostas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Carregando propostas...');
      
      const data = await supabaseService.listarPropostas();
      console.log('Propostas carregadas:', data);
      
      setPropostas(data);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      setError('Erro ao carregar propostas');
      toast.error('Erro ao carregar propostas');
      setPropostas([]); // Definir array vazio como fallback
    } finally {
      setIsLoading(false);
    }
  };

  const criarProposta = async (proposta: Omit<Proposta, 'id'>) => {
    try {
      console.log('Criando proposta:', proposta);
      const novaProposta = await supabaseService.criarProposta(proposta);
      console.log('Proposta criada:', novaProposta);
      
      await carregarPropostas(); // Recarregar lista
      toast.success('Proposta criada com sucesso!');
      return novaProposta;
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast.error('Erro ao criar proposta');
      throw error;
    }
  };

  const atualizarProposta = async (id: string | number, proposta: Partial<Proposta>) => {
    try {
      console.log('Atualizando proposta:', id, proposta);
      const propostaAtualizada = await supabaseService.atualizarProposta(id, proposta);
      console.log('Proposta atualizada:', propostaAtualizada);
      
      await carregarPropostas(); // Recarregar lista
      toast.success('Proposta atualizada com sucesso!');
      return propostaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      toast.error('Erro ao atualizar proposta');
      throw error;
    }
  };

  const excluirProposta = async (id: string | number) => {
    try {
      console.log('Excluindo proposta:', id);
      await supabaseService.excluirProposta(id);
      
      await carregarPropostas(); // Recarregar lista
      toast.success('Proposta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      toast.error('Erro ao excluir proposta');
      throw error;
    }
  };

  useEffect(() => {
    carregarPropostas();
  }, []);

  return {
    propostas,
    isLoading,
    error,
    carregarPropostas,
    criarProposta,
    atualizarProposta,
    excluirProposta
  };
};
