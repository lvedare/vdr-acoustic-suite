
import React from 'react';
import { Badge } from "@/components/ui/badge";
import TestTabContent from '../TestTabContent';
import { createTestData } from '../TestDataCreators';
import { useInsumos } from "@/hooks/useSupabaseModules";

const InsumosTab = () => {
  const { insumos, isLoading: loadingInsumos, criarInsumo } = useInsumos();

  const handleCreateTest = () => {
    criarInsumo(createTestData.insumo());
  };

  return (
    <TestTabContent 
      title="Insumos" 
      count={insumos.length}
      isLoading={loadingInsumos}
      onCreateTest={handleCreateTest}
    >
      {insumos.map((insumo) => (
        <div key={insumo.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <span className="font-medium">{insumo.nome}</span>
            <span className="text-sm text-gray-600 ml-2">({insumo.codigo})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Estoque: {insumo.quantidade_estoque}</span>
            <Badge variant="outline">{insumo.categoria}</Badge>
          </div>
        </div>
      ))}
    </TestTabContent>
  );
};

export default InsumosTab;
