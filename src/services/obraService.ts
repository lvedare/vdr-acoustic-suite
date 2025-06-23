
import { supabase } from "@/integrations/supabase/client";
import { SupabaseObra, ObraCompleta } from "@/types/supabase-extended";

export const obraService = {
  async listarTodas(): Promise<ObraCompleta[]> {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        cliente:clientes(*),
        projeto:projetos(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar obras:', error);
      throw error;
    }

    return data;
  },

  async criar(obra: Omit<SupabaseObra, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseObra> {
    const { data, error } = await supabase
      .from('obras')
      .insert(obra)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar obra:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, obra: Partial<SupabaseObra>): Promise<SupabaseObra> {
    const { data, error } = await supabase
      .from('obras')
      .update(obra)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar obra:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('obras')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir obra:', error);
      throw error;
    }
  }
};
