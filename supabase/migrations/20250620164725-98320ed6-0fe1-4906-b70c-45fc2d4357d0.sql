
-- Criar tabela para clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  empresa TEXT,
  cnpj TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar enum para status das propostas
CREATE TYPE public.proposta_status AS ENUM ('rascunho', 'enviada', 'aprovada', 'rejeitada', 'expirada');

-- Criar tabela para propostas
CREATE TABLE public.propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL UNIQUE,
  data DATE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  status public.proposta_status NOT NULL DEFAULT 'rascunho',
  observacoes TEXT,
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  forma_pagamento TEXT,
  prazo_entrega TEXT,
  prazo_obra TEXT,
  validade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para itens das propostas
CREATE TABLE public.proposta_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id UUID REFERENCES public.propostas(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  unidade TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  valor_original DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para custos das propostas
CREATE TABLE public.proposta_custos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id UUID REFERENCES public.propostas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  diluido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposta_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposta_custos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitindo acesso completo por enquanto, pode ser refinado posteriormente)
CREATE POLICY "Allow all operations on clientes" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Allow all operations on propostas" ON public.propostas FOR ALL USING (true);
CREATE POLICY "Allow all operations on proposta_itens" ON public.proposta_itens FOR ALL USING (true);
CREATE POLICY "Allow all operations on proposta_custos" ON public.proposta_custos FOR ALL USING (true);

-- Criar índices para melhor performance
CREATE INDEX idx_propostas_cliente_id ON public.propostas(cliente_id);
CREATE INDEX idx_propostas_status ON public.propostas(status);
CREATE INDEX idx_proposta_itens_proposta_id ON public.proposta_itens(proposta_id);
CREATE INDEX idx_proposta_custos_proposta_id ON public.proposta_custos(proposta_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at BEFORE UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
