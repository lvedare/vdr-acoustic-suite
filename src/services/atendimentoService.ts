
import { supabase } from "@/integrations/supabase/client";

export interface Atendimento {
  id?: string;
  cliente_id?: string;
  cliente_nome: string;
  contato: string;
  assunto: string;
  mensagem?: string;
  data: string;
  hora: string;
  canal: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface HistoricoAtendimento {
  id?: string;
  atendimento_id: string;
  acao: string;
  descricao?: string;
  usuario?: string;
  data_acao?: string;
}

export interface Ligacao {
  id?: string;
  cliente_id?: string;
  cliente_nome: string;
  telefone: string;
  duracao?: string;
  resumo?: string;
  observacoes?: string;
  data_ligacao?: string;
  usuario?: string;
  created_at?: string;
}

export const atendimentoService = {
  async listarTodos(): Promise<Atendimento[]> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar atendimentos:', error);
      throw error;
    }

    return data || [];
  },

  async buscarPorId(id: string): Promise<Atendimento | null> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar atendimento:', error);
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  async criar(atendimento: Omit<Atendimento, 'id' | 'created_at' | 'updated_at'>): Promise<Atendimento> {
    const { data, error } = await supabase
      .from('atendimentos')
      .insert(atendimento)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar atendimento:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, atendimento: Partial<Atendimento>): Promise<Atendimento> {
    const { data, error } = await supabase
      .from('atendimentos')
      .update(atendimento)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar atendimento:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('atendimentos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir atendimento:', error);
      throw error;
    }
  },

  async adicionarHistorico(historico: Omit<HistoricoAtendimento, 'id' | 'data_acao'>): Promise<HistoricoAtendimento> {
    const { data, error } = await supabase
      .from('historico_atendimentos')
      .insert(historico)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar histórico:', error);
      throw error;
    }

    return data;
  },

  async buscarHistorico(atendimentoId: string): Promise<HistoricoAtendimento[]> {
    const { data, error } = await supabase
      .from('historico_atendimentos')
      .select('*')
      .eq('atendimento_id', atendimentoId)
      .order('data_acao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }

    return data || [];
  }
};

export const ligacaoService = {
  async listarTodas(): Promise<Ligacao[]> {
    const { data, error } = await supabase
      .from('ligacoes')
      .select('*')
      .order('data_ligacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar ligações:', error);
      throw error;
    }

    return data || [];
  },

  async criar(ligacao: Omit<Ligacao, 'id' | 'created_at'>): Promise<Ligacao> {
    const { data, error } = await supabase
      .from('ligacoes')
      .insert(ligacao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar ligação:', error);
      throw error;
    }

    return data;
  }
};
