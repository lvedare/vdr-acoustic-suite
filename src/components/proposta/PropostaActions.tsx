
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";

interface PropostaActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

const PropostaActions = ({ onSave, onCancel }: PropostaActionsProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onCancel}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
      <Button onClick={onSave}>
        <Save className="mr-2 h-4 w-4" />
        Salvar Proposta
      </Button>
    </div>
  );
};

export default PropostaActions;
