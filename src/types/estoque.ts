
export interface Material {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  valorUnitario: number;
  fornecedor: string;
  localizacao: string;
}

export interface EstoqueStatus {
  status: string;
  badge: string;
  texto: string;
}
