
import { supabase } from "@/integrations/supabase/client";
import { SupabaseMovimentacaoEstoque } from "@/types/supabase-extended";

export const movimentacaoEstoqueService = {
  async listarTodas(): Promise<SupabaseMovimentacaoEstoque[]> {
    const { data, error } = await supabase
      .from('movimentacoes_estoque')
      .select(`
        *,
        insumo:insumos(*),
        produto:produtos_acabados(*)
      `)
      .order('data_movimentacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar movimentações de estoque:', error);
      throw error;
    }

    return data;
  },

  async criar(movimentacao: Omit<SupabaseMovimentacaoEstoque, 'id' | 'created_at'>): Promise<SupabaseMovimentacaoEstoque> {
    const { data, error } = await supabase
      .from('movimentacoes_estoque')
      .insert(movimentacao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar movimentação de estoque:', error);
      throw error;
    }

    return data;
  }
};
