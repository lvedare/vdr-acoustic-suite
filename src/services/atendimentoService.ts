
import { supabase } from "@/integrations/supabase/client";

export interface Atendimento {
  id?: string;
  cliente_id?: string;
  cliente_nome: string;
  assunto: string;
  contato: string;
  canal: string;
  data: string;
  hora: string;
  status: string;
  mensagem?: string;
  endereco_entrega?: string;
  endereco_obra?: string;
  usar_endereco_cliente?: boolean;
  created_at?: string;
  updated_at?: string;
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

    return data;
  },

  async criar(atendimento: Omit<Atendimento, 'id' | 'created_at' | 'updated_at'>): Promise<Atendimento> {
    console.log('Criando atendimento com dados:', atendimento);
    
    const { data, error } = await supabase
      .from('atendimentos')
      .insert({
        cliente_id: atendimento.cliente_id,
        cliente_nome: atendimento.cliente_nome,
        assunto: atendimento.assunto,
        contato: atendimento.contato,
        canal: atendimento.canal || 'WhatsApp',
        data: atendimento.data,
        hora: atendimento.hora,
        status: atendimento.status || 'Novo',
        mensagem: atendimento.mensagem,
        endereco_entrega: atendimento.endereco_entrega,
        endereco_obra: atendimento.endereco_obra,
        usar_endereco_cliente: atendimento.usar_endereco_cliente ?? true
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar atendimento:', error);
      throw error;
    }

    console.log('Atendimento criado com sucesso:', data);
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

  async verificarRelacionamentos(id: string) {
    // Verificar se há propostas relacionadas
    const { data: propostas, error: errorPropostas } = await supabase
      .from('propostas')
      .select('id')
      .eq('atendimento_id', id);

    if (errorPropostas) {
      console.error('Erro ao verificar propostas:', errorPropostas);
      return { propostas: [] };
    }

    return {
      propostas: propostas || []
    };
  }
};
