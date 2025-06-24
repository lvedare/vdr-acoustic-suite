
import { supabase } from "@/integrations/supabase/client";
import { SupabaseInsumo } from "@/types/supabase-extended";

export const insumoService = {
  async listarTodos(): Promise<SupabaseInsumo[]> {
    const { data, error } = await supabase
      .from('insumos')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar insumos:', error);
      throw error;
    }

    return data;
  },

  async criar(insumo: Omit<SupabaseInsumo, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseInsumo> {
    const { data, error } = await supabase
      .from('insumos')
      .insert(insumo)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar insumo:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, insumo: Partial<SupabaseInsumo>): Promise<SupabaseInsumo> {
    const { data, error } = await supabase
      .from('insumos')
      .update(insumo)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar insumo:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('insumos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir insumo:', error);
      throw error;
    }
  },

  async adicionarEstoque(id: string, quantidade: number): Promise<SupabaseInsumo> {
    // Get current stock first
    const { data: currentData, error: fetchError } = await supabase
      .from('insumos')
      .select('quantidade_estoque')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar estoque atual:', fetchError);
      throw fetchError;
    }

    const novaQuantidade = currentData.quantidade_estoque + quantidade;

    const { data, error } = await supabase
      .from('insumos')
      .update({ quantidade_estoque: novaQuantidade })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar estoque:', error);
      throw error;
    }

    return data;
  },

  async removerEstoque(id: string, quantidade: number): Promise<SupabaseInsumo> {
    // Get current stock first
    const { data: currentData, error: fetchError } = await supabase
      .from('insumos')
      .select('quantidade_estoque')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar estoque atual:', fetchError);
      throw fetchError;
    }

    const novaQuantidade = Math.max(0, currentData.quantidade_estoque - quantidade);

    const { data, error } = await supabase
      .from('insumos')
      .update({ quantidade_estoque: novaQuantidade })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao remover estoque:', error);
      throw error;
    }

    return data;
  }
};
