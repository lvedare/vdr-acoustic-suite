
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Excluir item",
  description,
  itemName,
  isLoading = false
}) => {
  const defaultDescription = itemName 
    ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
    : "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
