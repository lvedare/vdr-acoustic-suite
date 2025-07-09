
import { supabase } from "@/integrations/supabase/client";

export const clienteService = {
  listar: async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*');

    if (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }

    return data || [];
  },

  listarTodos: async () => {
    return clienteService.listar();
  },

  criar: async (cliente: any) => {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }

    return data;
  },

  atualizar: async (id: string | number, cliente: any) => {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', String(id))
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }

    return data;
  },

  excluir: async (id: string | number) => {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', String(id));

    if (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  },
};
