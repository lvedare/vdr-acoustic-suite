
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AtendimentoActions } from "./AtendimentoActions";

interface AtendimentoKanbanViewProps {
  atendimentos: any[];
  onVerDetalhes: (atendimento: any) => void;
  onExcluir: (atendimento: any) => void;
  onEnviarParaOrcamento: (atendimento: any) => void;
}

export const AtendimentoKanbanView: React.FC<AtendimentoKanbanViewProps> = ({
  atendimentos,
  onVerDetalhes,
  onExcluir,
  onEnviarParaOrcamento
}) => {
  const statusColumns = [
    { key: 'Novo', title: 'Novos', color: 'bg-blue-50 border-blue-200' },
    { key: 'Em Andamento', title: 'Em Andamento', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'Resolvido', title: 'Resolvidos', color: 'bg-green-50 border-green-200' },
    { key: 'Fechado', title: 'Fechados', color: 'bg-gray-50 border-gray-200' }
  ];

  const getAtendimentosByStatus = (status: string) => {
    return atendimentos.filter(atendimento => atendimento.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusColumns.map((column) => (
        <div key={column.key} className={`border rounded-lg p-4 ${column.color}`}>
          <h3 className="font-semibold mb-4 flex items-center justify-between">
            {column.title}
            <Badge variant="secondary" className="ml-2">
              {getAtendimentosByStatus(column.key).length}
            </Badge>
          </h3>
          
          <div className="space-y-3">
            {getAtendimentosByStatus(column.key).map((atendimento) => (
              <Card key={atendimento.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {atendimento.cliente_nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {atendimento.assunto}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                    <span>{atendimento.canal}</span>
                    <span>{formatDate(atendimento.data)}</span>
                  </div>
                  <AtendimentoActions
                    atendimento={atendimento}
                    onVerDetalhes={onVerDetalhes}
                    onExcluir={onExcluir}
                    onEnviarParaOrcamento={onEnviarParaOrcamento}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
