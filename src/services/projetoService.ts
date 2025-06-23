
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProjeto, ProjetoCompleto } from "@/types/supabase-extended";

export const projetoService = {
  async listarTodos(): Promise<ProjetoCompleto[]> {
    const { data, error } = await supabase
      .from('projetos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }

    return data;
  },

  async criar(projeto: Omit<SupabaseProjeto, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProjeto> {
    const { data, error } = await supabase
      .from('projetos')
      .insert(projeto)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, projeto: Partial<SupabaseProjeto>): Promise<SupabaseProjeto> {
    const { data, error } = await supabase
      .from('projetos')
      .update(projeto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir projeto:', error);
      throw error;
    }
  }
};
