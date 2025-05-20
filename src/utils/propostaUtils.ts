
// Utility functions for proposals

// Gerar um novo número de proposta
export const gerarNumeroProposta = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000);
  return `VDR27.3.${year}${month}${day}.${random}RO`;
};

// Obter modelo de proposta vazia
export const getPropostaVazia = () => {
  return {
    id: Date.now(),
    numero: gerarNumeroProposta(),
    data: new Date().toISOString().split('T')[0],
    cliente: {
      id: 0,
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      cnpj: ""
    },
    status: "rascunho" as const,
    itens: [],
    custos: [],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 0,
    formaPagamento: "50% DE ENTRADA E 50% NO FINAL",
    prazoEntrega: "15 DIAS",
    prazoObra: "10 DIAS",
    validade: "05 DIAS"
  };
};

// Converter atendimento para proposta
export const converterAtendimentoParaProposta = (atendimento: any) => {
  const propostaBase = getPropostaVazia();
  
  // Se o atendimento tiver um cliente associado, procurar no localStorage
  if (atendimento.clienteId) {
    const clientesString = localStorage.getItem("clientes");
    if (clientesString) {
      const clientes = JSON.parse(clientesString);
      const clienteSelecionado = clientes.find((c: any) => c.id === atendimento.clienteId);
      
      if (clienteSelecionado) {
        propostaBase.cliente = clienteSelecionado;
      }
    }
  }
  
  // Se não encontrou o cliente pelo ID, mas tem nome de cliente no atendimento
  if (!propostaBase.cliente.id && atendimento.cliente) {
    propostaBase.cliente = {
      ...propostaBase.cliente,
      nome: atendimento.cliente,
      telefone: atendimento.contato || "",
    };
  }
  
  // Adicionar assunto/mensagem do atendimento como observação
  if (atendimento.mensagem || atendimento.assunto) {
    const assuntoMensagem = atendimento.mensagem || atendimento.assunto;
    propostaBase.observacoes = `Atendimento #${atendimento.id} - ${assuntoMensagem}\n\n` + propostaBase.observacoes;
  }
  
  return propostaBase;
};

// Formatação de data para exibição
export const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};
