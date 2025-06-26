
import React from "react";

const AtendimentoLoadingState = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">CRM / Atendimento</h1>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground">
            Carregando atendimentos...
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoLoadingState;
