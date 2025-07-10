
import { supabase } from "@/integrations/supabase/client";
import { SupabaseMovimentacaoEstoqueDetalhada, SupabaseMovimentacaoItem } from "@/types/supabase-extended";

export const movimentacaoDetalhadaService = {
  async criarMovimentacao(movimentacao: {
    numero_documento?: string;
    tipo_documento: string;
    data_documento: string;
    fornecedor_id?: string;
    valor_total: number;
    observacoes?: string;
    itens: Array<{
      produto_id?: string;
      insumo_id?: string;
      quantidade: number;
      valor_unitario: number;
      valor_total: number;
      atualizar_preco: boolean;
    }>;
  }) {
    const { data: movimentacaoData, error: movimentacaoError } = await supabase
      .from('movimentacoes_estoque_detalhada')
      .insert({
        numero_documento: movimentacao.numero_documento,
        tipo_documento: movimentacao.tipo_documento,
        data_documento: movimentacao.data_documento,
        fornecedor_id: movimentacao.fornecedor_id,
        valor_total: movimentacao.valor_total,
        observacoes: movimentacao.observacoes,
        aprovado: false
      })
      .select()
      .single();

    if (movimentacaoError) {
      console.error('Erro ao criar movimentação:', movimentacaoError);
      throw movimentacaoError;
    }

    // Criar itens da movimentação
    const itensData = movimentacao.itens.map(item => ({
      movimentacao_id: movimentacaoData.id,
      ...item
    }));

    const { data: itensResult, error: itensError } = await supabase
      .from('movimentacao_itens')
      .insert(itensData)
      .select();

    if (itensError) {
      console.error('Erro ao criar itens da movimentação:', itensError);
      throw itensError;
    }

    return { movimentacao: movimentacaoData, itens: itensResult };
  },

  async aprovarMovimentacao(id: string, aprovadoPor: string) {
    // Buscar movimentação com itens
    const { data: movimentacao, error } = await supabase
      .from('movimentacoes_estoque_detalhada')
      .select(`
        *,
        movimentacao_itens(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar movimentação:', error);
      throw error;
    }

    // Aprovar movimentação
    await supabase
      .from('movimentacoes_estoque_detalhada')
      .update({
        aprovado: true,
        aprovado_por: aprovadoPor,
        aprovado_em: new Date().toISOString()
      })
      .eq('id', id);

    // Atualizar estoques e preços
    for (const item of movimentacao.movimentacao_itens) {
      if (item.produto_id) {
        // Atualizar estoque do produto
        const { data: produto } = await supabase
          .from('produtos_acabados')
          .select('quantidade_estoque')
          .eq('id', item.produto_id)
          .single();

        if (produto) {
          const novoEstoque = produto.quantidade_estoque + item.quantidade;
          await supabase
            .from('produtos_acabados')
            .update({ quantidade_estoque: novoEstoque })
            .eq('id', item.produto_id);
        }
      }

      if (item.insumo_id) {
        // Atualizar estoque do insumo
        const { data: insumo } = await supabase
          .from('insumos')
          .select('quantidade_estoque, valor_custo')
          .eq('id', item.insumo_id)
          .single();

        if (insumo) {
          const novoEstoque = insumo.quantidade_estoque + item.quantidade;
          const updateData: any = { quantidade_estoque: novoEstoque };

          // Atualizar preço se solicitado
          if (item.atualizar_preco && item.valor_unitario > 0) {
            updateData.valor_custo = item.valor_unitario;
          }

          await supabase
            .from('insumos')
            .update(updateData)
            .eq('id', item.insumo_id);
        }
      }
    }

    return movimentacao;
  },

  async listarTodas() {
    const { data, error } = await supabase
      .from('movimentacoes_estoque_detalhada')
      .select(`
        *,
        fornecedor:fornecedores(*),
        movimentacao_itens(
          *,
          produto:produtos_acabados(*),
          insumo:insumos(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar movimentações:', error);
      throw error;
    }

    return data;
  }
};
