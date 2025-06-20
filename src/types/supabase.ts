
// Tipos para integração com Supabase
export interface SupabaseCliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  cnpj: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProposta {
  id: string;
  numero: string;
  data: string;
  cliente_id: string;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada' | 'expirada';
  observacoes: string | null;
  valor_total: number;
  forma_pagamento: string | null;
  prazo_entrega: string | null;
  prazo_obra: string | null;
  validade: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabasePropostaItem {
  id: string;
  proposta_id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  valor_original: number | null;
  created_at: string;
}

export interface SupabasePropostaCusto {
  id: string;
  proposta_id: string;
  descricao: string;
  valor: number;
  diluido: boolean;
  created_at: string;
}

// Tipo para proposta completa com relacionamentos
export interface PropostaCompleta extends SupabaseProposta {
  cliente: SupabaseCliente;
  itens: SupabasePropostaItem[];
  custos: SupabasePropostaCusto[];
}
