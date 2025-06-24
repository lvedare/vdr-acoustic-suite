
import { supabase } from "@/integrations/supabase/client";

export const produtoAcabadoService = {
  async listarTodos() {
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

  async criar(produto: any) {
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

  async atualizar(id: string, produto: any) {
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

  async excluir(id: string) {
    const { error } = await supabase
      .from('produtos_acabados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir produto acabado:', error);
      throw error;
    }
  },

  async adicionarEstoque(id: string, quantidade: number) {
    // Get current stock first
    const { data: currentData, error: fetchError } = await supabase
      .from('produtos_acabados')
      .select('quantidade_estoque')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar estoque atual:', fetchError);
      throw fetchError;
    }

    const novaQuantidade = currentData.quantidade_estoque + quantidade;

    const { data, error } = await supabase
      .from('produtos_acabados')
      .update({ quantidade_estoque: novaQuantidade })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar estoque:', error);
      throw error;
    }

    return data;
  },

  async removerEstoque(id: string, quantidade: number) {
    // Get current stock first
    const { data: currentData, error: fetchError } = await supabase
      .from('produtos_acabados')
      .select('quantidade_estoque')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar estoque atual:', fetchError);
      throw fetchError;
    }

    const novaQuantidade = Math.max(0, currentData.quantidade_estoque - quantidade);

    const { data, error } = await supabase
      .from('produtos_acabados')
      .update({ quantidade_estoque: novaQuantidade })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao remover estoque:', error);
      throw error;
    }

    return data;
  }
};
