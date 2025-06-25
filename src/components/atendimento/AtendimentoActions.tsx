
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";

interface AtendimentoActionsProps {
  onDelete: () => void;
  onConverterEmOrcamento: () => void;
}

export function AtendimentoActions({ onDelete, onConverterEmOrcamento }: AtendimentoActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm"
        onClick={onConverterEmOrcamento}
        className="bg-vdr-blue hover:bg-blue-800"
      >
        <FileText className="h-4 w-4 mr-2" />
        Criar Proposta
      </Button>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Excluir
      </Button>
    </div>
  );
}
