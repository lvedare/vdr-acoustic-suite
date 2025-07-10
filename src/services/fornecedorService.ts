
import { supabase } from "@/integrations/supabase/client";
import { SupabaseFornecedor } from "@/types/supabase-extended";

export const fornecedorService = {
  async listarTodos(): Promise<SupabaseFornecedor[]> {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('Erro ao buscar fornecedores:', error);
      throw error;
    }

    return data;
  },

  async criar(fornecedor: Omit<SupabaseFornecedor, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseFornecedor> {
    const { data, error } = await supabase
      .from('fornecedores')
      .insert(fornecedor)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar fornecedor:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, fornecedor: Partial<SupabaseFornecedor>): Promise<SupabaseFornecedor> {
    const { data, error } = await supabase
      .from('fornecedores')
      .update(fornecedor)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('fornecedores')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir fornecedor:', error);
      throw error;
    }
  }
};
