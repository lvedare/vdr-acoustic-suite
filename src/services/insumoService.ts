
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
  }
};
