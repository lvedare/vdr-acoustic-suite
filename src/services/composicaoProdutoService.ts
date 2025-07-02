
import { supabase } from "@/integrations/supabase/client";

export interface ComposicaoProdutoData {
  produto_id: string;
  insumo_id: string;
  quantidade: number;
  observacao?: string;
}

export const composicaoProdutoService = {
  async listarPorProduto(produtoId: string) {
    const { data, error } = await supabase
      .from('composicao_produtos')
      .select(`
        *,
        insumo:insumos(*)
      `)
      .eq('produto_id', produtoId);

    if (error) {
      console.error('Erro ao buscar composições:', error);
      throw error;
    }

    return data;
  },

  async criar(composicao: ComposicaoProdutoData) {
    const { data, error } = await supabase
      .from('composicao_produtos')
      .insert(composicao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar composição:', error);
      throw error;
    }

    return data;
  },

  async criarMultiplas(composicoes: ComposicaoProdutoData[]) {
    const { data, error } = await supabase
      .from('composicao_produtos')
      .insert(composicoes)
      .select();

    if (error) {
      console.error('Erro ao criar composições:', error);
      throw error;
    }

    return data;
  },

  async excluirPorProduto(produtoId: string) {
    const { error } = await supabase
      .from('composicao_produtos')
      .delete()
      .eq('produto_id', produtoId);

    if (error) {
      console.error('Erro ao excluir composições:', error);
      throw error;
    }
  },

  async atualizar(id: string, composicao: Partial<ComposicaoProdutoData>) {
    const { data, error } = await supabase
      .from('composicao_produtos')
      .update(composicao)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar composição:', error);
      throw error;
    }

    return data;
  }
};
