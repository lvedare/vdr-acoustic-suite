
import { supabase } from "@/integrations/supabase/client";
import { SupabaseVendaProduto } from "@/types/supabase-extended";

export const vendaProdutoService = {
  async listarTodas(): Promise<SupabaseVendaProduto[]> {
    const { data, error } = await supabase
      .from('vendas_produtos')
      .select(`
        *,
        produto:produtos_acabados(*),
        cliente:clientes(*)
      `)
      .order('data_venda', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vendas de produtos:', error);
      throw error;
    }

    return data;
  },

  async criar(venda: Omit<SupabaseVendaProduto, 'id' | 'created_at'>): Promise<SupabaseVendaProduto> {
    const { data, error } = await supabase
      .from('vendas_produtos')
      .insert(venda)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar venda de produto:', error);
      throw error;
    }

    return data;
  }
};
