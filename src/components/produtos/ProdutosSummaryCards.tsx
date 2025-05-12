
import React from "react";
import { EstoqueSummaryCards } from "./EstoqueSummaryCards";
import { ProdutoAcabado } from "@/types/orcamento";
import { VendaProduto } from "@/contexts/ProdutosContext";

interface ProdutosSummaryCardsProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export const ProdutosSummaryCards: React.FC<ProdutosSummaryCardsProps> = ({
  produtos,
  vendasProdutos
}) => {
  return (
    <EstoqueSummaryCards produtos={produtos} vendasProdutos={vendasProdutos} />
  );
};
