
-- Adicionar campo para origem da proposta se não existir
ALTER TABLE propostas 
ADD COLUMN IF NOT EXISTS origem text DEFAULT 'manual';

-- Garantir que temos o campo atendimento_id para vinculação
ALTER TABLE propostas 
ADD COLUMN IF NOT EXISTS atendimento_id uuid REFERENCES atendimentos(id);

-- Criar índice para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_propostas_atendimento_id ON propostas(atendimento_id);
CREATE INDEX IF NOT EXISTS idx_propostas_origem ON propostas(origem);
