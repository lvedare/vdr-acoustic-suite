
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StatusChangeDialogProps {
  propostaId: number;
  propostaNumero: string;
  currentStatus: string;
  onChangeStatus: (id: number, status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => void;
  getStatusColor: (status: string) => string;
}

const StatusChangeDialog = ({ 
  propostaId, 
  propostaNumero,
  currentStatus, 
  onChangeStatus, 
  getStatusColor 
}: StatusChangeDialogProps) => {
  const handleStatusChange = (status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => {
    onChangeStatus(propostaId, status);
    // Close dialog programmatically
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    if (dialog) {
      const closeButton = dialog.querySelector('[data-state="open"]') as HTMLElement;
      closeButton?.click();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Alterar Status</DialogTitle>
        <DialogDescription>
          Selecione o novo status para a proposta {propostaNumero}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-2 py-4">
        <Button
          variant="outline"
          onClick={() => handleStatusChange("enviada")}
          className={`justify-start ${currentStatus === 'enviada' ? 'border-blue-500' : ''}`}
        >
          <Badge variant="outline" className={getStatusColor("enviada")}>ENVIADA</Badge>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleStatusChange("aprovada")}
          className={`justify-start ${currentStatus === 'aprovada' ? 'border-green-500' : ''}`}
        >
          <Badge variant="outline" className={getStatusColor("aprovada")}>APROVADA</Badge>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleStatusChange("rejeitada")}
          className={`justify-start ${currentStatus === 'rejeitada' ? 'border-red-500' : ''}`}
        >
          <Badge variant="outline" className={getStatusColor("rejeitada")}>REJEITADA</Badge>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleStatusChange("expirada")}
          className={`justify-start ${currentStatus === 'expirada' ? 'border-yellow-500' : ''}`}
        >
          <Badge variant="outline" className={getStatusColor("expirada")}>EXPIRADA</Badge>
        </Button>
      </div>
    </DialogContent>
  );
};

export default StatusChangeDialog;
