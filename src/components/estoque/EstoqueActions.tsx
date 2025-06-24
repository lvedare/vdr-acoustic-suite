
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { MovimentacaoEstoqueDialog } from './MovimentacaoEstoqueDialog';

interface EstoqueActionsProps {
  itemId: string;
  itemNome: string;
  tipo: 'produto' | 'insumo';
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EstoqueActions = ({ 
  itemId, 
  itemNome, 
  tipo, 
  onEdit, 
  onDelete 
}: EstoqueActionsProps) => {
  const [isMovimentacaoDialogOpen, setIsMovimentacaoDialogOpen] = useState(false);

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
            onClick={onDelete}
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
    </>
  );
};
