
-- Create table for insumos (raw materials/inputs)
CREATE TABLE public.insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  unidade_medida TEXT NOT NULL,
  valor_custo DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantidade_estoque INTEGER NOT NULL DEFAULT 0,
  fornecedor TEXT,
  data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
  pode_ser_revendido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for produtos_acabados (finished products)
CREATE TABLE public.produtos_acabados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  unidade_medida TEXT NOT NULL,
  valor_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantidade_estoque INTEGER NOT NULL DEFAULT 0,
  data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for composicao_produtos (product composition)
CREATE TABLE public.composicao_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES public.produtos_acabados(id) ON DELETE CASCADE,
  insumo_id UUID REFERENCES public.insumos(id) ON DELETE CASCADE,
  quantidade DECIMAL(10,3) NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enum for project status
CREATE TYPE public.projeto_status AS ENUM ('planejamento', 'em_andamento', 'concluido', 'cancelado');

-- Create table for projetos (projects)
CREATE TABLE public.projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  status public.projeto_status NOT NULL DEFAULT 'planejamento',
  tipo TEXT NOT NULL,
  data_inicio DATE,
  data_previsao DATE,
  data_conclusao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enum for obra status
CREATE TYPE public.obra_status AS ENUM ('planejamento', 'em_andamento', 'concluido', 'cancelado');

-- Create table for obras (construction works)
CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  endereco TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
  status public.obra_status NOT NULL DEFAULT 'planejamento',
  data_inicio DATE,
  data_previsao DATE,
  data_conclusao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enum for producao status
CREATE TYPE public.producao_status AS ENUM ('pendente', 'em_andamento', 'concluido', 'cancelado');

-- Create table for ordens_producao (production orders)
CREATE TABLE public.ordens_producao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL UNIQUE,
  produto_id UUID REFERENCES public.produtos_acabados(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL,
  status public.producao_status NOT NULL DEFAULT 'pendente',
  data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
  data_previsao DATE,
  data_conclusao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for movimentacoes_estoque (inventory movements)
CREATE TABLE public.movimentacoes_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL, -- 'entrada', 'saida', 'ajuste'
  insumo_id UUID REFERENCES public.insumos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES public.produtos_acabados(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  usuario TEXT,
  data_movimentacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for vendas_produtos (product sales)
CREATE TABLE public.vendas_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES public.produtos_acabados(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  quantidade INTEGER NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  data_venda DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_acabados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.composicao_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_produtos ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now, can be refined later)
CREATE POLICY "Allow all operations on insumos" ON public.insumos FOR ALL USING (true);
CREATE POLICY "Allow all operations on produtos_acabados" ON public.produtos_acabados FOR ALL USING (true);
CREATE POLICY "Allow all operations on composicao_produtos" ON public.composicao_produtos FOR ALL USING (true);
CREATE POLICY "Allow all operations on projetos" ON public.projetos FOR ALL USING (true);
CREATE POLICY "Allow all operations on obras" ON public.obras FOR ALL USING (true);
CREATE POLICY "Allow all operations on ordens_producao" ON public.ordens_producao FOR ALL USING (true);
CREATE POLICY "Allow all operations on movimentacoes_estoque" ON public.movimentacoes_estoque FOR ALL USING (true);
CREATE POLICY "Allow all operations on vendas_produtos" ON public.vendas_produtos FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_insumos_categoria ON public.insumos(categoria);
CREATE INDEX idx_insumos_codigo ON public.insumos(codigo);
CREATE INDEX idx_produtos_acabados_categoria ON public.produtos_acabados(categoria);
CREATE INDEX idx_produtos_acabados_codigo ON public.produtos_acabados(codigo);
CREATE INDEX idx_composicao_produtos_produto_id ON public.composicao_produtos(produto_id);
CREATE INDEX idx_composicao_produtos_insumo_id ON public.composicao_produtos(insumo_id);
CREATE INDEX idx_projetos_cliente_id ON public.projetos(cliente_id);
CREATE INDEX idx_projetos_status ON public.projetos(status);
CREATE INDEX idx_obras_cliente_id ON public.obras(cliente_id);
CREATE INDEX idx_obras_projeto_id ON public.obras(projeto_id);
CREATE INDEX idx_obras_status ON public.obras(status);
CREATE INDEX idx_ordens_producao_produto_id ON public.ordens_producao(produto_id);
CREATE INDEX idx_ordens_producao_status ON public.ordens_producao(status);
CREATE INDEX idx_movimentacoes_estoque_insumo_id ON public.movimentacoes_estoque(insumo_id);
CREATE INDEX idx_movimentacoes_estoque_produto_id ON public.movimentacoes_estoque(produto_id);
CREATE INDEX idx_vendas_produtos_produto_id ON public.vendas_produtos(produto_id);
CREATE INDEX idx_vendas_produtos_cliente_id ON public.vendas_produtos(cliente_id);

-- Create triggers for updated_at
CREATE TRIGGER update_insumos_updated_at BEFORE UPDATE ON public.insumos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_acabados_updated_at BEFORE UPDATE ON public.produtos_acabados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projetos_updated_at BEFORE UPDATE ON public.projetos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON public.obras
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ordens_producao_updated_at BEFORE UPDATE ON public.ordens_producao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
