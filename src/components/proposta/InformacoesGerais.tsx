
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClienteSimplificado, Proposta } from "@/types/orcamento";

interface InformacoesGeraisProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
  clientes: ClienteSimplificado[];
  gerarNumeroProposta: () => string;
  handleClienteChange: (clienteId: number) => void;
  clienteDesabilitado?: boolean;
}

const InformacoesGerais = ({ 
  proposta, 
  setProposta, 
  clientes, 
  gerarNumeroProposta,
  handleClienteChange,
  clienteDesabilitado = false
}: InformacoesGeraisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Proposta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="numero">Número da Proposta</Label>
            <div className="flex space-x-2">
              <Input 
                id="numero" 
                value={proposta.numero} 
                onChange={(e) => setProposta(prev => ({ ...prev, numero: e.target.value }))} 
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setProposta(prev => ({ ...prev, numero: gerarNumeroProposta() }))}
              >
                Gerar
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="data">Data da Proposta</Label>
            <Input 
              id="data" 
              type="date" 
              value={proposta.data} 
              onChange={(e) => setProposta(prev => ({ ...prev, data: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          {clienteDesabilitado ? (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{proposta.cliente.nome}</p>
              <p className="text-sm text-muted-foreground">Cliente carregado automaticamente do atendimento</p>
            </div>
          ) : (
            <Select
              value={proposta.cliente.id > 0 ? proposta.cliente.id.toString() : "selecionar"}
              onValueChange={(value) => handleClienteChange(value === "selecionar" ? 0 : Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selecionar">Selecione um cliente</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nome} {cliente.empresa && `(${cliente.empresa})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {proposta.cliente.id > 0 && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Nome:</span> {proposta.cliente.nome}
                </div>
                <div>
                  <span className="font-medium">Empresa:</span> {proposta.cliente.empresa || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {proposta.cliente.email}
                </div>
                <div>
                  <span className="font-medium">Telefone:</span> {proposta.cliente.telefone}
                </div>
                <div>
                  <span className="font-medium">CNPJ/CPF:</span> {proposta.cliente.cnpj || 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default InformacoesGerais;
