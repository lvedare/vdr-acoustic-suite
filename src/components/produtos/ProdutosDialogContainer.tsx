
import React from "react";
import { ProdutoDialog } from "./ProdutoDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ForceDeleteDialog } from "./ForceDeleteDialog";
import { ProdutoDetailDialog } from "./ProdutoDetailDialog";
import { useProdutos } from "@/contexts/ProdutosContext";
import { categorias } from "@/contexts/ProdutosContext";

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
    produtoAtual,
    novoProduto,
    setNovoProduto,
    handleSalvarProduto,
    handleExcluirProduto,
    handleForceExcluirProduto,
    formatarData
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
      />
    </>
  );
};
