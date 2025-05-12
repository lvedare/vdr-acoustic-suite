
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar } from "lucide-react";

export const MovimentacoesPlaceholder = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Movimentações</CardTitle>
        <CardDescription>Entradas e saídas de materiais do estoque</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-60">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            Histórico de movimentações será implementado em breve
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const RelatoriosPlaceholder = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios de Estoque</CardTitle>
        <CardDescription>Análise e estatísticas do estoque</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-60">
        <div className="text-center">
          <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            Relatórios de estoque serão implementados em breve
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
