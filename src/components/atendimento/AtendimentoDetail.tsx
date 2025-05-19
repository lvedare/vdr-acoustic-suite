
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Phone } from "lucide-react";
import { getStatusColor } from "./utils";

type Atendimento = {
  id: number;
  cliente: string;
  contato: string;
  assunto: string;
  data: string;
  hora: string;
  canal: string;
  status: string;
  mensagem: string;
};

interface AtendimentoDetailProps {
  atendimento: Atendimento | null;
  onViewHistory: () => void;
  onConverterEmOrcamento: (atendimento: Atendimento) => void;
}

const AtendimentoDetail = ({
  atendimento,
  onViewHistory,
  onConverterEmOrcamento,
}: AtendimentoDetailProps) => {
  if (!atendimento) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
        Selecione um atendimento para ver os detalhes.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Detalhes do Atendimento
        </h3>
        <Badge
          className={getStatusColor(atendimento.status)}
          variant="secondary"
        >
          {atendimento.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1 text-sm text-muted-foreground">
            Cliente
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{atendimento.cliente}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-sm text-muted-foreground">
            Contato
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{atendimento.contato}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-sm text-muted-foreground">
            Assunto
          </div>
          <div>{atendimento.assunto}</div>
        </div>

        <div>
          <div className="mb-1 text-sm text-muted-foreground">
            Canal
          </div>
          <Badge variant="outline">{atendimento.canal}</Badge>
        </div>

        <Separator />

        <div>
          <div className="mb-1 text-sm text-muted-foreground">
            Mensagem
          </div>
          <div className="rounded-md bg-muted p-3 text-sm">
            {atendimento.mensagem}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onViewHistory}>Histórico</Button>
        {atendimento.status !== "Convertido" && (
          <Button 
            className="bg-vdr-blue hover:bg-blue-800" 
            onClick={() => onConverterEmOrcamento(atendimento)}
          >
            Converter em Orçamento
          </Button>
        )}
      </div>
    </div>
  );
};

export default AtendimentoDetail;
