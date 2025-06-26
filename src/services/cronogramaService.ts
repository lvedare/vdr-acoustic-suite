
import { supabase } from "@/integrations/supabase/client";

export interface EventoCronograma {
  id?: string;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  prioridade: string;
  responsavel?: string;
  cliente_id?: string;
  proposta_id?: string;
  obra_id?: string;
  cor?: string;
  created_at?: string;
  updated_at?: string;
}

export const cronogramaService = {
  async listarTodos(): Promise<EventoCronograma[]> {
    const { data, error } = await supabase
      .from('cronograma')
      .select('*')
      .order('data_inicio', { ascending: true });

    if (error) {
      console.error('Erro ao buscar cronograma:', error);
      throw error;
    }

    return data || [];
  },

  async criar(evento: Omit<EventoCronograma, 'id' | 'created_at' | 'updated_at'>): Promise<EventoCronograma> {
    const { data, error } = await supabase
      .from('cronograma')
      .insert(evento)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, evento: Partial<EventoCronograma>): Promise<EventoCronograma> {
    const { data, error } = await supabase
      .from('cronograma')
      .update(evento)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('cronograma')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir evento:', error);
      throw error;
    }
  }
};
