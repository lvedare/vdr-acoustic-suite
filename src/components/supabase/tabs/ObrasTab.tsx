
import React from 'react';
import TestTabContent from '../TestTabContent';
import StatusBadge from '../StatusBadge';
import { createTestData } from '../TestDataCreators';
import { useObras, useProjetos } from "@/hooks/useSupabaseModules";
import { usePropostas } from "@/hooks/usePropostas";

const ObrasTab = () => {
  const { obras, isLoading: loadingObras } = useObras();
  const { projetos } = useProjetos();
  const { clientes } = usePropostas();

  return (
    <TestTabContent 
      title="Obras" 
      count={obras.length}
      isLoading={loadingObras}
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
      
      {obras.length === 0 && !loadingObras && (
        <div className="text-center p-4 text-muted-foreground">
          <p>Nenhuma obra cadastrada.</p>
          <p className="text-sm mt-1">As obras são criadas automaticamente a partir de propostas aprovadas.</p>
        </div>
      )}
    </TestTabContent>
  );
};

export default ObrasTab;
