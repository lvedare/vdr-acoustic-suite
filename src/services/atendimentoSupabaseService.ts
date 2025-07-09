
import { supabase } from "@/integrations/supabase/client";

export const atendimentoSupabaseService = {
  criar: async (atendimento: any) => {
    console.log('Criando atendimento:', atendimento);
    
    // Converter dados para o formato do Supabase
    const dadosSupabase = {
      cliente_nome: atendimento.cliente || atendimento.cliente_nome,
      contato: atendimento.contato,
      assunto: atendimento.assunto,
      mensagem: atendimento.mensagem,
      canal: atendimento.canal || 'WhatsApp',
      status: atendimento.status || 'Novo',
      data: atendimento.data || new Date().toISOString().split('T')[0],
      hora: atendimento.hora || new Date().toTimeString().split(' ')[0],
      cliente_id: atendimento.clienteId ? String(atendimento.clienteId) : null,
      endereco_obra: atendimento.endereco_obra || null,
      endereco_entrega: atendimento.endereco_entrega || null,
      usar_endereco_cliente: atendimento.usar_endereco_cliente || true
    };

    console.log('Dados formatados para Supabase:', dadosSupabase);

    const { data, error } = await supabase
      .from('atendimentos')
      .insert(dadosSupabase)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar atendimento:', error);
      throw error;
    }

    console.log('Atendimento criado com sucesso:', data);
    return data;
  },

  listar: async () => {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar atendimentos:', error);
      throw error;
    }

    return data?.map(atendimento => ({
      id: atendimento.id,
      cliente: atendimento.cliente_nome,
      contato: atendimento.contato,
      assunto: atendimento.assunto,
      data: atendimento.data,
      hora: atendimento.hora,
      canal: atendimento.canal,
      status: atendimento.status,
      mensagem: atendimento.mensagem || '',
      clienteId: atendimento.cliente_id
    })) || [];
  },

  listarPendentesOrcamento: async () => {
    const { data, error } = await supabase
      .from('atendimentos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .eq('status', 'Enviado para Orçamento')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar atendimentos pendentes de orçamento:', error);
      throw error;
    }

    return data || [];
  },

  atualizar: async (id: string, atendimento: any) => {
    const { data, error } = await supabase
      .from('atendimentos')
      .update({
        cliente_nome: atendimento.cliente,
        contato: atendimento.contato,
        assunto: atendimento.assunto,
        mensagem: atendimento.mensagem,
        canal: atendimento.canal,
        status: atendimento.status,
        cliente_id: atendimento.clienteId ? String(atendimento.clienteId) : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar atendimento:', error);
      throw error;
    }

    return data;
  },

  excluir: async (id: string) => {
    const { error } = await supabase
      .from('atendimentos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir atendimento:', error);
      throw error;
    }
  }
};
