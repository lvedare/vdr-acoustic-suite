
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";

interface AtendimentoCardProps {
  atendimento: any;
  formatDate: (date: string) => string;
  onVisualizarAtendimento: (atendimento: any) => void;
  onCriarProposta: (atendimento: any) => void;
}

export const AtendimentoCard: React.FC<AtendimentoCardProps> = ({
  atendimento,
  formatDate,
  onVisualizarAtendimento,
  onCriarProposta,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{atendimento.cliente_nome}</span>
              <Badge variant="secondary" className="text-xs">
                Pendente
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {atendimento.cliente?.empresa && `${atendimento.cliente.empresa} • `}
              {atendimento.assunto}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Canal</p>
            <p className="text-sm">{atendimento.canal}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contato</p>
            <p className="text-sm">{atendimento.contato}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data do Atendimento</p>
            <p className="text-sm">{formatDate(atendimento.data)} {atendimento.hora}</p>
          </div>
        </div>

        {atendimento.mensagem && (
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground">Mensagem</p>
            <p className="text-sm bg-gray-50 p-2 rounded mt-1">
              {atendimento.mensagem}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVisualizarAtendimento(atendimento)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button
            size="sm"
            onClick={() => onCriarProposta(atendimento)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Proposta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
