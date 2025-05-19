
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
  
  // Se o atendimento tiver um cliente associado, usá-lo
  if (atendimento.cliente) {
    propostaBase.cliente = atendimento.cliente;
  }
  
  // Adicionar observação sobre a origem da proposta
  propostaBase.observacoes = `Proposta gerada a partir do atendimento #${atendimento.id} em ${new Date().toLocaleDateString()}\n\n` + propostaBase.observacoes;
  
  return propostaBase;
};

// Formatação de data para exibição
export const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

