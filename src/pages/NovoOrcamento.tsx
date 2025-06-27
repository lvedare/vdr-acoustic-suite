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
import { useClientes } from "@/hooks/useClientes";
import { useProdutosAcabados } from "@/hooks/useProdutosAcabados";

const NovoOrcamento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { atualizarProposta, criarProposta, isCriando, isAtualizando } = usePropostas();
  
  // Hooks para dados do Supabase
  const { clientes, isLoading: loadingClientes } = useClientes();
  const { produtos: produtosAcabados, isLoading: loadingProdutos } = useProdutosAcabados();
  
  const [proposta, setProposta] = useState<Proposta>(getPropostaVazia());
  const [isRevision, setIsRevision] = useState(false);
  const [originalPropostaId, setOriginalPropostaId] = useState<number | null>(null);
  const [title, setTitle] = useState("Nova Proposta");
  const [isEdit, setIsEdit] = useState(false);
  const [clientePreSelecionado, setClientePreSelecionado] = useState(false);

  // Verificar se estamos carregando uma proposta existente para edição ou revisão
  useEffect(() => {
    if (location.state) {
      const { 
        propostaId, 
        isEdit: editMode, 
        isRevisao, 
        propostaOriginal, 
        propostaOriginalId, 
        atendimento,
        clientePreSelecionado: clientePre
      } = location.state;

      // Carregar proposta existente para edição
      if (propostaId && editMode) {
        setIsEdit(true);
        setTitle("Editar Proposta");
      }
      
      // Carregar dados para revisão
      else if (propostaOriginal && isRevisao) {
        const revisaoProposta: Proposta = {
          ...propostaOriginal,
          id: Date.now(),
          numero: `${propostaOriginal.numero}-REV${new Date().toISOString().slice(0,10)}`,
          data: new Date().toISOString().split('T')[0],
          status: "rascunho",
        };
        
        setProposta(revisaoProposta);
        setTitle("Revisão de Proposta");
        setIsRevision(true);
        setOriginalPropostaId(propostaOriginalId);
      }
      
      // Verificar se há um atendimento pré-selecionado
      else if (atendimento) {
        setClientePreSelecionado(true);
        
        // Criar cliente mockado baseado nos dados do atendimento
        const clienteMockado: ClienteSimplificado = {
          id: atendimento.clienteId || Date.now(),
          nome: atendimento.cliente,
          email: atendimento.contato.includes('@') ? atendimento.contato : '',
          telefone: atendimento.contato.includes('(') ? atendimento.contato : '',
          empresa: atendimento.cliente.includes('Empresa') ? atendimento.cliente : '',
          cnpj: ''
        };
        
        setProposta(prev => ({
          ...prev,
          cliente: clienteMockado,
          observacoes: `Atendimento: ${atendimento.assunto}\n\nDetalhes: ${atendimento.mensagem || ''}\n\nCanal: ${atendimento.canal}\n\n${prev.observacoes}`
        }));
        
        setTitle(`Nova Proposta - ${atendimento.cliente}`);
        toast.success(`Dados do atendimento carregados automaticamente`);
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
  
  // Handler para selecionar cliente - só funciona se não há cliente pré-selecionado
  const handleClienteChange = (clienteId: number) => {
    if (clientePreSelecionado) {
      toast.info("Cliente já foi selecionado do atendimento");
      return;
    }
    
    // Buscar o cliente usando o ID numérico convertido
    const clienteSelecionado = clientes.find(c => {
      // Converter UUID para número da mesma forma que fazemos na formatação
      let numericId = 0;
      if (c.id) {
        const str = c.id.toString();
        for (let i = 0; i < str.length; i++) {
          numericId = ((numericId << 5) - numericId + str.charCodeAt(i)) & 0xffffffff;
        }
        numericId = Math.abs(numericId);
      }
      return numericId === clienteId;
    });
    
    if (clienteSelecionado) {
      // Converter para o formato esperado pela proposta
      const clienteFormatado: ClienteSimplificado = {
        id: clienteId, // Usar o ID numérico já convertido
        nome: clienteSelecionado.nome,
        email: clienteSelecionado.email || '',
        telefone: clienteSelecionado.telefone || '',
        empresa: clienteSelecionado.empresa || '',
        cnpj: clienteSelecionado.cnpj || ''
      };
      
      setProposta(prev => ({
        ...prev,
        cliente: clienteFormatado
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
  
  // Mostrar loading enquanto carrega dados
  if (loadingClientes || loadingProdutos) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PropostaHeader 
            title="Carregando..."
            onBack={handleCancelar} 
          />
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-lg font-medium text-muted-foreground">
              Carregando dados do sistema...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Converter produtos do Supabase para o formato esperado
  const produtosFormatados: ProdutoAcabado[] = produtosAcabados.map(produto => {
    let numericId = 0;
    if (produto.id) {
      const str = produto.id.toString();
      for (let i = 0; i < str.length; i++) {
        numericId = ((numericId << 5) - numericId + str.charCodeAt(i)) & 0xffffffff;
      }
      numericId = Math.abs(numericId);
    }
    
    return {
      id: numericId,
      codigo: produto.codigo || `COD-${numericId}`,
      nome: produto.nome || "Produto sem nome",
      descricao: produto.descricao || "",
      categoria: produto.categoria || "Sem categoria",
      unidadeMedida: produto.unidade_medida || "un",
      valorBase: Number(produto.valor_base) || 0,
      quantidadeEstoque: produto.quantidade_estoque || 0,
      dataCadastro: produto.data_cadastro || new Date().toISOString().split('T')[0]
    };
  });

  // Converter clientes do Supabase para o formato esperado
  const clientesFormatados: ClienteSimplificado[] = clientes.map(cliente => {
    // Gerar ID numérico baseado no hash do UUID
    let numericId = 0;
    if (cliente.id) {
      const str = cliente.id.toString();
      for (let i = 0; i < str.length; i++) {
        numericId = ((numericId << 5) - numericId + str.charCodeAt(i)) & 0xffffffff;
      }
      numericId = Math.abs(numericId);
    }
    
    return {
      id: numericId,
      nome: cliente.nome,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      empresa: cliente.empresa || '',
      cnpj: cliente.cnpj || ''
    };
  });
  
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
        clientes={clientesFormatados}
        produtosAcabados={produtosFormatados}
        gerarNumeroProposta={gerarNumeroProposta}
        handleClienteChange={handleClienteChange}
        clienteDesabilitado={clientePreSelecionado}
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
      
      {clientePreSelecionado && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
          <p className="text-blue-800 text-sm">
            Cliente carregado automaticamente do atendimento. Os dados podem ser ajustados se necessário.
          </p>
        </div>
      )}
    </div>
  );
};

export default NovoOrcamento;
