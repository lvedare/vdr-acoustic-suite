import { supabase } from "@/integrations/supabase/client";
import { Proposta, ClienteSimplificado, ItemProposta, CustoProposta } from "@/types/orcamento";
import { SupabaseCliente, SupabaseProposta, PropostaCompleta } from "@/types/supabase";

// Converter dados do Supabase para tipos locais
const convertSupabaseToLocal = (supabaseProposta: PropostaCompleta): Proposta => {
  return {
    id: parseInt(supabaseProposta.id.replace(/-/g, '').substring(0, 8), 16), // Converter UUID para number
    numero: supabaseProposta.numero,
    data: supabaseProposta.data,
    cliente: {
      id: parseInt(supabaseProposta.cliente.id.replace(/-/g, '').substring(0, 8), 16),
      nome: supabaseProposta.cliente.nome,
      email: supabaseProposta.cliente.email || "",
      telefone: supabaseProposta.cliente.telefone || "",
      empresa: supabaseProposta.cliente.empresa || "",
      cnpj: supabaseProposta.cliente.cnpj || ""
    },
    status: supabaseProposta.status,
    itens: supabaseProposta.itens.map(item => ({
      id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16),
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      quantidade: item.quantidade,
      valorUnitario: parseFloat(item.valor_unitario.toString()),
      valorTotal: parseFloat(item.valor_total.toString()),
      valorOriginal: item.valor_original ? parseFloat(item.valor_original.toString()) : undefined
    })),
    custos: supabaseProposta.custos.map(custo => ({
      id: parseInt(custo.id.replace(/-/g, '').substring(0, 8), 16),
      descricao: custo.descricao,
      valor: parseFloat(custo.valor.toString()),
      diluido: custo.diluido
    })),
    observacoes: supabaseProposta.observacoes || "",
    valorTotal: parseFloat(supabaseProposta.valor_total.toString()),
    formaPagamento: supabaseProposta.forma_pagamento || "",
    prazoEntrega: supabaseProposta.prazo_entrega || "",
    prazoObra: supabaseProposta.prazo_obra || "",
    validade: supabaseProposta.validade || ""
  };
};

// Serviços para clientes
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
      email: cliente.email || "",
      telefone: cliente.telefone || "",
      empresa: cliente.empresa || "",
      cnpj: cliente.cnpj || "",
      endereco_rua: cliente.endereco_rua || "",
      endereco_numero: cliente.endereco_numero || "",
      endereco_bairro: cliente.endereco_bairro || "",
      endereco_cidade: cliente.endereco_cidade || "",
      endereco_estado: cliente.endereco_estado || "",
      endereco_cep: cliente.endereco_cep || "",
      inscricao_estadual: cliente.inscricao_estadual || ""
    }));
  },

  async criar(cliente: Omit<ClienteSimplificado, 'id'>): Promise<ClienteSimplificado> {
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nome: cliente.nome,
        email: cliente.email || null,
        telefone: cliente.telefone || null,
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
      email: data.email || "",
      telefone: data.telefone || "",
      empresa: data.empresa || "",
      cnpj: data.cnpj || "",
      endereco_rua: data.endereco_rua || "",
      endereco_numero: data.endereco_numero || "",
      endereco_bairro: data.endereco_bairro || "",
      endereco_cidade: data.endereco_cidade || "",
      endereco_estado: data.endereco_estado || "",
      endereco_cep: data.endereco_cep || "",
      inscricao_estadual: data.inscricao_estadual || ""
    };
  }
};

// Serviços para propostas
export const propostaService = {
  async listarTodas(): Promise<Proposta[]> {
    try {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          cliente:clientes(*),
          itens:proposta_itens(*),
          custos:proposta_custos(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propostas:', error);
        throw error;
      }

      return data.map(convertSupabaseToLocal);
    } catch (error) {
      console.error('Erro na query de propostas:', error);
      return [];
    }
  },

  async buscarPorId(id: string): Promise<Proposta | null> {
    const { data, error } = await supabase
      .from('propostas')
      .select(`
        *,
        cliente:clientes(*),
        itens:proposta_itens(*),
        custos:proposta_custos(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar proposta:', error);
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }

    return convertSupabaseToLocal(data);
  },

  async criar(proposta: Omit<Proposta, 'id'>): Promise<Proposta> {
    // Primeiro, criar ou buscar cliente
    let clienteId: string;
    
    if (proposta.cliente.id && proposta.cliente.id > 0) {
      // Cliente existente - buscar UUID
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', proposta.cliente.nome)
        .single();
      
      if (clienteExistente) {
        clienteId = clienteExistente.id;
      } else {
        // Criar novo cliente
        const novoCliente = await clienteService.criar(proposta.cliente);
        const { data: clienteCriado } = await supabase
          .from('clientes')
          .select('id')
          .eq('nome', novoCliente.nome)
          .single();
        clienteId = clienteCriado!.id;
      }
    } else {
      // Criar novo cliente
      const novoCliente = await clienteService.criar(proposta.cliente);
      const { data: clienteCriado } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', novoCliente.nome)
        .single();
      clienteId = clienteCriado!.id;
    }

    // Criar proposta
    const { data: propostaCriada, error: propostaError } = await supabase
      .from('propostas')
      .insert({
        numero: proposta.numero,
        data: proposta.data,
        cliente_id: clienteId,
        status: proposta.status,
        observacoes: proposta.observacoes || null,
        valor_total: proposta.valorTotal,
        forma_pagamento: proposta.formaPagamento || null,
        prazo_entrega: proposta.prazoEntrega || null,
        prazo_obra: proposta.prazoObra || null,
        validade: proposta.validade || null
      })
      .select()
      .single();

    if (propostaError) {
      console.error('Erro ao criar proposta:', propostaError);
      throw propostaError;
    }

    // Criar itens
    if (proposta.itens.length > 0) {
      const { error: itensError } = await supabase
        .from('proposta_itens')
        .insert(
          proposta.itens.map(item => ({
            proposta_id: propostaCriada.id,
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            quantidade: item.quantidade,
            valor_unitario: item.valorUnitario,
            valor_total: item.valorTotal,
            valor_original: item.valorOriginal || null
          }))
        );

      if (itensError) {
        console.error('Erro ao criar itens:', itensError);
        throw itensError;
      }
    }

    // Criar custos
    if (proposta.custos.length > 0) {
      const { error: custosError } = await supabase
        .from('proposta_custos')
        .insert(
          proposta.custos.map(custo => ({
            proposta_id: propostaCriada.id,
            descricao: custo.descricao,
            valor: custo.valor,
            diluido: custo.diluido || false
          }))
        );

      if (custosError) {
        console.error('Erro ao criar custos:', custosError);
        throw custosError;
      }
    }

    // Buscar proposta completa criada
    return await this.buscarPorId(propostaCriada.id) as Proposta;
  },

  async atualizar(id: number, proposta: Partial<Proposta>): Promise<Proposta> {
    // Converter ID number para UUID (buscar pela proposta existente)
    const { data: propostaExistente } = await supabase
      .from('propostas')
      .select('id')
      .eq('numero', proposta.numero || '')
      .single();

    if (!propostaExistente) {
      throw new Error('Proposta não encontrada');
    }

    const propostaId = propostaExistente.id;

    // Atualizar proposta
    const { error: propostaError } = await supabase
      .from('propostas')
      .update({
        status: proposta.status,
        observacoes: proposta.observacoes || null,
        valor_total: proposta.valorTotal,
        forma_pagamento: proposta.formaPagamento || null,
        prazo_entrega: proposta.prazoEntrega || null,
        prazo_obra: proposta.prazoObra || null,
        validade: proposta.validade || null
      })
      .eq('id', propostaId);

    if (propostaError) {
      console.error('Erro ao atualizar proposta:', propostaError);
      throw propostaError;
    }

    // Se há itens, removê-los e recriar
    if (proposta.itens) {
      await supabase
        .from('proposta_itens')
        .delete()
        .eq('proposta_id', propostaId);

      if (proposta.itens.length > 0) {
        const { error: itensError } = await supabase
          .from('proposta_itens')
          .insert(
            proposta.itens.map(item => ({
              proposta_id: propostaId,
              codigo: item.codigo,
              descricao: item.descricao,
              unidade: item.unidade,
              quantidade: item.quantidade,
              valor_unitario: item.valorUnitario,
              valor_total: item.valorTotal,
              valor_original: item.valorOriginal || null
            }))
          );

        if (itensError) {
          console.error('Erro ao atualizar itens:', itensError);
          throw itensError;
        }
      }
    }

    // Se há custos, removê-los e recriar
    if (proposta.custos) {
      await supabase
        .from('proposta_custos')
        .delete()
        .eq('proposta_id', propostaId);

      if (proposta.custos.length > 0) {
        const { error: custosError } = await supabase
          .from('proposta_custos')
          .insert(
            proposta.custos.map(custo => ({
              proposta_id: propostaId,
              descricao: custo.descricao,
              valor: custo.valor,
              diluido: custo.diluido || false
            }))
          );

        if (custosError) {
          console.error('Erro ao atualizar custos:', custosError);
          throw custosError;
        }
      }
    }

    return await this.buscarPorId(propostaId) as Proposta;
  },

  async excluir(id: number): Promise<void> {
    // Buscar proposta por número para obter UUID
    const propostas = await this.listarTodas();
    const proposta = propostas.find(p => p.id === id);
    
    if (!proposta) {
      throw new Error('Proposta não encontrada');
    }

    const { data: propostaExistente } = await supabase
      .from('propostas')
      .select('id')
      .eq('numero', proposta.numero)
      .single();

    if (!propostaExistente) {
      throw new Error('Proposta não encontrada no banco');
    }

    const { error } = await supabase
      .from('propostas')
      .delete()
      .eq('id', propostaExistente.id);

    if (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  },

  async atualizarStatus(id: number, status: Proposta['status']): Promise<void> {
    // Buscar proposta por ID para obter UUID
    const propostas = await this.listarTodas();
    const proposta = propostas.find(p => p.id === id);
    
    if (!proposta) {
      throw new Error('Proposta não encontrada');
    }

    const { data: propostaExistente } = await supabase
      .from('propostas')
      .select('id')
      .eq('numero', proposta.numero)
      .single();

    if (!propostaExistente) {
      throw new Error('Proposta não encontrada no banco');
    }

    const { error } = await supabase
      .from('propostas')
      .update({ status })
      .eq('id', propostaExistente.id);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
};
