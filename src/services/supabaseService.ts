import { supabase } from '@/integrations/supabase/client';
import { ClienteSimplificado, Proposta, ItemProposta, CustoProposta, AtendimentoData } from '@/types/orcamento';

// Serviço de Clientes
export const clienteService = {
  async listarTodos(): Promise<ClienteSimplificado[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }

    return data.map(cliente => ({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      empresa: cliente.empresa || '',
      cnpj: cliente.cnpj || '',
      endereco_rua: cliente.endereco_rua || '',
      endereco_numero: cliente.endereco_numero || '',
      endereco_bairro: cliente.endereco_bairro || '',
      endereco_cidade: cliente.endereco_cidade || '',
      endereco_estado: cliente.endereco_estado || '',
      endereco_cep: cliente.endereco_cep || '',
      inscricao_estadual: cliente.inscricao_estadual || ''
    }));
  },

  async buscarPorId(id: number | string): Promise<ClienteSimplificado | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', String(id))
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      nome: data.nome,
      email: data.email || '',
      telefone: data.telefone || '',
      empresa: data.empresa || '',
      cnpj: data.cnpj || '',
      endereco_rua: data.endereco_rua || '',
      endereco_numero: data.endereco_numero || '',
      endereco_bairro: data.endereco_bairro || '',
      endereco_cidade: data.endereco_cidade || '',
      endereco_estado: data.endereco_estado || '',
      endereco_cep: data.endereco_cep || '',
      inscricao_estadual: data.inscricao_estadual || ''
    };
  },

  async criar(cliente: Omit<ClienteSimplificado, 'id' | 'created_at' | 'updated_at'>): Promise<ClienteSimplificado> {
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        empresa: cliente.empresa || null,
        cnpj: cliente.cnpj || null,
        endereco_rua: cliente.endereco_rua || null,
        endereco_numero: cliente.endereco_numero || null,
        endereco_bairro: cliente.endereco_bairro || null,
        endereco_cidade: cliente.endereco_cidade || null,
        endereco_estado: cliente.endereco_estado || null,
        endereco_cep: cliente.endereco_cep || null,
        inscricao_estadual: cliente.inscricao_estadual || null
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }

    return {
      id: data.id,
      nome: data.nome,
      email: data.email || '',
      telefone: data.telefone || '',
      empresa: data.empresa || '',
      cnpj: data.cnpj || '',
      endereco_rua: data.endereco_rua || '',
      endereco_numero: data.endereco_numero || '',
      endereco_bairro: data.endereco_bairro || '',
      endereco_cidade: data.endereco_cidade || '',
      endereco_estado: data.endereco_estado || '',
      endereco_cep: data.endereco_cep || '',
      inscricao_estadual: data.inscricao_estadual || ''
    };
  },

  async atualizar(id: number | string, cliente: Partial<ClienteSimplificado>): Promise<ClienteSimplificado> {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        empresa: cliente.empresa || null,
        cnpj: cliente.cnpj || null,
        endereco_rua: cliente.endereco_rua || null,
        endereco_numero: cliente.endereco_numero || null,
        endereco_bairro: cliente.endereco_bairro || null,
        endereco_cidade: cliente.endereco_cidade || null,
        endereco_estado: cliente.endereco_estado || null,
        endereco_cep: cliente.endereco_cep || null,
        inscricao_estadual: cliente.inscricao_estadual || null
      })
      .eq('id', String(id))
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }

    return {
      id: data.id,
      nome: data.nome,
      email: data.email || '',
      telefone: data.telefone || '',
      empresa: data.empresa || '',
      cnpj: data.cnpj || '',
      endereco_rua: data.endereco_rua || '',
      endereco_numero: data.endereco_numero || '',
      endereco_bairro: data.endereco_bairro || '',
      endereco_cidade: data.endereco_cidade || '',
      endereco_estado: data.endereco_estado || '',
      endereco_cep: data.endereco_cep || '',
      inscricao_estadual: data.inscricao_estadual || ''
    };
  },

  async excluir(id: number | string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', String(id));

    if (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }
};

// Serviço de Propostas
export const propostaService = {
  async listarTodas(): Promise<Proposta[]> {
    try {
      const { data: propostas, error: propostasError } = await supabase
        .from('propostas')
        .select(`
          *,
          cliente:clientes(*)
        `)
        .order('created_at', { ascending: false });

      if (propostasError) {
        console.error('Erro ao buscar propostas:', propostasError);
        throw propostasError;
      }

      if (!propostas) return [];

      const propostasCompletas = await Promise.all(
        propostas.map(async (proposta) => {
          const [itensResult, custosResult] = await Promise.all([
            supabase
              .from('proposta_itens')
              .select('*')
              .eq('proposta_id', proposta.id),
            supabase
              .from('proposta_custos')
              .select('*')
              .eq('proposta_id', proposta.id)
          ]);

          const itens = itensResult.data || [];
          const custos = custosResult.data || [];

          return {
            id: proposta.id,
            numero: proposta.numero,
            data: proposta.data,
            cliente: {
              id: proposta.cliente?.id || '',
              nome: proposta.cliente?.nome || '',
              email: proposta.cliente?.email || '',
              telefone: proposta.cliente?.telefone || '',
              empresa: proposta.cliente?.empresa || '',
              cnpj: proposta.cliente?.cnpj || '',
              endereco_rua: proposta.cliente?.endereco_rua || '',
              endereco_numero: proposta.cliente?.endereco_numero || '',
              endereco_bairro: proposta.cliente?.endereco_bairro || '',
              endereco_cidade: proposta.cliente?.endereco_cidade || '',
              endereco_estado: proposta.cliente?.endereco_estado || '',
              endereco_cep: proposta.cliente?.endereco_cep || '',
              inscricao_estadual: proposta.cliente?.inscricao_estadual || ''
            },
            status: proposta.status,
            itens: itens.map(item => ({
              id: item.id,
              codigo: item.codigo,
              descricao: item.descricao,
              unidade: item.unidade,
              quantidade: item.quantidade,
              valorUnitario: item.valor_unitario,
              valorTotal: item.valor_total,
              valorOriginal: item.valor_original
            })),
            custos: custos.map(custo => ({
              id: custo.id,
              descricao: custo.descricao,
              valor: custo.valor,
              diluido: custo.diluido
            })),
            observacoes: proposta.observacoes || '',
            valorTotal: proposta.valor_total,
            formaPagamento: proposta.forma_pagamento || '',
            prazoEntrega: proposta.prazo_entrega || '',
            prazoObra: proposta.prazo_obra || '',
            validade: proposta.validade || ''
          };
        })
      );

      return propostasCompletas;
    } catch (error) {
      console.error('Erro no serviço de propostas:', error);
      throw error;
    }
  },

  async buscarPorId(id: number | string): Promise<Proposta | null> {
    try {
      const { data: proposta, error: propostaError } = await supabase
        .from('propostas')
        .select(`
          *,
          cliente:clientes(*)
        `)
        .eq('id', String(id))
        .maybeSingle();

      if (propostaError) {
        console.error('Erro ao buscar proposta:', propostaError);
        throw propostaError;
      }

      if (!proposta) return null;

      const [itensResult, custosResult] = await Promise.all([
        supabase
          .from('proposta_itens')
          .select('*')
          .eq('proposta_id', proposta.id),
        supabase
          .from('proposta_custos')
          .select('*')
          .eq('proposta_id', proposta.id)
      ]);

      const itens = itensResult.data || [];
      const custos = custosResult.data || [];

      return {
        id: proposta.id,
        numero: proposta.numero,
        data: proposta.data,
        cliente: {
          id: proposta.cliente?.id || '',
          nome: proposta.cliente?.nome || '',
          email: proposta.cliente?.email || '',
          telefone: proposta.cliente?.telefone || '',
          empresa: proposta.cliente?.empresa || '',
          cnpj: proposta.cliente?.cnpj || ''
        },
        status: proposta.status,
        itens: itens.map(item => ({
          id: item.id,
          codigo: item.codigo,
          descricao: item.descricao,
          unidade: item.unidade,
          quantidade: item.quantidade,
          valorUnitario: item.valor_unitario,
          valorTotal: item.valor_total,
          valorOriginal: item.valor_original
        })),
        custos: custos.map(custo => ({
          id: custo.id,
          descricao: custo.descricao,
          valor: custo.valor,
          diluido: custo.diluido
        })),
        observacoes: proposta.observacoes || '',
        valorTotal: proposta.valor_total,
        formaPagamento: proposta.forma_pagamento || '',
        prazoEntrega: proposta.prazo_entrega || '',
        prazoObra: proposta.prazo_obra || '',
        validade: proposta.validade || ''
      };
    } catch (error) {
      console.error('Erro ao buscar proposta por ID:', error);
      throw error;
    }
  },

  async criar(proposta: Omit<Proposta, 'id'>): Promise<Proposta> {
    try {
      const { data: novaProposta, error: propostaError } = await supabase
        .from('propostas')
        .insert({
          numero: proposta.numero,
          data: proposta.data,
          cliente_id: String(proposta.cliente.id),
          status: proposta.status,
          observacoes: proposta.observacoes,
          valor_total: proposta.valorTotal,
          forma_pagamento: proposta.formaPagamento,
          prazo_entrega: proposta.prazoEntrega,
          prazo_obra: proposta.prazoObra,
          validade: proposta.validade
        })
        .select()
        .single();

      if (propostaError) {
        console.error('Erro ao criar proposta:', propostaError);
        throw propostaError;
      }

      if (proposta.itens.length > 0) {
        const { error: itensError } = await supabase
          .from('proposta_itens')
          .insert(
            proposta.itens.map(item => ({
              proposta_id: novaProposta.id,
              codigo: item.codigo,
              descricao: item.descricao,
              unidade: item.unidade,
              quantidade: item.quantidade,
              valor_unitario: item.valorUnitario,
              valor_total: item.valorTotal,
              valor_original: item.valorOriginal
            }))
          );

        if (itensError) {
          console.error('Erro ao criar itens da proposta:', itensError);
          throw itensError;
        }
      }

      if (proposta.custos.length > 0) {
        const { error: custosError } = await supabase
          .from('proposta_custos')
          .insert(
            proposta.custos.map(custo => ({
              proposta_id: novaProposta.id,
              descricao: custo.descricao,
              valor: custo.valor,
              diluido: custo.diluido
            }))
          );

        if (custosError) {
          console.error('Erro ao criar custos da proposta:', custosError);
          throw custosError;
        }
      }

      return {
        ...proposta,
        id: novaProposta.id
      };
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      throw error;
    }
  },

  async atualizar(id: number | string, proposta: Partial<Proposta>): Promise<Proposta> {
    try {
      const { data: propostaAtualizada, error: propostaError } = await supabase
        .from('propostas')
        .update({
          numero: proposta.numero,
          data: proposta.data,
          cliente_id: String(proposta.cliente?.id),
          status: proposta.status,
          observacoes: proposta.observacoes,
          valor_total: proposta.valorTotal,
          forma_pagamento: proposta.formaPagamento,
          prazo_entrega: proposta.prazoEntrega,
          prazo_obra: proposta.prazoObra,
          validade: proposta.validade
        })
        .eq('id', String(id))
        .select()
        .single();

      if (propostaError) {
        console.error('Erro ao atualizar proposta:', propostaError);
        throw propostaError;
      }

      if (proposta.itens) {
        await supabase
          .from('proposta_itens')
          .delete()
          .eq('proposta_id', String(id));

        if (proposta.itens.length > 0) {
          const { error: itensError } = await supabase
            .from('proposta_itens')
            .insert(
              proposta.itens.map(item => ({
                proposta_id: String(id),
                codigo: item.codigo,
                descricao: item.descricao,
                unidade: item.unidade,
                quantidade: item.quantidade,
                valor_unitario: item.valorUnitario,
                valor_total: item.valorTotal,
                valor_original: item.valorOriginal
              }))
            );

          if (itensError) {
            console.error('Erro ao atualizar itens da proposta:', itensError);
            throw itensError;
          }
        }
      }

      if (proposta.custos) {
        await supabase
          .from('proposta_custos')
          .delete()
          .eq('proposta_id', String(id));

        if (proposta.custos.length > 0) {
          const { error: custosError } = await supabase
            .from('proposta_custos')
            .insert(
              proposta.custos.map(custo => ({
                proposta_id: String(id),
                descricao: custo.descricao,
                valor: custo.valor,
                diluido: custo.diluido
              }))
            );

          if (custosError) {
            console.error('Erro ao atualizar custos da proposta:', custosError);
            throw custosError;
          }
        }
      }

      return await this.buscarPorId(id) || proposta as Proposta;
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      throw error;
    }
  },

  async excluir(id: number | string): Promise<void> {
    try {
      await Promise.all([
        supabase.from('proposta_itens').delete().eq('proposta_id', String(id)),
        supabase.from('proposta_custos').delete().eq('proposta_id', String(id))
      ]);

      const { error } = await supabase
        .from('propostas')
        .delete()
        .eq('id', String(id));

      if (error) {
        console.error('Erro ao excluir proposta:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  },

  async atualizarStatus(id: number | string, status: Proposta['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('propostas')
        .update({ status })
        .eq('id', String(id));

      if (error) {
        console.error('Erro ao atualizar status da proposta:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
};

// Serviço de Atendimentos
export const atendimentoService = {
  async listarTodos(): Promise<AtendimentoData[]> {
    try {
      const { data, error } = await supabase
        .from('atendimentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar atendimentos:', error);
        throw error;
      }

      return data.map(atendimento => ({
        id: atendimento.id,
        cliente: atendimento.cliente_nome,
        contato: atendimento.contato,
        assunto: atendimento.assunto,
        data: atendimento.data,
        hora: atendimento.hora,
        canal: atendimento.canal,
        status: atendimento.status,
        mensagem: atendimento.mensagem || '',
        clienteId: atendimento.cliente_id || 0
      }));
    } catch (error) {
      console.error('Erro no serviço de atendimentos:', error);
      throw error;
    }
  },

  async criar(atendimento: Omit<AtendimentoData, 'id'>): Promise<AtendimentoData> {
    try {
      const { data, error } = await supabase
        .from('atendimentos')
        .insert({
          cliente_nome: atendimento.cliente,
          contato: atendimento.contato,
          assunto: atendimento.assunto,
          data: atendimento.data,
          hora: atendimento.hora,
          canal: atendimento.canal,
          status: atendimento.status,
          mensagem: atendimento.mensagem,
          cliente_id: atendimento.clienteId ? String(atendimento.clienteId) : null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar atendimento:', error);
        throw error;
      }

      return {
        id: data.id,
        cliente: data.cliente_nome,
        contato: data.contato,
        assunto: data.assunto,
        data: data.data,
        hora: data.hora,
        canal: data.canal,
        status: data.status,
        mensagem: data.mensagem || '',
        clienteId: data.cliente_id || 0
      };
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      throw error;
    }
  },

  async atualizar(id: string | number, atendimento: Partial<AtendimentoData>): Promise<void> {
    try {
      const { error } = await supabase
        .from('atendimentos')
        .update({
          cliente_nome: atendimento.cliente,
          contato: atendimento.contato,
          assunto: atendimento.assunto,
          data: atendimento.data,
          hora: atendimento.hora,
          canal: atendimento.canal,
          status: atendimento.status,
          mensagem: atendimento.mensagem
        })
        .eq('id', String(id));

      if (error) {
        console.error('Erro ao atualizar atendimento:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar atendimento:', error);
      throw error;
    }
  },

  async excluir(id: string | number): Promise<void> {
    try {
      const { error } = await supabase
        .from('atendimentos')
        .delete()
        .eq('id', String(id));

      if (error) {
        console.error('Erro ao excluir atendimento:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao excluir atendimento:', error);
      throw error;
    }
  }
};
