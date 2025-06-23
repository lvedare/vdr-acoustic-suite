
import React from 'react';
import TestTabContent from '../TestTabContent';
import StatusBadge from '../StatusBadge';
import { createTestData } from '../TestDataCreators';
import { useProjetos } from "@/hooks/useSupabaseModules";
import { usePropostas } from "@/hooks/usePropostas";

const ProjetosTab = () => {
  const { projetos, isLoading: loadingProjetos, criarProjeto } = useProjetos();
  const { clientes } = usePropostas();

  const handleCreateTest = () => {
    const clienteId = clientes.length > 0 ? clientes[0].id.toString() : null;
    criarProjeto(createTestData.projeto(clienteId));
  };

  return (
    <TestTabContent 
      title="Projetos" 
      count={projetos.length}
      isLoading={loadingProjetos}
      onCreateTest={handleCreateTest}
    >
      {projetos.map((projeto) => (
        <div key={projeto.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <span className="font-medium">{projeto.nome}</span>
            <span className="text-sm text-gray-600 ml-2">{projeto.tipo}</span>
          </div>
          <div className="flex items-center gap-2">
            {projeto.cliente && (
              <span className="text-sm text-gray-600">{projeto.cliente.nome}</span>
            )}
            <StatusBadge status={projeto.status} />
          </div>
        </div>
      ))}
    </TestTabContent>
  );
};

export default ProjetosTab;
