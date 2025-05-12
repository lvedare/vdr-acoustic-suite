
export interface Obra {
  id: number;
  nome: string;
  endereco: string;
  cliente: string;
  status: string;
  dataInicio: string;
  dataPrevisao: string;
  dataConclusao?: string;
}

export type ObraStatus = "planejamento" | "em_andamento" | "concluido" | "cancelado";

export type StatusVariant = "default" | "secondary" | "outline" | "destructive";

export interface StatusConfig {
  label: string;
  variant: StatusVariant;
}

export const obraStatusMap: Record<string, StatusConfig> = {
  planejamento: { label: "Planejamento", variant: "secondary" },
  em_andamento: { label: "Em Andamento", variant: "default" },
  concluido: { label: "Concluído", variant: "outline" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};
