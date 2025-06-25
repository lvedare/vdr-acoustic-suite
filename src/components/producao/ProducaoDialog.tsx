
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ProducaoDialogProps {
  onCreateOrdem: (ordem: any) => void;
}

export function ProducaoDialog({ onCreateOrdem }: ProducaoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    produto: "",
    quantidade: "",
    unidade: "pç",
    dataPrevisao: "",
    responsavel: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.produto || !formData.quantidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const novaOrdem = {
      id: `OP-${Date.now()}`,
      ...formData,
      status: "planejamento",
      progresso: 0,
      dataInicio: new Date().toISOString().split('T')[0],
      cliente: "Cliente Direto"
    };

    onCreateOrdem(novaOrdem);
    
    setFormData({
      numero: "",
      produto: "",
      quantidade: "",
      unidade: "pç",
      dataPrevisao: "",
      responsavel: "",
      observacoes: ""
    });
    
    setIsOpen(false);
    toast.success("Ordem de produção criada com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem de Produção
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Produção</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero">Número da OP *</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                placeholder="OP-2025-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="produto">Produto *</Label>
            <Input
              id="produto"
              value={formData.produto}
              onChange={(e) => setFormData(prev => ({ ...prev, produto: e.target.value }))}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
                placeholder="0"
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Select value={formData.unidade} onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pç">Peças</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                  <SelectItem value="m">Metros</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="L">Litros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="dataPrevisao">Data de Previsão</Label>
            <Input
              id="dataPrevisao"
              type="date"
              value={formData.dataPrevisao}
              onChange={(e) => setFormData(prev => ({ ...prev, dataPrevisao: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações sobre a ordem de produção"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Ordem</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
