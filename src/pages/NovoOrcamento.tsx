
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [clientes, setClientes] = useState<ClienteSimplificado[]>([]);
  const [proposta, setProposta] = useState<Proposta>(getPropostaVazia());
  const [produtosAcabados, setProdutosAcabados] = useState<ProdutoAcabado[]>([]);
  const [isRevision, setIsRevision] = useState(false);
  const [originalPropostaId, setOriginalPropostaId] = useState<number | null>(null);
  const [title, setTitle] = useState("Nova Proposta");

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

    // Verificar se estamos carregando uma proposta existente para edição ou revisão
    if (location.state) {
      const { propostaId, isEdit, isRevisao, propostaOriginalId, clienteId, atendimento } = location.state;

      // Carregar proposta existente para edição
      if (propostaId) {
        const propostasExistentes = JSON.parse(localStorage.getItem("propostas") || "[]");
        const propostaExistente = propostasExistentes.find((p: Proposta) => p.id === propostaId);
        
        if (propostaExistente) {
          setProposta(propostaExistente);
          
          if (isEdit) {
            setTitle("Editar Proposta");
          }
          
          if (isRevisao) {
            setTitle("Revisão de Proposta");
            setIsRevision(true);
            setOriginalPropostaId(propostaOriginalId);
          }
        }
      }
      
      // Verificar se há um cliente pré-selecionado da página de atendimento
      else if (clienteId) {
        const clienteSelecionado = JSON.parse(savedClientes || '[]')
          .find((c: ClienteSimplificado) => c.id === clienteId);
        
        if (clienteSelecionado) {
          setProposta(prev => ({
            ...prev,
            cliente: clienteSelecionado
          }));
          
          // Verificar se temos dados do atendimento para preencher a proposta
          if (atendimento) {
            setTitle(`Nova Proposta (Atendimento #${atendimento.id})`);
            
            // Adicionar observações do atendimento
            if (atendimento.mensagem) {
              setProposta(prev => ({
                ...prev,
                observacoes: `Atendimento: ${atendimento.mensagem}\n\n${prev.observacoes}`
              }));
            }
            
            toast.info(`Cliente ${clienteSelecionado.nome} selecionado do atendimento`);
          } else {
            toast.info(`Cliente ${clienteSelecionado.nome} selecionado`);
          }
        }
      }
    }
  }, [location.state]);
  
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
    
    // Se estamos editando, atualizamos a proposta existente
    if (location.state?.isEdit) {
      const novasPropostas = propostasExistentes.map((p: Proposta) => 
        p.id === proposta.id ? proposta : p
      );
      localStorage.setItem("propostas", JSON.stringify(novasPropostas));
      toast.success("Proposta atualizada com sucesso!");
    } 
    // Caso contrário, adicionamos como nova (incluindo revisões)
    else {
      const novasPropostas = [...propostasExistentes, proposta];
      localStorage.setItem("propostas", JSON.stringify(novasPropostas));
      
      if (isRevision) {
        toast.success("Revisão de proposta salva com sucesso!");
      } else {
        toast.success("Proposta criada com sucesso!");
      }
    }
    
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
          title={title}
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
      
      {isRevision && originalPropostaId && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
          <p className="text-amber-800 text-sm">
            Esta é uma revisão da proposta original. A proposta original será mantida para referência.
          </p>
        </div>
      )}
    </div>
  );
};

export default NovoOrcamento;
