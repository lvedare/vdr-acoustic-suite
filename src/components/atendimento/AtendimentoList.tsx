
import React from "react";
import { Badge } from "@/components/ui/badge";
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

interface AtendimentoListProps {
  atendimentos: Atendimento[];
  selectedAtendimento: Atendimento;
  onSelectAtendimento: (atendimento: Atendimento) => void;
}

const AtendimentoList = ({ 
  atendimentos, 
  selectedAtendimento, 
  onSelectAtendimento 
}: AtendimentoListProps) => {
  return (
    <div className="rounded-md border">
      <div className="flex flex-col divide-y">
        {atendimentos.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhum atendimento encontrado.
          </div>
        ) : (
          atendimentos.map((atendimento) => (
            <div
              key={atendimento.id}
              className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                selectedAtendimento.id === atendimento.id
                  ? "bg-muted/50"
                  : ""
              }`}
              onClick={() => onSelectAtendimento(atendimento)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{atendimento.cliente}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{atendimento.data}</span>
                  <span>{atendimento.hora}</span>
                </div>
              </div>
              <div className="mt-1 text-sm">{atendimento.assunto}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{atendimento.canal}</Badge>
                  <Badge
                    className={getStatusColor(atendimento.status)}
                    variant="secondary"
                  >
                    {atendimento.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AtendimentoList;
