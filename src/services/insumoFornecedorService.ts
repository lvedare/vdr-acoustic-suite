
import { supabase } from "@/integrations/supabase/client";
import { SupabaseInsumoFornecedor } from "@/types/supabase-extended";

export const insumoFornecedorService = {
  async listarPorInsumo(insumoId: string) {
    const { data, error } = await supabase
      .from('insumo_fornecedores')
      .select(`
        *,
        fornecedor:fornecedores(*)
      `)
      .eq('insumo_id', insumoId)
      .eq('ativo', true)
      .order('preco_unitario');

    if (error) {
      console.error('Erro ao buscar fornecedores do insumo:', error);
      throw error;
    }

    return data;
  },

  async salvarFornecedores(insumoId: string, fornecedores: Array<{
    fornecedor_id: string;
    preco_unitario: number;
    prazo_entrega?: number;
    observacoes?: string;
  }>) {
    // Remove fornecedores existentes
    await supabase
      .from('insumo_fornecedores')
      .delete()
      .eq('insumo_id', insumoId);

    // Adiciona novos fornecedores
    const fornecedoresData = fornecedores.map(f => ({
      insumo_id: insumoId,
      ...f
    }));

    const { data, error } = await supabase
      .from('insumo_fornecedores')
      .insert(fornecedoresData)
      .select();

    if (error) {
      console.error('Erro ao salvar fornecedores do insumo:', error);
      throw error;
    }

    // Calcular custo médio
    await supabase.rpc('calcular_custo_medio_insumo', { insumo_uuid: insumoId });

    return data;
  }
};
