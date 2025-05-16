
// Tipos relacionados a insumos
export interface Insumo {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  valorCusto: number;
  quantidadeEstoque: number;
  fornecedor?: string;
  dataCadastro: string;
  podeSerRevendido: boolean;
}

export interface InsumoVazio extends Omit<Insumo, "id"> {}

export interface InsumoProduto {
  id: number;
  insumoId: number;
  produtoId: number;
  quantidade: number;
  observacao?: string;
}

export const categoriasInsumo = [
  "Madeira",
  "Metal",
  "Tecido",
  "Fixação",
  "Químico",
  "Elétrico",
  "Vidro",
  "Plástico",
  "Outro"
];

// Status de estoque
export const getStatusEstoque = (quantidade: number, estoqueMinimo: number = 10): {
  status: "baixo" | "normal" | "alto";
  color: string;
} => {
  if (quantidade < estoqueMinimo) {
    return { status: "baixo", color: "text-red-500" };
  } else if (quantidade >= estoqueMinimo && quantidade < estoqueMinimo * 2) {
    return { status: "normal", color: "text-amber-500" };
  } else {
    return { status: "alto", color: "text-green-500" };
  }
};
