
import React from "react";

export const AtendimentosHeader: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Atendimentos Pendentes de Orçamento</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Atendimentos enviados do módulo de CRM que precisam de propostas orçamentárias.
      </p>
    </div>
  );
};
