
import { supabase } from "@/integrations/supabase/client";

export interface Financeiro {
  id?: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'vencido';
  forma_pagamento?: string;
  cliente_id?: string;
  proposta_id?: string;
  obra_id?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export const financeiroService = {
  async listarTodos(): Promise<Financeiro[]> {
    const { data, error } = await supabase
      .from('financeiro')
      .select('*')
      .order('data_vencimento', { ascending: true });

    if (error) {
      console.error('Erro ao buscar financeiro:', error);
      throw error;
    }

    return data || [];
  },

  async criar(item: Omit<Financeiro, 'id' | 'created_at' | 'updated_at'>): Promise<Financeiro> {
    const { data, error } = await supabase
      .from('financeiro')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar item financeiro:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, item: Partial<Financeiro>): Promise<Financeiro> {
    const { data, error } = await supabase
      .from('financeiro')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar item financeiro:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('financeiro')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir item financeiro:', error);
      throw error;
    }
  }
};
