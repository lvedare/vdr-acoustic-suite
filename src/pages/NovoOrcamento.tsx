
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

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

// Import utilities and hooks
import { gerarNumeroProposta, getPropostaVazia } from "@/utils/propostaUtils";
import { usePropostas } from "@/hooks/usePropostas";

const NovoOrcamento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientes, atualizarProposta, criarProposta, isCriando, isAtualizando } = usePropostas();
  const [proposta, setProposta] = useState<Proposta>(getPropostaVazia());
  const [produtosAcabados, setProdutosAcabados] = useState<ProdutoAcabado[]>([]);
  const [isRevision, setIsRevision] = useState(false);
  const [originalPropostaId, setOriginalPropostaId] = useState<number | null>(null);
  const [title, setTitle] = useState("Nova Proposta");
  const [isEdit, setIsEdit] = useState(false);

  // Carregar produtos do localStorage
  useEffect(() => {
    const savedProdutos = localStorage.getItem("produtosAcabados");
    if (savedProdutos) {
      setProdutosAcabados(JSON.parse(savedProdutos));
    }

    // Verificar se estamos carregando uma proposta existente para edição ou revisão
    if (location.state) {
      const { propostaId, isEdit: editMode, isRevisao, propostaOriginal, propostaOriginalId, clienteId, atendimento } = location.state;

      // Carregar proposta existente para edição
      if (propostaId && editMode) {
        // Buscar proposta nas propostas carregadas pelo hook
        setIsEdit(true);
        setTitle("Editar Proposta");
      }
      
      // Carregar dados para revisão
      else if (propostaOriginal && isRevisao) {
        const revisaoProposta: Proposta = {
          ...propostaOriginal,
          id: Date.now(), // Novo ID para a revisão
          numero: `${propostaOriginal.numero}-REV${new Date().toISOString().slice(0,10)}`, // Adiciona REV ao número
          data: new Date().toISOString().split('T')[0], // Data atual
          status: "rascunho", // Inicia como rascunho
        };
        
        setProposta(revisaoProposta);
        setTitle("Revisão de Proposta");
        setIsRevision(true);
        setOriginalPropostaId(propostaOriginalId);
      }
      
      // Verificar se há um cliente pré-selecionado da página de atendimento
      else if (clienteId) {
        const clienteSelecionado = clientes.find(c => c.id === clienteId);
        
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
  }, [location.state, clientes]);
  
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
  const handleSalvarProposta = async () => {
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
    
    try {
      if (isEdit) {
        // Atualizar proposta existente
        await atualizarProposta({ id: proposta.id, proposta });
      } else {
        // Criar nova proposta (incluindo revisões)
        await criarProposta(proposta);
      }
      
      // Redirecionar para a página de listagem de propostas
      navigate("/orcamentos");
      
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      toast.error("Erro ao salvar proposta");
    }
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
        <PropostaSaveButton 
          onClick={handleSalvarProposta} 
          isLoading={isCriando || isAtualizando}
        />
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
        isLoading={isCriando || isAtualizando}
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
