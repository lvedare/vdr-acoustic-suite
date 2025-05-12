
import React from "react";
import { Card } from "@/components/ui/card";
import { ProdutoCard } from "./ProdutoCard";
import { ProdutoAcabado } from "@/types/orcamento";

interface ProdutosCardsTabProps {
  produtosFiltrados: ProdutoAcabado[];
  onVerDetalhes: (produto: ProdutoAcabado) => void;
  onCriarItemOrcamento: (produto: ProdutoAcabado) => void;
}

export const ProdutosCardsTab: React.FC<ProdutosCardsTabProps> = ({
  produtosFiltrados,
  onVerDetalhes,
  onCriarItemOrcamento
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {produtosFiltrados.length === 0 ? (
        <Card className="col-span-full p-6 text-center text-muted-foreground">
          Nenhum produto encontrado.
        </Card>
      ) : (
        produtosFiltrados.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            onVerDetalhes={onVerDetalhes}
            onCriarItemOrcamento={onCriarItemOrcamento}
          />
        ))
      )}
    </div>
  );
};
