
-- Criar tabela de atendimentos para integrar com Supabase
CREATE TABLE public.atendimentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES public.clientes(id),
  cliente_nome text NOT NULL,
  contato text NOT NULL,
  assunto text NOT NULL,
  mensagem text,
  data date NOT NULL DEFAULT CURRENT_DATE,
  hora time NOT NULL DEFAULT CURRENT_TIME,
  canal text NOT NULL DEFAULT 'WhatsApp',
  status text NOT NULL DEFAULT 'Novo',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS para atendimentos
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (sistema interno)
CREATE POLICY "Allow all operations on atendimentos" ON public.atendimentos
  FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de histórico de atendimentos
CREATE TABLE public.historico_atendimentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  atendimento_id uuid REFERENCES public.atendimentos(id) ON DELETE CASCADE,
  acao text NOT NULL,
  descricao text,
  usuario text,
  data_acao timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS para histórico
ALTER TABLE public.historico_atendimentos ENABLE ROW LEVEL SECURITY;

-- Política para histórico
CREATE POLICY "Allow all operations on historico_atendimentos" ON public.historico_atendimentos
  FOR ALL USING (true) WITH CHECK (true);

-- Criar tabela de ligações registradas
CREATE TABLE public.ligacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES public.clientes(id),
  cliente_nome text NOT NULL,
  telefone text NOT NULL,
  duracao text,
  resumo text,
  observacoes text,
  data_ligacao timestamp with time zone NOT NULL DEFAULT now(),
  usuario text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS para ligações
ALTER TABLE public.ligacoes ENABLE ROW LEVEL SECURITY;

-- Política para ligações
CREATE POLICY "Allow all operations on ligacoes" ON public.ligacoes
  FOR ALL USING (true) WITH CHECK (true);

-- Adicionar triggers para updated_at
CREATE TRIGGER update_atendimentos_updated_at
  BEFORE UPDATE ON public.atendimentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para performance
CREATE INDEX idx_atendimentos_status ON public.atendimentos(status);
CREATE INDEX idx_atendimentos_data ON public.atendimentos(data);
CREATE INDEX idx_atendimentos_cliente_id ON public.atendimentos(cliente_id);
CREATE INDEX idx_historico_atendimento_id ON public.historico_atendimentos(atendimento_id);
CREATE INDEX idx_ligacoes_cliente_id ON public.ligacoes(cliente_id);
CREATE INDEX idx_ligacoes_data ON public.ligacoes(data_ligacao);

-- Adicionar campos faltantes na tabela de propostas para melhor integração
ALTER TABLE public.propostas 
ADD COLUMN IF NOT EXISTS atendimento_id uuid REFERENCES public.atendimentos(id),
ADD COLUMN IF NOT EXISTS origem text DEFAULT 'manual';

-- Criar tabela de cronograma
CREATE TABLE public.cronograma (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  descricao text,
  data_inicio date NOT NULL,
  data_fim date NOT NULL,
  status text NOT NULL DEFAULT 'planejado',
  prioridade text NOT NULL DEFAULT 'media',
  responsavel text,
  cliente_id uuid REFERENCES public.clientes(id),
  proposta_id uuid REFERENCES public.propostas(id),
  obra_id uuid REFERENCES public.obras(id),
  cor text DEFAULT '#3B82F6',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS para cronograma
ALTER TABLE public.cronograma ENABLE ROW LEVEL SECURITY;

-- Política para cronograma
CREATE POLICY "Allow all operations on cronograma" ON public.cronograma
  FOR ALL USING (true) WITH CHECK (true);

-- Trigger para updated_at do cronograma
CREATE TRIGGER update_cronograma_updated_at
  BEFORE UPDATE ON public.cronograma
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para cronograma
CREATE INDEX idx_cronograma_data_inicio ON public.cronograma(data_inicio);
CREATE INDEX idx_cronograma_data_fim ON public.cronograma(data_fim);
CREATE INDEX idx_cronograma_status ON public.cronograma(status);
CREATE INDEX idx_cronograma_cliente_id ON public.cronograma(cliente_id);

-- Criar tabela de financeiro
CREATE TABLE public.financeiro (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo text NOT NULL, -- 'receita' ou 'despesa'
  categoria text NOT NULL,
  descricao text NOT NULL,
  valor numeric NOT NULL,
  data_vencimento date NOT NULL,
  data_pagamento date,
  status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'vencido'
  forma_pagamento text,
  cliente_id uuid REFERENCES public.clientes(id),
  proposta_id uuid REFERENCES public.propostas(id),
  obra_id uuid REFERENCES public.obras(id),
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS para financeiro
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- Política para financeiro
CREATE POLICY "Allow all operations on financeiro" ON public.financeiro
  FOR ALL USING (true) WITH CHECK (true);

-- Trigger para updated_at do financeiro
CREATE TRIGGER update_financeiro_updated_at
  BEFORE UPDATE ON public.financeiro
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para financeiro
CREATE INDEX idx_financeiro_tipo ON public.financeiro(tipo);
CREATE INDEX idx_financeiro_status ON public.financeiro(status);
CREATE INDEX idx_financeiro_data_vencimento ON public.financeiro(data_vencimento);
CREATE INDEX idx_financeiro_cliente_id ON public.financeiro(cliente_id);
