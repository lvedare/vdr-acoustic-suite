
import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Plus } from "lucide-react";
import NovoAtendimentoDialog from "./NovoAtendimentoDialog";

interface AtendimentoHeaderProps {
  isNovoAtendimentoOpen: boolean;
  setIsNovoAtendimentoOpen: (open: boolean) => void;
  onNovoAtendimento: (data: any) => void;
  onRegistrarLigacao: () => void;
}

const AtendimentoHeader = ({
  isNovoAtendimentoOpen,
  setIsNovoAtendimentoOpen,
  onNovoAtendimento,
  onRegistrarLigacao
}: AtendimentoHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold">CRM / Atendimento</h1>
      <div className="flex items-center gap-2">
        <Button 
          className="bg-vdr-blue hover:bg-blue-800"
          onClick={onRegistrarLigacao}
        >
          <Phone className="mr-2 h-4 w-4" /> Registrar Ligação
        </Button>
        <NovoAtendimentoDialog
          isOpen={isNovoAtendimentoOpen}
          onOpenChange={setIsNovoAtendimentoOpen}
          onSubmit={onNovoAtendimento}
        />
      </div>
    </div>
  );
};

export default AtendimentoHeader;
