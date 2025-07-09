
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AtendimentoCard } from "./AtendimentoCard";

interface AtendimentosListProps {
  atendimentosFiltrados: any[];
  atendimentosPendentes: any[];
  formatDate: (date: string) => string;
  onVisualizarAtendimento: (atendimento: any) => void;
  onCriarProposta: (atendimento: any) => void;
}

export const AtendimentosList: React.FC<AtendimentosListProps> = ({
  atendimentosFiltrados,
  atendimentosPendentes,
  formatDate,
  onVisualizarAtendimento,
  onCriarProposta,
}) => {
  if (atendimentosFiltrados.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            {atendimentosPendentes.length === 0 
              ? "Nenhum atendimento foi enviado para orçamento ainda."
              : "Nenhum atendimento encontrado com os filtros aplicados."
            }
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Os atendimentos enviados do módulo de CRM aparecerão aqui para criação de propostas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {atendimentosFiltrados.map((atendimento) => (
        <AtendimentoCard
          key={atendimento.id}
          atendimento={atendimento}
          formatDate={formatDate}
          onVisualizarAtendimento={onVisualizarAtendimento}
          onCriarProposta={onCriarProposta}
        />
      ))}
    </div>
  );
};
