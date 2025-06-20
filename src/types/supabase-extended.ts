
// Tipos estendidos para os novos módulos integrados com Supabase
export interface SupabaseInsumo {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  unidade_medida: string;
  valor_custo: number;
  quantidade_estoque: number;
  fornecedor: string | null;
  data_cadastro: string;
  pode_ser_revendido: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProdutoAcabado {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  unidade_medida: string;
  valor_base: number;
  quantidade_estoque: number;
  data_cadastro: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseComposicaoProduto {
  id: string;
  produto_id: string;
  insumo_id: string;
  quantidade: number;
  observacao: string | null;
  created_at: string;
}

export interface SupabaseProjeto {
  id: string;
  nome: string;
  cliente_id: string | null;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  tipo: string;
  data_inicio: string | null;
  data_previsao: string | null;
  data_conclusao: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseObra {
  id: string;
  nome: string;
  endereco: string;
  cliente_id: string | null;
  projeto_id: string | null;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  data_inicio: string | null;
  data_previsao: string | null;
  data_conclusao: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrdemProducao {
  id: string;
  numero: string;
  produto_id: string | null;
  quantidade: number;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  data_pedido: string;
  data_previsao: string | null;
  data_conclusao: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMovimentacaoEstoque {
  id: string;
  tipo: string;
  insumo_id: string | null;
  produto_id: string | null;
  quantidade: number;
  motivo: string;
  usuario: string | null;
  data_movimentacao: string | null;
  observacoes: string | null;
  created_at: string;
}

export interface SupabaseVendaProduto {
  id: string;
  produto_id: string | null;
  cliente_id: string | null;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  data_venda: string;
  observacoes: string | null;
  created_at: string;
}

// Tipos com relacionamentos
export interface ProjetoCompleto extends SupabaseProjeto {
  cliente: SupabaseCliente | null;
}

export interface ObraCompleta extends SupabaseObra {
  cliente: SupabaseCliente | null;
  projeto: SupabaseProjeto | null;
}

export interface OrdemProducaoCompleta extends SupabaseOrdemProducao {
  produto: SupabaseProdutoAcabado | null;
}

export interface ComposicaoProdutoCompleta extends SupabaseComposicaoProduto {
  produto: SupabaseProdutoAcabado;
  insumo: SupabaseInsumo;
}

export interface MovimentacaoEstoqueCompleta extends SupabaseMovimentacaoEstoque {
  insumo: SupabaseInsumo | null;
  produto: SupabaseProdutoAcabado | null;
}

export interface VendaProdutoCompleta extends SupabaseVendaProduto {
  produto: SupabaseProdutoAcabado | null;
  cliente: SupabaseCliente | null;
}
