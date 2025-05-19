
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InformacoesGerais from "@/components/proposta/InformacoesGerais";
import ItemProduto from "@/components/proposta/ItemProduto";
import CustoInterno from "@/components/proposta/CustoInterno";
import CondicoesComerciais from "@/components/proposta/CondicoesComerciais";
import { ClienteSimplificado, ProdutoAcabado, Proposta } from "@/types/orcamento";

interface PropostaTabsProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
  clientes: ClienteSimplificado[];
  produtosAcabados: ProdutoAcabado[];
  gerarNumeroProposta: () => string;
  handleClienteChange: (clienteId: number) => void;
}

const PropostaTabs = ({
  proposta,
  setProposta,
  clientes,
  produtosAcabados,
  gerarNumeroProposta,
  handleClienteChange
}: PropostaTabsProps) => {
  return (
    <Tabs defaultValue="info" className="space-y-4">
      <TabsList>
        <TabsTrigger value="info">Informações Gerais</TabsTrigger>
        <TabsTrigger value="itens">Itens e Valores</TabsTrigger>
        <TabsTrigger value="custos">Custos Internos</TabsTrigger>
        <TabsTrigger value="condicoes">Condições Comerciais</TabsTrigger>
      </TabsList>
      
      {/* Tab: Informações Gerais */}
      <TabsContent value="info">
        <InformacoesGerais 
          proposta={proposta} 
          setProposta={setProposta} 
          clientes={clientes}
          gerarNumeroProposta={gerarNumeroProposta}
          handleClienteChange={handleClienteChange}
        />
      </TabsContent>
      
      {/* Tab: Itens e Valores */}
      <TabsContent value="itens">
        <ItemProduto 
          proposta={proposta} 
          setProposta={setProposta} 
          produtosAcabados={produtosAcabados}
        />
      </TabsContent>
      
      {/* Tab: Custos Internos */}
      <TabsContent value="custos">
        <CustoInterno 
          proposta={proposta} 
          setProposta={setProposta}
        />
      </TabsContent>
      
      {/* Tab: Condições Comerciais */}
      <TabsContent value="condicoes">
        <CondicoesComerciais 
          proposta={proposta}
          setProposta={setProposta}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropostaTabs;
