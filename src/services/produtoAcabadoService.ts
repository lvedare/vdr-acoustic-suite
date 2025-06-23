
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProdutoAcabado } from "@/types/supabase-extended";

export const produtoAcabadoService = {
  async listarTodos(): Promise<SupabaseProdutoAcabado[]> {
    const { data, error } = await supabase
      .from('produtos_acabados')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar produtos acabados:', error);
      throw error;
    }

    return data;
  },

  async criar(produto: Omit<SupabaseProdutoAcabado, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProdutoAcabado> {
    const { data, error } = await supabase
      .from('produtos_acabados')
      .insert(produto)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto acabado:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, produto: Partial<SupabaseProdutoAcabado>): Promise<SupabaseProdutoAcabado> {
    const { data, error } = await supabase
      .from('produtos_acabados')
      .update(produto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar produto acabado:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('produtos_acabados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir produto acabado:', error);
      throw error;
    }
  }
};
