
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropostasCriadasSectionProps {
  propostas: any[];
}

export const PropostasCriadasSection: React.FC<PropostasCriadasSectionProps> = ({
  propostas,
}) => {
  const navigate = useNavigate();

  if (propostas.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Propostas Criadas a partir de Atendimentos</h3>
      <div className="grid gap-4">
        {propostas.map((proposta) => (
          <Card key={proposta.id} className="hover:shadow-md transition-shadow border-green-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>{proposta.numero}</span>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      Proposta Criada
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cliente: {proposta.cliente?.nome}
                    {proposta.cliente?.empresa && ` (${proposta.cliente.empresa})`}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/visualizar-orcamento/${proposta.id}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Visualizar Proposta
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
