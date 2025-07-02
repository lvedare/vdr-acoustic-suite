
-- Adicionar campos de endereço completo e inscrição estadual na tabela clientes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco_rua TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco_numero TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco_bairro TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco_cidade TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco_estado TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS endereco_cep TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS inscricao_estadual TEXT;

-- Adicionar campos de endereço de entrega/obra na tabela atendimentos
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS endereco_entrega TEXT;
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS endereco_obra TEXT;
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS usar_endereco_cliente BOOLEAN DEFAULT true;
