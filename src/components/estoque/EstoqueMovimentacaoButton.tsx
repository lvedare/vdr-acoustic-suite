import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, ArrowUpDown } from 'lucide-react';
import { MovimentacaoEstoqueDialog } from './MovimentacaoEstoqueDialog';

interface EstoqueMovimentacaoButtonProps {
  produtoId: string;
  produtoNome: string;
  tipo?: 'produto' | 'insumo';
}

export const EstoqueMovimentacaoButton = ({ 
  produtoId, 
  produtoNome, 
  tipo = 'produto' 
}: EstoqueMovimentacaoButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <ArrowUpDown className="h-4 w-4" />
        Movimentar Estoque
      </Button>
      
      <MovimentacaoEstoqueDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tipo={tipo}
        itemId={produtoId}
        itemNome={produtoNome}
      />
    </>
  );
};