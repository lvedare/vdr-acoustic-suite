
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Package } from "lucide-react";

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

export const EstoquePlaceholders = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-md">
      <Package className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Nenhum material encontrado</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Não foram encontrados materiais com os filtros selecionados. Tente ajustar seus filtros ou adicione novos materiais ao estoque.
      </p>
    </div>
  );
};
