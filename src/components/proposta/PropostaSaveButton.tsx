
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface PropostaSaveButtonProps {
  onClick: () => void;
}

const PropostaSaveButton = ({ onClick }: PropostaSaveButtonProps) => {
  return (
    <Button onClick={onClick} className="bg-vdr-blue hover:bg-blue-800">
      <Save className="mr-2 h-4 w-4" />
      Salvar Proposta
    </Button>
  );
};

export default PropostaSaveButton;
