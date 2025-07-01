
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EnviarParaOrcamentoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  atendimento: any;
}

export const EnviarParaOrcamentoDialog: React.FC<EnviarParaOrcamentoDialogProps> = ({
  isOpen,
  onOpenChange,
  atendimento
}) => {
  const [observacoes, setObservacoes] = useState("");
  const navigate = useNavigate();

  const handleEnviar = () => {
    // Salvar no localStorage para ser usado no módulo de orçamento
    const atendimentoParaOrcamento = {
      ...atendimento,
      observacoes_orcamento: observacoes,
      enviado_para_orcamento: true,
      data_envio_orcamento: new Date().toISOString()
    };

    // Salvar no localStorage
    localStorage.setItem(`atendimento_orcamento_${atendimento.id}`, JSON.stringify(atendimentoParaOrcamento));
    
    // Adicionar à lista de atendimentos para orçamento
    const atendimentosParaOrcamento = JSON.parse(localStorage.getItem('atendimentos_para_orcamento') || '[]');
    atendimentosParaOrcamento.push(atendimentoParaOrcamento);
    localStorage.setItem('atendimentos_para_orcamento', JSON.stringify(atendimentosParaOrcamento));

    toast.success("Atendimento enviado para orçamento com sucesso!");
    onOpenChange(false);
    
    // Perguntar se quer navegar para orçamentos
    setTimeout(() => {
      if (window.confirm("Deseja ir para o módulo de orçamentos agora?")) {
        navigate("/orcamentos");
      }
    }, 1000);
  };

  if (!atendimento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar para Orçamento</DialogTitle>
          <DialogDescription>
            Você está enviando o atendimento de <strong>{atendimento.cliente_nome}</strong> para o módulo de orçamentos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Detalhes do Atendimento:</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <p><strong>Assunto:</strong> {atendimento.assunto}</p>
              <p><strong>Canal:</strong> {atendimento.canal}</p>
              <p><strong>Contato:</strong> {atendimento.contato}</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="observacoes">Observações para o Orçamento</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione observações ou requisitos específicos para este orçamento..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEnviar}>
            Enviar para Orçamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
