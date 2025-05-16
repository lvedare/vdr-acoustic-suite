
import React from "react";
import { ProdutoDialog } from "./ProdutoDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ForceDeleteDialog } from "./ForceDeleteDialog";
import { ProdutoDetailDialog } from "./ProdutoDetailDialog";
import { ComposicaoProdutoDialog } from "./ComposicaoProdutoDialog";
import { useProdutos } from "@/contexts/ProdutosContext";
import { categorias } from "@/contexts/ProdutosContext";
import { useInsumos } from "@/contexts/InsumosContext";

export const ProdutosDialogContainer: React.FC = () => {
  const {
    isProdutoDialogOpen,
    setIsProdutoDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    isProdutoDetailOpen,
    setIsProdutoDetailOpen,
    isComposicaoDialogOpen,
    setIsComposicaoDialogOpen,
    produtoAtual,
    novoProduto,
    setNovoProduto,
    composicaoAtual,
    setComposicaoAtual,
    handleSalvarProduto,
    handleExcluirProduto,
    handleForceExcluirProduto,
    formatarData,
    calcularValorTotal,
    handleEditarComposicao,
    handleSalvarComposicao
  } = useProdutos();

  return (
    <>
      <ProdutoDialog
        isOpen={isProdutoDialogOpen}
        onOpenChange={setIsProdutoDialogOpen}
        produtoAtual={produtoAtual}
        novoProduto={novoProduto}
        setNovoProduto={setNovoProduto}
        onSalvar={handleSalvarProduto}
        categorias={categorias}
      />
      
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleExcluirProduto}
      />
      
      <ForceDeleteDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleForceExcluirProduto}
      />
      
      <ProdutoDetailDialog
        isOpen={isProdutoDetailOpen}
        onOpenChange={setIsProdutoDetailOpen}
        produto={produtoAtual}
        formatarData={formatarData}
        onEditarComposicao={handleEditarComposicao}
      />

      {/* Novo diálogo de Composição */}
      <ComposicaoProdutoDialog
        isOpen={isComposicaoDialogOpen}
        onOpenChange={setIsComposicaoDialogOpen}
        produtoAtual={produtoAtual}
        composicaoAtual={composicaoAtual}
        setComposicaoAtual={setComposicaoAtual}
        onSalvar={handleSalvarComposicao}
        calcularValorTotal={calcularValorTotal}
      />
    </>
  );
};
