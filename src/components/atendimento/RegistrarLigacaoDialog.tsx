
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone } from "lucide-react";
import { useAtendimentos } from "@/hooks/useAtendimentos";

interface RegistrarLigacaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegistrarLigacaoDialog = ({ isOpen, onOpenChange }: RegistrarLigacaoDialogProps) => {
  const { criarLigacao, isCriandoLigacao } = useAtendimentos();
  const [formData, setFormData] = useState({
    cliente_nome: "",
    telefone: "",
    duracao: "",
    resumo: "",
    observacoes: "",
    usuario: "Sistema"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente_nome || !formData.telefone) {
      return;
    }

    criarLigacao({
      ...formData,
      data_ligacao: new Date().toISOString()
    });

    setFormData({
      cliente_nome: "",
      telefone: "",
      duracao: "",
      resumo: "",
      observacoes: "",
      usuario: "Sistema"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Registrar Ligação
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente_nome">Cliente *</Label>
            <Input
              id="cliente_nome"
              value={formData.cliente_nome}
              onChange={(e) => setFormData(prev => ({ ...prev, cliente_nome: e.target.value }))}
              placeholder="Nome do cliente"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duracao">Duração</Label>
            <Input
              id="duracao"
              value={formData.duracao}
              onChange={(e) => setFormData(prev => ({ ...prev, duracao: e.target.value }))}
              placeholder="Ex: 15 minutos"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resumo">Resumo da Ligação</Label>
            <Textarea
              id="resumo"
              value={formData.resumo}
              onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
              placeholder="Resumo do que foi conversado..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isCriandoLigacao}
            >
              {isCriandoLigacao ? "Salvando..." : "Registrar Ligação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrarLigacaoDialog;
