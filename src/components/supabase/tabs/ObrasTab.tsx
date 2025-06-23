
import React from 'react';
import TestTabContent from '../TestTabContent';
import StatusBadge from '../StatusBadge';
import { createTestData } from '../TestDataCreators';
import { useObras, useProjetos } from "@/hooks/useSupabaseModules";
import { usePropostas } from "@/hooks/usePropostas";

const ObrasTab = () => {
  const { obras, isLoading: loadingObras, criarObra, isCriando: criandoObra } = useObras();
  const { projetos } = useProjetos();
  const { clientes } = usePropostas();

  const handleCreateTest = () => {
    const clienteId = clientes.length > 0 ? clientes[0].id.toString() : null;
    const projetoId = projetos.length > 0 ? projetos[0].id : null;
    criarObra(createTestData.obra(clienteId, projetoId));
  };

  return (
    <TestTabContent 
      title="Obras" 
      count={obras.length}
      isLoading={loadingObras}
      onCreateTest={handleCreateTest}
      isCreating={criandoObra}
    >
      {obras.map((obra) => (
        <div key={obra.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <span className="font-medium">{obra.nome}</span>
            <span className="text-sm text-gray-600 ml-2">{obra.endereco}</span>
          </div>
          <div className="flex items-center gap-2">
            {obra.cliente && (
              <span className="text-sm text-gray-600">{obra.cliente.nome}</span>
            )}
            <StatusBadge status={obra.status} />
          </div>
        </div>
      ))}
    </TestTabContent>
  );
};

export default ObrasTab;
