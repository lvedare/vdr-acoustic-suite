
-- Primeiro, vamos corrigir e padronizar as tabelas existentes

-- Atualizar códigos de produtos para seguir padrão PA001, PA002, etc.
UPDATE produtos_acabados 
SET codigo = 'PA' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 3, '0')
WHERE codigo NOT LIKE 'PA%';

-- Criar tabela de fornecedores
CREATE TABLE IF NOT EXISTS public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  categoria TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar campos necessários na tabela insumos
ALTER TABLE public.insumos 
ADD COLUMN IF NOT EXISTS ncm TEXT,
ADD COLUMN IF NOT EXISTS custo_medio NUMERIC DEFAULT 0;

-- Criar tabela para relacionar fornecedores com insumos (múltiplos fornecedores por insumo)
CREATE TABLE IF NOT EXISTS public.insumo_fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insumo_id UUID REFERENCES public.insumos(id) ON DELETE CASCADE,
  fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  preco_unitario NUMERIC NOT NULL DEFAULT 0,
  prazo_entrega INTEGER, -- em dias
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(insumo_id, fornecedor_id)
);

-- Criar tabela para controle de movimentações de estoque mais detalhada
CREATE TABLE IF NOT EXISTS public.movimentacoes_estoque_detalhada (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_documento TEXT, -- número da nota fiscal, etc.
  tipo_documento TEXT, -- 'nota_fiscal_entrada', 'nota_fiscal_saida', 'ajuste_inventario', etc.
  data_documento DATE,
  fornecedor_id UUID REFERENCES public.fornecedores(id),
  valor_total NUMERIC DEFAULT 0,
  observacoes TEXT,
  aprovado BOOLEAN DEFAULT false,
  aprovado_por TEXT,
  aprovado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para itens das movimentações detalhadas
CREATE TABLE IF NOT EXISTS public.movimentacao_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movimentacao_id UUID REFERENCES public.movimentacoes_estoque_detalhada(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES public.produtos_acabados(id),
  insumo_id UUID REFERENCES public.insumos(id),
  quantidade NUMERIC NOT NULL,
  valor_unitario NUMERIC DEFAULT 0,
  valor_total NUMERIC DEFAULT 0,
  atualizar_preco BOOLEAN DEFAULT false, -- se deve atualizar o preço do produto/insumo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Atualizar categorias de produtos e insumos para as corretas
UPDATE produtos_acabados 
SET categoria = CASE 
  WHEN categoria = 'Móveis' THEN 'Painéis Acústico de Madeira'
  WHEN categoria = 'Eletrônicos' THEN 'Atenuador de Ruído'
  WHEN categoria = 'Casa' THEN 'Forro de Isolamento'
  ELSE 'Forro de Isolamento'
END;

UPDATE insumos 
SET categoria = CASE 
  WHEN categoria = 'Madeira' THEN 'Forro de Isolamento'
  WHEN categoria = 'Metal' THEN 'Porta Acústica Metálica'
  WHEN categoria = 'Tecido' THEN 'Painéis Acústico de Tecido'
  WHEN categoria = 'Fixação' THEN 'Forro de Isolamento'
  WHEN categoria = 'Químico' THEN 'Revestimento de Espuma'
  WHEN categoria = 'Elétrico' THEN 'Atenuador de Ruído'
  WHEN categoria = 'Vidro' THEN 'Divisória Acústica'
  WHEN categoria = 'Plástico' THEN 'Revestimento de Espuma'
  ELSE 'Forro de Isolamento'
END;

-- Habilitar RLS para as novas tabelas
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insumo_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_estoque_detalhada ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacao_itens ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS permissivas para todas as operações
CREATE POLICY "Allow all operations on fornecedores" ON public.fornecedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on insumo_fornecedores" ON public.insumo_fornecedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on movimentacoes_estoque_detalhada" ON public.movimentacoes_estoque_detalhada FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on movimentacao_itens" ON public.movimentacao_itens FOR ALL USING (true) WITH CHECK (true);

-- Criar função para calcular custo médio de insumos
CREATE OR REPLACE FUNCTION calcular_custo_medio_insumo(insumo_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    custo_medio NUMERIC;
BEGIN
    SELECT AVG(preco_unitario) INTO custo_medio
    FROM insumo_fornecedores
    WHERE insumo_id = insumo_uuid AND ativo = true;
    
    IF custo_medio IS NULL THEN
        custo_medio := 0;
    END IF;
    
    UPDATE insumos SET custo_medio = custo_medio WHERE id = insumo_uuid;
    
    RETURN custo_medio;
END;
$$ LANGUAGE plpgsql;

-- Criar função para gerar próximo código de produto
CREATE OR REPLACE FUNCTION gerar_proximo_codigo_produto()
RETURNS TEXT AS $$
DECLARE
    ultimo_numero INTEGER;
    proximo_codigo TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 3) AS INTEGER)), 0) INTO ultimo_numero
    FROM produtos_acabados
    WHERE codigo ~ '^PA[0-9]+$';
    
    proximo_codigo := 'PA' || LPAD((ultimo_numero + 1)::text, 3, '0');
    
    RETURN proximo_codigo;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar custo médio quando fornecedor é alterado
CREATE OR REPLACE FUNCTION trigger_atualizar_custo_medio()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calcular_custo_medio_insumo(NEW.insumo_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_custo_medio_insert
    AFTER INSERT ON insumo_fornecedores
    FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_custo_medio();

CREATE TRIGGER trigger_custo_medio_update
    AFTER UPDATE ON insumo_fornecedores
    FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_custo_medio();

CREATE TRIGGER trigger_custo_medio_delete
    AFTER DELETE ON insumo_fornecedores
    FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_custo_meio();
