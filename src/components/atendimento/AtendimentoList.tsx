
import React from "react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AtendimentoActions } from "./AtendimentoActions";

interface AtendimentoListProps {
  atendimentos: any[];
  onVerDetalhes: (atendimento: any) => void;
  onExcluir: (atendimento: any) => void;
  onEnviarParaOrcamento: (atendimento: any) => void;
}

export const AtendimentoList: React.FC<AtendimentoListProps> = ({
  atendimentos,
  onVerDetalhes,
  onExcluir,
  onEnviarParaOrcamento
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Novo': { variant: 'default' as const, color: 'bg-blue-500' },
      'Em Andamento': { variant: 'secondary' as const, color: 'bg-yellow-500' },
      'Resolvido': { variant: 'outline' as const, color: 'bg-green-500' },
      'Fechado': { variant: 'outline' as const, color: 'bg-gray-500' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Novo'];
    return <Badge variant={config.variant}>{status}</Badge>;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {atendimentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <p className="text-muted-foreground">Nenhum atendimento encontrado</p>
              </TableCell>
            </TableRow>
          ) : (
            atendimentos.map((atendimento) => (
              <TableRow key={atendimento.id}>
                <TableCell className="font-medium">{atendimento.cliente_nome}</TableCell>
                <TableCell>{atendimento.assunto}</TableCell>
                <TableCell>{atendimento.canal}</TableCell>
                <TableCell>{getStatusBadge(atendimento.status)}</TableCell>
                <TableCell>{formatDate(atendimento.data)}</TableCell>
                <TableCell>{atendimento.contato}</TableCell>
                <TableCell className="text-right">
                  <AtendimentoActions
                    atendimento={atendimento}
                    onVerDetalhes={onVerDetalhes}
                    onExcluir={onExcluir}
                    onEnviarParaOrcamento={onEnviarParaOrcamento}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
