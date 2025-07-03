import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface SafeDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isLoading?: boolean;
  relatedItems?: {
    type: string;
    count: number;
    items: string[];
  }[];
}

export const SafeDeleteDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  itemName,
  isLoading = false,
  relatedItems = []
}: SafeDeleteDialogProps) => {
  const hasRelatedItems = relatedItems.some(item => item.count > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {hasRelatedItems ? (
              <div className="space-y-3">
                <p>
                  O item <strong>{itemName}</strong> possui registros relacionados:
                </p>
                <div className="space-y-2">
                  {relatedItems.map((item, index) => (
                    item.count > 0 && (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{item.type}</span>
                        <Badge variant="secondary">{item.count} registro(s)</Badge>
                      </div>
                    )
                  ))}
                </div>
                <p className="text-destructive text-sm">
                  ⚠️ A exclusão deste item pode causar problemas no sistema. 
                  Recomendamos primeiro remover ou transferir os registros relacionados.
                </p>
              </div>
            ) : (
              <p>
                Tem certeza que deseja excluir <strong>{itemName}</strong>? 
                Esta ação não pode ser desfeita.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading || hasRelatedItems}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {hasRelatedItems ? 'Não é possível excluir' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};