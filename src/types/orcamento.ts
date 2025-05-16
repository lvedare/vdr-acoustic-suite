
// Tipos utilizados no módulo de orçamentos
export interface ClienteSimplificado {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cnpj?: string;
}

export interface ItemProposta {
  id: number;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface CustoProposta {
  id: number;
  descricao: string;
  valor: number;
}

export interface Proposta {
  id: number;
  numero: string;
  data: string;
  cliente: ClienteSimplificado;
  status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada";
  itens: ItemProposta[];
  custos: CustoProposta[];
  observacoes: string;
  valorTotal: number;
  formaPagamento: string;
  prazoEntrega: string;
  prazoObra: string;
  validade: string;
}

export interface ComposicaoProduto {
  insumos: {
    id: number;
    insumoId: number;
    nome: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }[];
  maoDeObra: {
    fabricacao: number;
    instalacao: number;
  };
  despesaAdministrativa: number; // valor em porcentagem (%)
  margemVenda: number; // valor em porcentagem (markup %)
}

export interface ProdutoAcabado {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  valorBase: number;
  quantidadeEstoque: number; // Este campo será gerenciado no módulo de estoque
  dataCadastro: string;
  composicao?: ComposicaoProduto;
}

export interface NovoItemInput {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
}

export interface NovoCustoInput {
  descricao: string;
  valor: number;
}

// Constantes
export const UNIDADES_OPCOES = ["PÇ", "M²", "M", "UN", "CJ", "KG"];

// Função para formatar moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

// Observações padrão
export const OBS_DEFAULT = "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.";
