
export const createTestData = {
  insumo: () => ({
    codigo: `INS-${Date.now()}`,
    nome: "Espuma Acústica Teste",
    categoria: "Isolamento",
    unidade_medida: "m²",
    valor_custo: 25.50,
    quantidade_estoque: 100,
    fornecedor: "Fornecedor Teste",
    data_cadastro: new Date().toISOString().split('T')[0],
    pode_ser_revendido: true,
    descricao: "Espuma acústica para teste"
  }),

  produto: () => ({
    codigo: `PROD-${Date.now()}`,
    nome: "Painel Acústico Teste",
    categoria: "Painéis",
    unidade_medida: "un",
    valor_base: 150.00,
    quantidade_estoque: 50,
    data_cadastro: new Date().toISOString().split('T')[0],
    descricao: "Painel acústico para teste"
  }),

  projeto: (clienteId: string | null) => ({
    nome: `Projeto Teste ${Date.now()}`,
    tipo: "Tratamento Acústico",
    status: "planejamento" as const,
    cliente_id: clienteId,
    data_inicio: null,
    data_previsao: null,
    data_conclusao: null,
    observacoes: "Projeto criado para teste"
  }),

  obra: (clienteId: string | null, projetoId: string | null) => ({
    nome: `Obra Teste ${Date.now()}`,
    endereco: "Rua Teste, 123 - São Paulo/SP",
    status: "planejamento" as const,
    cliente_id: clienteId,
    projeto_id: projetoId,
    data_inicio: null,
    data_previsao: null,
    data_conclusao: null,
    observacoes: "Obra criada para teste"
  })
};
