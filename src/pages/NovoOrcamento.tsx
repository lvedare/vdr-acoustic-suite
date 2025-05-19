
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

// Import types
import { 
  ClienteSimplificado,
  ProdutoAcabado, 
  Proposta
} from "@/types/orcamento";

// Import components
import PropostaTabs from "@/components/proposta/PropostaTabs";
import PropostaHeader from "@/components/proposta/PropostaHeader";
import PropostaSaveButton from "@/components/proposta/PropostaSaveButton";
import PropostaActions from "@/components/proposta/PropostaActions";

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

  const handleCancelar = () => {
    navigate("/orcamentos");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PropostaHeader 
          title="Nova Proposta" 
          onBack={handleCancelar} 
        />
        <PropostaSaveButton onClick={handleSalvarProposta} />
      </div>
      
      <PropostaTabs 
        proposta={proposta}
        setProposta={setProposta}
        clientes={clientes}
        produtosAcabados={produtosAcabados}
        gerarNumeroProposta={gerarNumeroProposta}
        handleClienteChange={handleClienteChange}
      />
      
      <PropostaActions 
        onSave={handleSalvarProposta} 
        onCancel={handleCancelar} 
      />
    </div>
  );
};

export default NovoOrcamento;
