
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

interface PropostaActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PropostaActions = ({ onSave, onCancel, isLoading }: PropostaActionsProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
      <Button className="bg-vdr-blue hover:bg-blue-800" onClick={onSave} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Salvar Proposta
      </Button>
    </div>
  );
};

export default PropostaActions;
