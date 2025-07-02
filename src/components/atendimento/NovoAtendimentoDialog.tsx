
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useClientes } from "@/hooks/useClientes";

interface NovoAtendimentoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (atendimento: any) => void;
}

const NovoAtendimentoDialog: React.FC<NovoAtendimentoDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
}) => {
  const { clientes } = useClientes();
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [usarEnderecoCliente, setUsarEnderecoCliente] = useState(true);
  
  const [formData, setFormData] = useState({
    cliente_nome: "",
    cliente_id: "",
    contato: "",
    assunto: "",
    mensagem: "",
    canal: "WhatsApp",
    status: "Novo",
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
    endereco_entrega: "",
    endereco_obra: "",
    usar_endereco_cliente: true
  });

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente) {
      setClienteSelecionado(cliente);
      setFormData(prev => ({
        ...prev,
        cliente_id: clienteId,
        cliente_nome: cliente.nome,
        contato: cliente.telefone || cliente.email || "",
        endereco_entrega: usarEnderecoCliente ? getEnderecoCompleto(cliente) : "",
        endereco_obra: usarEnderecoCliente ? getEnderecoCompleto(cliente) : ""
      }));
    }
  };

  const getEnderecoCompleto = (cliente: any) => {
    if (!cliente) return "";
    const endereco = [
      cliente.endereco_rua,
      cliente.endereco_numero,
      cliente.endereco_bairro,
      cliente.endereco_cidade,
      cliente.endereco_estado,
      cliente.endereco_cep
    ].filter(Boolean).join(", ");
    return endereco;
  };

  const handleUsarEnderecoClienteChange = (checked: boolean) => {
    setUsarEnderecoCliente(checked);
    setFormData(prev => ({
      ...prev,
      usar_endereco_cliente: checked,
      endereco_entrega: checked && clienteSelecionado ? getEnderecoCompleto(clienteSelecionado) : "",
      endereco_obra: checked && clienteSelecionado ? getEnderecoCompleto(clienteSelecionado) : ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      cliente_nome: "",
      cliente_id: "",
      contato: "",
      assunto: "",
      mensagem: "",
      canal: "WhatsApp",
      status: "Novo",
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
      endereco_entrega: "",
      endereco_obra: "",
      usar_endereco_cliente: true
    });
    setClienteSelecionado(null);
    setUsarEnderecoCliente(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Atendimento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={formData.cliente_id} onValueChange={handleClienteChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome} {cliente.empresa && `- ${cliente.empresa}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contato">Contato</Label>
              <Input
                id="contato"
                value={formData.contato}
                onChange={(e) => setFormData(prev => ({ ...prev, contato: e.target.value }))}
                placeholder="Telefone ou email"
                required
              />
            </div>
          </div>

          {clienteSelecionado && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Dados do Cliente</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Nome:</strong> {clienteSelecionado.nome}</div>
                <div><strong>Email:</strong> {clienteSelecionado.email || "Não informado"}</div>
                <div><strong>Telefone:</strong> {clienteSelecionado.telefone || "Não informado"}</div>
                <div><strong>CNPJ:</strong> {clienteSelecionado.cnpj || "Não informado"}</div>
                <div><strong>Empresa:</strong> {clienteSelecionado.empresa || "Não informado"}</div>
                <div><strong>Inscrição Estadual:</strong> {clienteSelecionado.inscricao_estadual || "Não informado"}</div>
              </div>
              {getEnderecoCompleto(clienteSelecionado) && (
                <div className="mt-2">
                  <strong>Endereço:</strong> {getEnderecoCompleto(clienteSelecionado)}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                value={formData.assunto}
                onChange={(e) => setFormData(prev => ({ ...prev, assunto: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="canal">Canal</Label>
              <Select value={formData.canal} onValueChange={(value) => setFormData(prev => ({ ...prev, canal: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Telefone">Telefone</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="usar_endereco_cliente"
                checked={usarEnderecoCliente}
                onCheckedChange={handleUsarEnderecoClienteChange}
              />
              <Label htmlFor="usar_endereco_cliente">
                Usar endereço do cliente para entrega/obra
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endereco_entrega">Endereço de Entrega</Label>
                <Textarea
                  id="endereco_entrega"
                  value={formData.endereco_entrega}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_entrega: e.target.value }))}
                  placeholder="Endereço completo para entrega"
                  rows={2}
                  disabled={usarEnderecoCliente}
                />
              </div>

              <div>
                <Label htmlFor="endereco_obra">Endereço da Obra</Label>
                <Textarea
                  id="endereco_obra"
                  value={formData.endereco_obra}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco_obra: e.target.value }))}
                  placeholder="Endereço onde será executada a obra"
                  rows={2}
                  disabled={usarEnderecoCliente}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Atendimento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAtendimentoDialog;
