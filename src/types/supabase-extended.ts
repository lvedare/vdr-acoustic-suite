import { Database } from '@/integrations/supabase/types';

// Import the cliente type from the main supabase types
export type SupabaseCliente = Database['public']['Tables']['clientes']['Row'];

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
  ncm: string | null;
  custo_medio: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFornecedor {
  id: string;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  categoria: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseInsumoFornecedor {
  id: string;
  insumo_id: string;
  fornecedor_id: string;
  preco_unitario: number;
  prazo_entrega: number | null;
  observacoes: string | null;
  ativo: boolean;
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

export interface SupabaseMovimentacaoEstoqueDetalhada {
  id: string;
  numero_documento: string | null;
  tipo_documento: string | null;
  data_documento: string | null;
  fornecedor_id: string | null;
  valor_total: number;
  observacoes: string | null;
  aprovado: boolean;
  aprovado_por: string | null;
  aprovado_em: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMovimentacaoItem {
  id: string;
  movimentacao_id: string;
  produto_id: string | null;
  insumo_id: string | null;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  atualizar_preco: boolean;
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

// Categorias corretas do negócio
export const categoriasAcusticas = [
  "Forro de Isolamento",
  "Forro de Tratamento", 
  "Divisória Acústica",
  "Contra Parede Acústica",
  "Revestimento Amadeirado",
  "Revestimento de Espuma",
  "Painéis Acústico de Madeira",
  "Painéis Acústico de Tecido",
  "Difusores Acústico de Madeira",
  "Difusores Acústico de Espuma",
  "Porta Acústica de Madeira",
  "Porta Acústica Metálica",
  "Atenuador de Ruído",
  "Silencioso Hospitalar",
  "Carenagem Acústica",
  "Enclausuramento Acústico"
];

export const tiposSolucao = [
  "Isolamento Acústico",
  "Tratamento Acústico",
  "Ambos"
];

// Tipos com relacionamentos estendidos
export interface InsumoComFornecedores extends SupabaseInsumo {
  fornecedores: (SupabaseInsumoFornecedor & {
    fornecedor: SupabaseFornecedor;
  })[];
}

export interface MovimentacaoCompleta extends SupabaseMovimentacaoEstoqueDetalhada {
  fornecedor: SupabaseFornecedor | null;
  itens: (SupabaseMovimentacaoItem & {
    produto: SupabaseProdutoAcabado | null;
    insumo: SupabaseInsumo | null;
  })[];
}
