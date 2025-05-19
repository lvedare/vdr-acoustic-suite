
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatusCount {
  total: number;
  planejamento: number;
  em_andamento: number;
  concluido: number;
  cancelado: number;
}

interface ObrasResumoCardProps {
  mockObras?: {
    id: number;
    nome: string;
    endereco: string;
    cliente: string;
    status: string;
    dataInicio: string;
    dataPrevisao: string;
    dataConclusao?: string;
  }[];
  statusCount?: StatusCount;
}

export function ObrasResumoCard({ mockObras, statusCount }: ObrasResumoCardProps) {
  // Use statusCount if provided, otherwise calculate from mockObras
  const count = statusCount || (mockObras ? {
    total: mockObras.length,
    planejamento: mockObras.filter(p => p.status === "planejamento").length,
    em_andamento: mockObras.filter(p => p.status === "em_andamento").length,
    concluido: mockObras.filter(p => p.status === "concluido").length,
    cancelado: mockObras.filter(p => p.status === "cancelado").length
  } : {
    total: 0,
    planejamento: 0,
    em_andamento: 0,
    concluido: 0,
    cancelado: 0
  });

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{count.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{count.em_andamento}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{count.planejamento}</div>
            <div className="text-sm text-muted-foreground">Planejamento</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{count.concluido}</div>
            <div className="text-sm text-muted-foreground">Concluídas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
