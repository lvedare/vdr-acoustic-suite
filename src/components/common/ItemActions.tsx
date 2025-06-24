
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface ItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isDeleting?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
}

export const ItemActions: React.FC<ItemActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  isDeleting = false,
  editLabel = "Editar",
  deleteLabel = "Excluir",
  viewLabel = "Visualizar"
}) => {
  return (
    <div className="flex justify-end gap-2">
      {onView && (
        <Button 
          variant="ghost" 
          size="icon"
          title={viewLabel}
          onClick={onView}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button 
          variant="ghost" 
          size="icon"
          title={editLabel}
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button 
          variant="ghost" 
          size="icon"
          title={deleteLabel}
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
