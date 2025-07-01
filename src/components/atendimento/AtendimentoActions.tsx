
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, MessageSquare } from "lucide-react";

interface AtendimentoActionsProps {
  atendimento: any;
  onVerDetalhes: (atendimento: any) => void;
  onExcluir: (atendimento: any) => void;
  onEnviarParaOrcamento: (atendimento: any) => void;
}

export const AtendimentoActions: React.FC<AtendimentoActionsProps> = ({
  atendimento,
  onVerDetalhes,
  onExcluir,
  onEnviarParaOrcamento
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVerDetalhes(atendimento)}
        title="Ver detalhes"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEnviarParaOrcamento(atendimento)}
        title="Enviar para orçamento"
        className="text-blue-600 hover:text-blue-700"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onExcluir(atendimento)}
        title="Excluir atendimento"
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
