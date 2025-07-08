
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
      
      // Gerar número da proposta
      const numeroPropostaSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      const numeroProposta = `PROP-${numeroPropostaSuffix}`;
      
      // Criar proposta no Supabase
      const { data: novaProposta, error } = await supabase
        .from('propostas')
        .insert({
          numero: numeroProposta,
          data: new Date().toISOString().split('T')[0],
          cliente_id: atendimento.cliente_id,
          atendimento_id: atendimento.id,
          origem: 'atendimento',
          status: 'rascunho',
          observacoes: observacoes || `Proposta gerada a partir do atendimento: ${atendimento.assunto}`,
          valor_total: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar proposta:', error);
        throw error;
      }

      console.log('Proposta criada com sucesso:', novaProposta);

      // Remover dados antigos do localStorage (migração)
      const chaveAtendimento = `atendimento_orcamento_${atendimento.id}`;
      localStorage.removeItem(chaveAtendimento);
      
      const atendimentosExistentes = JSON.parse(localStorage.getItem('atendimentos_para_orcamento') || '[]');
      const atendimentosAtualizados = atendimentosExistentes.filter((item: any) => item.id !== atendimento.id);
      localStorage.setItem('atendimentos_para_orcamento', JSON.stringify(atendimentosAtualizados));

      toast.success("Atendimento enviado para orçamento com sucesso!");
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
