
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientes } from "@/hooks/useClientes";

interface NovoAtendimentoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export default function NovoAtendimentoDialog({
  isOpen,
  onOpenChange,
  onSubmit
}: NovoAtendimentoDialogProps) {
  const navigate = useNavigate();
  const { clientes } = useClientes();
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [formData, setFormData] = useState({
    cliente: "",
    contato: "",
    assunto: "",
    mensagem: "",
    canal: "WhatsApp",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClienteSelect = (value: string) => {
    setSelectedClienteId(value);
    
    if (value === "novo") {
      onOpenChange(false);
      navigate("/clientes", { state: { openNewClient: true } });
      return;
    }
    
    const selectedCliente = clientes.find(c => c.id === value);
    
    if (selectedCliente) {
      setFormData(prev => ({
        ...prev,
        cliente: selectedCliente.nome,
        contato: selectedCliente.telefone || selectedCliente.email || '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar data no formato ISO (YYYY-MM-DD)
    const now = new Date();
    const dataISO = now.toISOString().split('T')[0];
    const horaFormatada = now.toTimeString().slice(0, 5);
    
    const atendimentoData = {
      cliente_nome: formData.cliente,
      contato: formData.contato,
      assunto: formData.assunto,
      mensagem: formData.mensagem,
      data: dataISO, // Formato correto para Supabase
      hora: horaFormatada,
      canal: formData.canal,
      status: "Novo",
      cliente_id: selectedClienteId !== "novo" && selectedClienteId ? selectedClienteId : null,
    };
    
    onSubmit(atendimentoData);
    
    // Reset form
    setFormData({
      cliente: "",
      contato: "",
      assunto: "",
      mensagem: "",
      canal: "WhatsApp",
    });
    setSelectedClienteId("");
  };

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
      </Button>
      
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
            <DialogDescription>
              Registre um novo atendimento ao cliente.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="clienteSelect">Cliente</Label>
                <Select
                  value={selectedClienteId}
                  onValueChange={handleClienteSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente ou cadastre um novo" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.empresa || "Pessoa Física"}
                      </SelectItem>
                    ))}
                    <SelectItem value="novo" className="text-vdr-blue font-medium">
                      <div className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Cadastrar novo cliente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Nome</Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contato">Contato</Label>
                  <Input
                    id="contato"
                    name="contato"
                    value={formData.contato}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="assunto">Assunto</Label>
                <Input
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="canal">Canal</Label>
                <Select
                  value={formData.canal}
                  onValueChange={(value) => setFormData({...formData, canal: value})}
                >
                  <SelectTrigger id="canal">
                    <SelectValue placeholder="Selecione o canal de atendimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Telefone">Telefone</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-vdr-blue hover:bg-blue-800">
                Registrar Atendimento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
