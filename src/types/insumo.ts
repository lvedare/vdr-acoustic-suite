
// Tipos relacionados a insumos
export interface Insumo {
  id: string;
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
  ncm?: string;
  custoMedio: number;
}

export interface InsumoVazio extends Omit<Insumo, "id"> {}

export interface InsumoProduto {
  id: number;
  insumoId: number;
  produtoId: number;
  quantidade: number;
  observacao?: string;
}

// Categorias corretas do negócio acústico
export const categoriasInsumo = [
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
