
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
import { supabase } from "@/integrations/supabase/client";

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
  const [isEnviando, setIsEnviando] = useState(false);
  const navigate = useNavigate();

  const handleEnviar = async () => {
    if (!atendimento?.id) {
      toast.error("Erro: Atendimento não encontrado");
      return;
    }

    setIsEnviando(true);
    
    try {
      console.log('Enviando atendimento para orçamento:', atendimento);
      
      // Atualizar o status do atendimento para "Enviado para Orçamento"
      const { error } = await supabase
        .from('atendimentos')
        .update({
          status: 'Enviado para Orçamento',
          mensagem: observacoes ? `${atendimento.mensagem || ''}\n\nObservações para orçamento: ${observacoes}` : atendimento.mensagem
        })
        .eq('id', atendimento.id);

      if (error) {
        console.error('Erro ao atualizar atendimento:', error);
        throw error;
      }

      console.log('Atendimento enviado para orçamento com sucesso');

      toast.success("Atendimento enviado para o módulo de orçamentos com sucesso!");
      onOpenChange(false);
      setObservacoes("");
      
      // Perguntar se quer navegar para orçamentos
      setTimeout(() => {
        if (window.confirm("Deseja ir para o módulo de orçamentos agora?")) {
          navigate("/orcamentos");
        }
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao enviar para orçamento:', error);
      toast.error("Erro ao enviar atendimento para orçamento");
    } finally {
      setIsEnviando(false);
    }
  };

  if (!atendimento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar para Orçamento</DialogTitle>
          <DialogDescription>
            Você está enviando o atendimento de <strong>{atendimento.cliente_nome}</strong>
            {atendimento.empresa && <span> ({atendimento.empresa})</span>} para o módulo de orçamentos.
            O orçamentista poderá criar uma proposta a partir deste atendimento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Detalhes do Atendimento:</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <p><strong>Cliente:</strong> {atendimento.cliente_nome}</p>
              {atendimento.empresa && <p><strong>Empresa:</strong> {atendimento.empresa}</p>}
              <p><strong>Assunto:</strong> {atendimento.assunto}</p>
              <p><strong>Canal:</strong> {atendimento.canal}</p>
              <p><strong>Contato:</strong> {atendimento.contato}</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="observacoes">Observações para o Orçamentista</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione observações ou requisitos específicos que o orçamentista deve considerar..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isEnviando}>
            Cancelar
          </Button>
          <Button onClick={handleEnviar} disabled={isEnviando}>
            {isEnviando ? "Enviando..." : "Enviar para Orçamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
