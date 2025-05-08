
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Save, ChevronLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Import types
import { 
  ClienteSimplificado,
  ProdutoAcabado, 
  Proposta
} from "@/types/orcamento";

// Import components
import InformacoesGerais from "@/components/proposta/InformacoesGerais";
import ItemProduto from "@/components/proposta/ItemProduto";
import CustoInterno from "@/components/proposta/CustoInterno";
import CondicoesComerciais from "@/components/proposta/CondicoesComerciais";

// Import utilities
import { gerarNumeroProposta, getPropostaVazia } from "@/utils/propostaUtils";

const NovoOrcamento = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteSimplificado[]>([]);
  const [proposta, setProposta] = useState<Proposta>(getPropostaVazia());
  const [produtosAcabados, setProdutosAcabados] = useState<ProdutoAcabado[]>([]);

  // Carregar clientes e produtos do localStorage
  useEffect(() => {
    const savedClientes = localStorage.getItem("clientes");
    if (savedClientes) {
      setClientes(JSON.parse(savedClientes));
    }

    const savedProdutos = localStorage.getItem("produtosAcabados");
    if (savedProdutos) {
      setProdutosAcabados(JSON.parse(savedProdutos));
    }
  }, []);
  
  // Calcular o valor total quando os itens mudarem
  useEffect(() => {
    const totalItens = proposta.itens.reduce((acc, item) => acc + item.valorTotal, 0);
    setProposta(prev => ({
      ...prev,
      valorTotal: totalItens
    }));
  }, [proposta.itens]);
  
  // Handler para selecionar cliente
  const handleClienteChange = (clienteId: number) => {
    const clienteSelecionado = clientes.find(c => c.id === clienteId);
    if (clienteSelecionado) {
      setProposta(prev => ({
        ...prev,
        cliente: clienteSelecionado
      }));
    }
  };
  
  // Handler para salvar a proposta
  const handleSalvarProposta = () => {
    // Validar se há itens na proposta
    if (proposta.itens.length === 0) {
      toast.error("Adicione pelo menos um item à proposta");
      return;
    }
    
    // Validar se cliente foi selecionado
    if (!proposta.cliente.id) {
      toast.error("Selecione um cliente para a proposta");
      return;
    }
    
    // Recuperar propostas existentes
    const propostasExistentes = JSON.parse(localStorage.getItem("propostas") || "[]");
    
    // Adicionar nova proposta
    const novasPropostas = [...propostasExistentes, proposta];
    
    // Salvar no localStorage
    localStorage.setItem("propostas", JSON.stringify(novasPropostas));
    
    toast.success("Proposta salva com sucesso!");
    
    // Redirecionar para a página de listagem de propostas
    navigate("/orcamentos");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/orcamentos")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Nova Proposta</h1>
        </div>
        <Button onClick={handleSalvarProposta}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Proposta
        </Button>
      </div>
      
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
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/orcamentos")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button onClick={handleSalvarProposta}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Proposta
        </Button>
      </div>
    </div>
  );
};

export default NovoOrcamento;
