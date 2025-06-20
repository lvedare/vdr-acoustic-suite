
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  propostaNumero: string;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ propostaNumero, onConfirm }: DeleteConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    // Close dialog programmatically
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    if (dialog) {
      const closeButton = dialog.querySelector('[data-state="open"]') as HTMLElement;
      closeButton?.click();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja excluir a proposta {propostaNumero}?
          Esta ação não pode ser desfeita.
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter>
        <Button variant="destructive" onClick={handleConfirm}>
          Excluir
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmDialog;
