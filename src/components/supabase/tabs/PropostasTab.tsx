
import React from 'react';
import TestTabContent from '../TestTabContent';
import StatusBadge from '../StatusBadge';
import { usePropostas } from "@/hooks/usePropostas";

const PropostasTab = () => {
  const { propostas, isLoading: loadingPropostas } = usePropostas();

  return (
    <TestTabContent 
      title="Propostas" 
      count={propostas.length}
      isLoading={loadingPropostas}
    >
      {propostas.map((proposta) => (
        <div key={proposta.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <span className="font-medium">{proposta.numero}</span>
            <span className="text-sm text-gray-600 ml-2">{proposta.cliente.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">R$ {proposta.valorTotal.toFixed(2)}</span>
            <StatusBadge status={proposta.status} />
          </div>
        </div>
      ))}
    </TestTabContent>
  );
};

export default PropostasTab;
