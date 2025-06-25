
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClienteSimplificado, ProdutoAcabado, Proposta } from "@/types/orcamento";
import InformacoesGerais from "./InformacoesGerais";
import ItemProduto from "./ItemProduto";
import CondicoesComerciais from "./CondicoesComerciais";
import CustoInterno from "./CustoInterno";

interface PropostaTabsProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
  clientes: ClienteSimplificado[];
  produtosAcabados: ProdutoAcabado[];
  gerarNumeroProposta: () => string;
  handleClienteChange: (clienteId: number) => void;
  clienteDesabilitado?: boolean;
}

const PropostaTabs = ({ 
  proposta, 
  setProposta, 
  clientes, 
  produtosAcabados, 
  gerarNumeroProposta,
  handleClienteChange,
  clienteDesabilitado = false
}: PropostaTabsProps) => {
  return (
    <Tabs defaultValue="informacoes" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="informacoes">Informações</TabsTrigger>
        <TabsTrigger value="itens">Itens e Valores</TabsTrigger>
        <TabsTrigger value="condicoes">Condições</TabsTrigger>
        <TabsTrigger value="custos">Custos Internos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="informacoes">
        <InformacoesGerais 
          proposta={proposta}
          setProposta={setProposta}
          clientes={clientes}
          gerarNumeroProposta={gerarNumeroProposta}
          handleClienteChange={handleClienteChange}
          clienteDesabilitado={clienteDesabilitado}
        />
      </TabsContent>
      
      <TabsContent value="itens">
        <ItemProduto 
          proposta={proposta}
          setProposta={setProposta}
          produtosAcabados={produtosAcabados}
        />
      </TabsContent>
      
      <TabsContent value="condicoes">
        <CondicoesComerciais 
          proposta={proposta}
          setProposta={setProposta}
        />
      </TabsContent>
      
      <TabsContent value="custos">
        <CustoInterno 
          proposta={proposta}
          setProposta={setProposta}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropostaTabs;
