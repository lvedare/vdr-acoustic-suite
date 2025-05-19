
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HistoricoAtendimentos = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atendimentos</CardTitle>
        <CardDescription>
          Visualize o histórico completo de atendimentos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            O histórico detalhado de atendimentos será implementado em breve.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricoAtendimentos;
