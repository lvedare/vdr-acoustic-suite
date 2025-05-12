
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjetosResumoCardProps {
  mockProjetos: {
    id: number;
    nome: string;
    cliente: string;
    status: string;
    tipo: string;
    dataInicio: string;
    dataPrevisao: string;
    dataConclusao?: string;
  }[];
}

export function ProjetosResumoCard({ mockProjetos }: ProjetosResumoCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockProjetos.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockProjetos.filter(p => p.status === "em_andamento").length}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockProjetos.filter(p => p.status === "planejamento").length}</div>
            <div className="text-sm text-muted-foreground">Planejamento</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockProjetos.filter(p => p.status === "concluido").length}</div>
            <div className="text-sm text-muted-foreground">Concluídos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
