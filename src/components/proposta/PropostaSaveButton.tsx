
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface PropostaSaveButtonProps {
  onClick: () => void;
  isRevision?: boolean;
  isEdit?: boolean;
  isLoading?: boolean;
}

const PropostaSaveButton = ({ onClick, isRevision, isEdit, isLoading }: PropostaSaveButtonProps) => {
  let buttonText = "Salvar Proposta";
  
  if (isRevision) {
    buttonText = "Salvar Revisão";
  } else if (isEdit) {
    buttonText = "Atualizar Proposta";
  }
  
  return (
    <Button onClick={onClick} className="bg-vdr-blue hover:bg-blue-800" disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      {buttonText}
    </Button>
  );
};

export default PropostaSaveButton;
