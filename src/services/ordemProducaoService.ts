
import { supabase } from "@/integrations/supabase/client";
import { SupabaseOrdemProducao, OrdemProducaoCompleta } from "@/types/supabase-extended";

export const ordemProducaoService = {
  async listarTodas(): Promise<OrdemProducaoCompleta[]> {
    const { data, error } = await supabase
      .from('ordens_producao')
      .select(`
        *,
        produto:produtos_acabados(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar ordens de produção:', error);
      throw error;
    }

    return data;
  },

  async criar(ordem: Omit<SupabaseOrdemProducao, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseOrdemProducao> {
    const { data, error } = await supabase
      .from('ordens_producao')
      .insert(ordem)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar ordem de produção:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, ordem: Partial<SupabaseOrdemProducao>): Promise<SupabaseOrdemProducao> {
    const { data, error } = await supabase
      .from('ordens_producao')
      .update(ordem)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar ordem de produção:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('ordens_producao')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir ordem de produção:', error);
      throw error;
    }
  }
};
