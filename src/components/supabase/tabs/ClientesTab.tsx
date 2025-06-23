
import React from 'react';
import TestTabContent from '../TestTabContent';
import { usePropostas } from "@/hooks/usePropostas";

const ClientesTab = () => {
  const { clientes } = usePropostas();

  return (
    <TestTabContent 
      title="Clientes" 
      count={clientes.length}
    >
      {clientes.map((cliente) => (
        <div key={cliente.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <span className="font-medium">{cliente.nome}</span>
            {cliente.email && <span className="text-sm text-gray-600 ml-2">{cliente.email}</span>}
          </div>
          {cliente.empresa && (
            <span className="text-sm text-gray-600">{cliente.empresa}</span>
          )}
        </div>
      ))}
    </TestTabContent>
  );
};

export default ClientesTab;
