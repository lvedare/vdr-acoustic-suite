
export interface Projeto {
  id: number;
  nome: string;
  cliente: string;
  status: string;
  tipo: string;
  dataInicio: string;
  dataPrevisao: string;
  dataConclusao?: string;
}

export type ProjetoStatus = "planejamento" | "em_andamento" | "concluido" | "cancelado";

export type StatusVariant = "default" | "secondary" | "outline" | "destructive";

export interface StatusConfig {
  label: string;
  variant: StatusVariant;
}

export const projetoStatusMap: Record<string, StatusConfig> = {
  planejamento: { label: "Planejamento", variant: "secondary" },
  em_andamento: { label: "Em Andamento", variant: "default" },
  concluido: { label: "Concluído", variant: "outline" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};
