
import React from 'react';
import { Badge } from "@/components/ui/badge";
import TestTabContent from '../TestTabContent';
import { createTestData } from '../TestDataCreators';
import { useProdutosAcabados } from "@/hooks/useSupabaseModules";

const ProdutosTab = () => {
  const { produtos, isLoading: loadingProdutos, criarProduto } = useProdutosAcabados();

  const handleCreateTest = () => {
    criarProduto(createTestData.produto());
  };

  return (
    <TestTabContent 
      title="Produtos" 
      count={produtos.length}
      isLoading={loadingProdutos}
      onCreateTest={handleCreateTest}
    >
      {produtos.map((produto) => (
        <div key={produto.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <span className="font-medium">{produto.nome}</span>
            <span className="text-sm text-gray-600 ml-2">({produto.codigo})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">R$ {produto.valor_base.toFixed(2)}</span>
            <Badge variant="outline">{produto.categoria}</Badge>
          </div>
        </div>
      ))}
    </TestTabContent>
  );
};

export default ProdutosTab;
