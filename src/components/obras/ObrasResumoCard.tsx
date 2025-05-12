
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ObrasResumoCardProps {
  mockObras: {
    id: number;
    nome: string;
    endereco: string;
    cliente: string;
    status: string;
    dataInicio: string;
    dataPrevisao: string;
    dataConclusao?: string;
  }[];
}

export function ObrasResumoCard({ mockObras }: ObrasResumoCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockObras.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockObras.filter(p => p.status === "em_andamento").length}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockObras.filter(p => p.status === "planejamento").length}</div>
            <div className="text-sm text-muted-foreground">Planejamento</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{mockObras.filter(p => p.status === "concluido").length}</div>
            <div className="text-sm text-muted-foreground">Concluídas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
