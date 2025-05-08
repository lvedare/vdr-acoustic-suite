
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OBS_DEFAULT, Proposta } from "@/types/orcamento";

interface CondicoesComerciais {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
}

const CondicoesComerciais = ({ proposta, setProposta }: CondicoesComerciais) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Condições Comerciais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
            <Input 
              id="formaPagamento" 
              value={proposta.formaPagamento} 
              onChange={(e) => setProposta(prev => ({ ...prev, formaPagamento: e.target.value }))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="validade">Validade da Proposta</Label>
            <Input 
              id="validade" 
              value={proposta.validade}
              onChange={(e) => setProposta(prev => ({ ...prev, validade: e.target.value }))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prazoEntrega">Prazo de Entrega do Material</Label>
            <Input 
              id="prazoEntrega" 
              value={proposta.prazoEntrega}
              onChange={(e) => setProposta(prev => ({ ...prev, prazoEntrega: e.target.value }))} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prazoObra">Prazo de Execução da Obra</Label>
            <Input 
              id="prazoObra" 
              value={proposta.prazoObra}
              onChange={(e) => setProposta(prev => ({ ...prev, prazoObra: e.target.value }))} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações da Proposta</Label>
          <Textarea 
            id="observacoes" 
            value={proposta.observacoes} 
            onChange={(e) => setProposta(prev => ({ ...prev, observacoes: e.target.value }))} 
            rows={6}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setProposta(prev => ({ ...prev, observacoes: OBS_DEFAULT }))}
          >
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CondicoesComerciais;
