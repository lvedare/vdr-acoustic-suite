
import React from "react";
import { ProdutoVendasTable } from "./ProdutoVendasTable";
import { ProdutoAcabado } from "@/types/orcamento";
import { VendaProduto } from "@/contexts/ProdutosContext";

interface ProdutosRelatorioTabProps {
  produtos: ProdutoAcabado[];
  vendasProdutos: VendaProduto[];
}

export const ProdutosRelatorioTab: React.FC<ProdutosRelatorioTabProps> = ({
  produtos,
  vendasProdutos
}) => {
  return (
    <ProdutoVendasTable produtos={produtos} vendasProdutos={vendasProdutos} />
  );
};
