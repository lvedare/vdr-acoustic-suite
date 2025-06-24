
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { MovimentacaoEstoqueDialog } from './MovimentacaoEstoqueDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';

interface EstoqueActionsProps {
  itemId: string;
  itemNome: string;
  tipo: 'produto' | 'insumo';
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const EstoqueActions = ({ 
  itemId, 
  itemNome, 
  tipo, 
  onEdit, 
  onDelete,
  isDeleting = false
}: EstoqueActionsProps) => {
  const [isMovimentacaoDialogOpen, setIsMovimentacaoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          title="Registrar Movimentação"
          onClick={() => setIsMovimentacaoDialogOpen(true)}
        >
          <PackagePlus className="h-4 w-4" />
        </Button>
        {onEdit && (
          <Button 
            variant="ghost" 
            size="icon"
            title="Editar"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon"
            title="Excluir"
            className="text-destructive hover:text-destructive"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <MovimentacaoEstoqueDialog
        isOpen={isMovimentacaoDialogOpen}
        onOpenChange={setIsMovimentacaoDialogOpen}
        tipo={tipo}
        itemId={itemId}
        itemNome={itemNome}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Excluir ${tipo === 'produto' ? 'Produto' : 'Insumo'}`}
        itemName={itemNome}
        isLoading={isDeleting}
      />
    </>
  );
};
