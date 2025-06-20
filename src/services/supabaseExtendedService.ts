
import { supabase } from "@/integrations/supabase/client";
import { 
  SupabaseInsumo, 
  SupabaseProdutoAcabado, 
  SupabaseProjeto, 
  SupabaseObra, 
  SupabaseOrdemProducao,
  SupabaseMovimentacaoEstoque,
  SupabaseVendaProduto,
  ProjetoCompleto,
  ObraCompleta,
  OrdemProducaoCompleta
} from "@/types/supabase-extended";

// Serviços para Insumos
export const insumoService = {
  async listarTodos(): Promise<SupabaseInsumo[]> {
    const { data, error } = await supabase
      .from('insumos')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar insumos:', error);
      throw error;
    }

    return data;
  },

  async criar(insumo: Omit<SupabaseInsumo, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseInsumo> {
    const { data, error } = await supabase
      .from('insumos')
      .insert(insumo)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar insumo:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, insumo: Partial<SupabaseInsumo>): Promise<SupabaseInsumo> {
    const { data, error } = await supabase
      .from('insumos')
      .update(insumo)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar insumo:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('insumos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir insumo:', error);
      throw error;
    }
  }
};

// Serviços para Produtos Acabados
export const produtoAcabadoService = {
  async listarTodos(): Promise<SupabaseProdutoAcabado[]> {
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

  async criar(produto: Omit<SupabaseProdutoAcabado, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProdutoAcabado> {
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

  async atualizar(id: string, produto: Partial<SupabaseProdutoAcabado>): Promise<SupabaseProdutoAcabado> {
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

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('produtos_acabados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir produto acabado:', error);
      throw error;
    }
  }
};

// Serviços para Projetos
export const projetoService = {
  async listarTodos(): Promise<ProjetoCompleto[]> {
    const { data, error } = await supabase
      .from('projetos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }

    return data;
  },

  async criar(projeto: Omit<SupabaseProjeto, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProjeto> {
    const { data, error } = await supabase
      .from('projetos')
      .insert(projeto)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, projeto: Partial<SupabaseProjeto>): Promise<SupabaseProjeto> {
    const { data, error } = await supabase
      .from('projetos')
      .update(projeto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir projeto:', error);
      throw error;
    }
  }
};

// Serviços para Obras
export const obraService = {
  async listarTodas(): Promise<ObraCompleta[]> {
    const { data, error } = await supabase
      .from('obras')
      .select(`
        *,
        cliente:clientes(*),
        projeto:projetos(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar obras:', error);
      throw error;
    }

    return data;
  },

  async criar(obra: Omit<SupabaseObra, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseObra> {
    const { data, error } = await supabase
      .from('obras')
      .insert(obra)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar obra:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, obra: Partial<SupabaseObra>): Promise<SupabaseObra> {
    const { data, error } = await supabase
      .from('obras')
      .update(obra)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar obra:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('obras')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir obra:', error);
      throw error;
    }
  }
};

// Serviços para Ordens de Produção
export const ordemProducaoService = {
  async listarTodas(): Promise<OrdemProducaoCompleta[]> {
    const { data, error } = await supabase
      .from('ordens_producao')
      .select(`
        *,
        produto:produtos_acabados(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar ordens de produção:', error);
      throw error;
    }

    return data;
  },

  async criar(ordem: Omit<SupabaseOrdemProducao, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseOrdemProducao> {
    const { data, error } = await supabase
      .from('ordens_producao')
      .insert(ordem)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar ordem de produção:', error);
      throw error;
    }

    return data;
  },

  async atualizar(id: string, ordem: Partial<SupabaseOrdemProducao>): Promise<SupabaseOrdemProducao> {
    const { data, error } = await supabase
      .from('ordens_producao')
      .update(ordem)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar ordem de produção:', error);
      throw error;
    }

    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('ordens_producao')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir ordem de produção:', error);
      throw error;
    }
  }
};

// Serviços para Movimentações de Estoque
export const movimentacaoEstoqueService = {
  async listarTodas(): Promise<SupabaseMovimentacaoEstoque[]> {
    const { data, error } = await supabase
      .from('movimentacoes_estoque')
      .select(`
        *,
        insumo:insumos(*),
        produto:produtos_acabados(*)
      `)
      .order('data_movimentacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar movimentações de estoque:', error);
      throw error;
    }

    return data;
  },

  async criar(movimentacao: Omit<SupabaseMovimentacaoEstoque, 'id' | 'created_at'>): Promise<SupabaseMovimentacaoEstoque> {
    const { data, error } = await supabase
      .from('movimentacoes_estoque')
      .insert(movimentacao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar movimentação de estoque:', error);
      throw error;
    }

    return data;
  }
};

// Serviços para Vendas de Produtos
export const vendaProdutoService = {
  async listarTodas(): Promise<SupabaseVendaProduto[]> {
    const { data, error } = await supabase
      .from('vendas_produtos')
      .select(`
        *,
        produto:produtos_acabados(*),
        cliente:clientes(*)
      `)
      .order('data_venda', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vendas de produtos:', error);
      throw error;
    }

    return data;
  },

  async criar(venda: Omit<SupabaseVendaProduto, 'id' | 'created_at'>): Promise<SupabaseVendaProduto> {
    const { data, error } = await supabase
      .from('vendas_produtos')
      .insert(venda)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar venda de produto:', error);
      throw error;
    }

    return data;
  }
};
