
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface PropostaSaveButtonProps {
  onClick: () => void;
  isRevision?: boolean;
  isEdit?: boolean;
}

const PropostaSaveButton = ({ onClick, isRevision, isEdit }: PropostaSaveButtonProps) => {
  let buttonText = "Salvar Proposta";
  
  if (isRevision) {
    buttonText = "Salvar Revisão";
  } else if (isEdit) {
    buttonText = "Atualizar Proposta";
  }
  
  return (
    <Button onClick={onClick} className="bg-vdr-blue hover:bg-blue-800">
      <Save className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default PropostaSaveButton;
