
import { supabase } from "@/integrations/supabase/client";

export const propostaService = {
  listar: async () => {
    const { data, error } = await supabase
      .from('propostas')
      .select(`
        *,
        cliente:clientes(*),
        proposta_itens(*),
        proposta_custos(*)
      `);

    if (error) {
      console.error('Erro ao listar propostas:', error);
      throw error;
    }

    return data?.map(proposta => ({
      id: proposta.id,
      numero: proposta.numero,
      data: proposta.data,
      cliente: proposta.cliente,
      status: proposta.status,
      origem: proposta.origem || 'manual',
      atendimento_id: proposta.atendimento_id,
      itens: proposta.proposta_itens?.map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        descricao: item.descricao,
        quantidade: item.quantidade,
        unidade: item.unidade,
        valorUnitario: item.valor_unitario,
        valorTotal: item.valor_total,
        valorOriginal: item.valor_original
      })) || [],
      custos: proposta.proposta_custos?.map((custo: any) => ({
        id: custo.id,
        descricao: custo.descricao,
        valor: custo.valor,
        diluido: custo.diluido
      })) || [],
      observacoes: proposta.observacoes,
      valorTotal: proposta.valor_total,
      formaPagamento: proposta.forma_pagamento,
      prazoEntrega: proposta.prazo_entrega,
      prazoObra: proposta.prazo_obra,
      validade: proposta.validade
    })) || [];
  },

  criar: async (proposta: any) => {
    const { data, error } = await supabase
      .from('propostas')
      .insert([proposta])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar proposta:', error);
      throw error;
    }

    return data;
  },

  atualizar: async (id: string | number, proposta: any) => {
    const { data, error } = await supabase
      .from('propostas')
      .update(proposta)
      .eq('id', String(id))
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar proposta:', error);
      throw error;
    }

    return data;
  },

  excluir: async (id: string | number) => {
    const { error } = await supabase
      .from('propostas')
      .delete()
      .eq('id', String(id));

    if (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  },
};
