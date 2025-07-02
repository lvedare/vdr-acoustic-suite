import { supabase } from "@/integrations/supabase/client";

export const supabaseService = {
  listarClientes: async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*');

    if (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }

    return data || [];
  },

  criarCliente: async (cliente: any) => {
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

  atualizarCliente: async (id: number, cliente: any) => {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }

    return data;
  },

  excluirCliente: async (id: number) => {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  },

  listarPropostas: async () => {
    const { data, error } = await supabase
      .from('propostas')
      .select(`
        *,
        cliente:clientes(*)
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
      itens: proposta.itens,
      custos: proposta.custos,
      observacoes: proposta.observacoes,
      valorTotal: proposta.valorTotal,
      formaPagamento: proposta.formaPagamento,
      prazoEntrega: proposta.prazoEntrega,
      prazoObra: proposta.prazoObra,
      validade: proposta.validade
    })) || [];
  },

  criarProposta: async (proposta: any) => {
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

  atualizarProposta: async (id: string | number, proposta: any) => {
    const { data, error } = await supabase
      .from('propostas')
      .update(proposta)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar proposta:', error);
      throw error;
    }

    return data;
  },

  excluirProposta: async (id: string | number) => {
    const { error } = await supabase
      .from('propostas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  },

  atendimentoService: {
    async criar(atendimento: any) {
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

    async listar() {
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

    async atualizar(id: string, atendimento: any) {
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

    async excluir(id: string) {
      const { error } = await supabase
        .from('atendimentos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir atendimento:', error);
        throw error;
      }
    }
  },
};
