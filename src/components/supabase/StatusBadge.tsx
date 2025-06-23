
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusColors = {
    'rascunho': 'secondary',
    'enviada': 'outline',
    'aprovada': 'default',
    'rejeitada': 'destructive',
    'planejamento': 'secondary',
    'em_andamento': 'default',
    'concluido': 'default',
    'cancelado': 'destructive',
    'pendente': 'secondary'
  } as const;

  return (
    <Badge variant={statusColors[status as keyof typeof statusColors] || 'secondary'}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
