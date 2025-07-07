
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ProdutoTable } from "./ProdutoTable";
import { ProdutoFilterBar } from "./ProdutoFilterBar";
import { useProdutos } from "@/contexts/ProdutosContext";
import { ProdutoAcabado } from "@/types/orcamento";
import { categorias } from "@/contexts/ProdutosContext";

interface ProdutosListaTabProps {
  produtosFiltrados: ProdutoAcabado[];
  onEditarProduto: (produto: ProdutoAcabado) => void;
  onExcluirProduto: (produto: ProdutoAcabado) => void;
  onVerDetalhes: (produto: ProdutoAcabado) => void;
  onCriarItemOrcamento: (produto: ProdutoAcabado) => void;
  onEditarComposicao: (produto: ProdutoAcabado) => void;
}

export const ProdutosListaTab: React.FC<ProdutosListaTabProps> = ({
  produtosFiltrados,
  onEditarProduto,
  onExcluirProduto,
  onVerDetalhes,
  onCriarItemOrcamento,
  onEditarComposicao
}) => {
  const { 
    searchTerm,
    setSearchTerm,
    filtroCategoria,
    setFiltroCategoria,
    filtroEstoque,
    setFiltroEstoque
  } = useProdutos();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Produtos Cadastrados</CardTitle>
          <ProdutoFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            filtroEstoque={filtroEstoque}
            setFiltroEstoque={setFiltroEstoque}
            categorias={categorias}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ProdutoTable
          produtos={produtosFiltrados}
          onEditarProduto={onEditarProduto}
          onPreExcluirProduto={onExcluirProduto}
          onVerDetalhesProduto={onVerDetalhes}
          onCriarItemOrcamento={onCriarItemOrcamento}
          onEditarComposicao={onEditarComposicao}
        />
      </CardContent>
    </Card>
  );
};
