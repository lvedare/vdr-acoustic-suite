
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
      
      // Preparar dados do atendimento para orçamento
      const atendimentoParaOrcamento = {
        id: atendimento.id,
        cliente_nome: atendimento.cliente_nome,
        empresa: atendimento.empresa,
        cliente_id: atendimento.cliente_id,
        assunto: atendimento.assunto,
        contato: atendimento.contato,
        canal: atendimento.canal,
        data: atendimento.data,
        hora: atendimento.hora,
        status: atendimento.status,
        mensagem: atendimento.mensagem,
        observacoes_orcamento: observacoes,
        enviado_para_orcamento: true,
        data_envio_orcamento: new Date().toISOString()
      };

      // Salvar no localStorage para ser usado no módulo de orçamento
      const chaveAtendimento = `atendimento_orcamento_${atendimento.id}`;
      localStorage.setItem(chaveAtendimento, JSON.stringify(atendimentoParaOrcamento));
      
      // Adicionar à lista de atendimentos para orçamento
      const atendimentosExistentes = JSON.parse(localStorage.getItem('atendimentos_para_orcamento') || '[]');
      
      // Verificar se já existe para evitar duplicatas
      const jaExiste = atendimentosExistentes.some((item: any) => item.id === atendimento.id);
      
      if (!jaExiste) {
        atendimentosExistentes.push(atendimentoParaOrcamento);
        localStorage.setItem('atendimentos_para_orcamento', JSON.stringify(atendimentosExistentes));
        console.log('Atendimento adicionado à lista de orçamentos:', atendimentosExistentes);
      }

      // Disparar evento de mudança no localStorage para atualizar outras abas
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'atendimentos_para_orcamento',
        newValue: JSON.stringify(atendimentosExistentes)
      }));

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
