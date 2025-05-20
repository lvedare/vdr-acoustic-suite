
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PropostaHeaderProps {
  title: string;
  onBack: () => void;
}

const PropostaHeader = ({ title, onBack }: PropostaHeaderProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={onBack} className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default PropostaHeader;
