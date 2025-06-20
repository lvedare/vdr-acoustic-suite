
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Proposta, formatCurrency } from "@/types/orcamento";

interface PropostasMetricsProps {
  propostas: Proposta[];
}

const PropostasMetrics = ({ propostas }: PropostasMetricsProps) => {
  // Calcular métricas
  const totalPropostas = propostas.length;
  const propostasAprovadas = propostas.filter(p => p.status === "aprovada").length;
  const propostasEnviadas = propostas.filter(p => p.status === "enviada").length;
  const propostasRejeitadas = propostas.filter(p => p.status === "rejeitada").length;
  
  const valorTotal = propostas.reduce((acc, p) => acc + p.valorTotal, 0);
  const valorAprovado = propostas
    .filter(p => p.status === "aprovada")
    .reduce((acc, p) => acc + p.valorTotal, 0);
  
  const taxaAprovacao = totalPropostas > 0 ? (propostasAprovadas / totalPropostas * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPropostas}</div>
          <div className="flex gap-1 mt-2">
            <Badge variant="outline" className="text-xs">
              {propostasEnviadas} enviadas
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              {propostasAprovadas} aprovadas
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(valorTotal)}</div>
          <p className="text-xs text-muted-foreground">
            Todas as propostas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(valorAprovado)}</div>
          <p className="text-xs text-muted-foreground">
            Propostas aprovadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{taxaAprovacao.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {propostasRejeitadas} rejeitadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropostasMetrics;
