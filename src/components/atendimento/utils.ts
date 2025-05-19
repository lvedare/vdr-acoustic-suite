
// Utility function used across atendimento components

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Novo":
      return "bg-blue-100 text-blue-800";
    case "Em andamento":
      return "bg-amber-100 text-amber-800";
    case "Agendado":
      return "bg-purple-100 text-purple-800";
    case "Convertido":
      return "bg-emerald-100 text-emerald-800";
    case "Crítico":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Sample data for atendimentos
export const atendimentosData = [
  {
    id: 1,
    cliente: "João Silva",
    contato: "(11) 98765-4321",
    assunto: "Orçamento para tratamento acústico",
    data: "07/05/2025",
    hora: "09:30",
    canal: "WhatsApp",
    status: "Novo",
    mensagem:
      "Olá, gostaria de um orçamento para tratamento acústico em meu home studio.",
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    contato: "(11) 91234-5678",
    assunto: "Dúvida sobre material",
    data: "07/05/2025",
    hora: "10:15",
    canal: "Email",
    status: "Em andamento",
    mensagem:
      "Bom dia, gostaria de saber qual o melhor material para isolamento acústico em uma sala pequena.",
  },
  {
    id: 3,
    cliente: "Empresa ABC",
    contato: "(11) 3123-4567",
    assunto: "Visita técnica",
    data: "07/05/2025",
    hora: "11:00",
    canal: "Telefone",
    status: "Agendado",
    mensagem:
      "Preciso de uma visita técnica para avaliar o isolamento acústico de salas de reunião.",
  },
  {
    id: 4,
    cliente: "Studio XYZ",
    contato: "(11) 98888-7777",
    assunto: "Orçamento para estúdio",
    data: "06/05/2025",
    hora: "14:20",
    canal: "WhatsApp",
    status: "Convertido",
    mensagem:
      "Precisamos de um orçamento completo para isolamento e tratamento acústico de um estúdio de gravação.",
  },
  {
    id: 5,
    cliente: "Carlos Mendes",
    contato: "(11) 99876-5432",
    assunto: "Reclamação",
    data: "06/05/2025",
    hora: "16:45",
    canal: "Email",
    status: "Crítico",
    mensagem:
      "Estou com problemas no isolamento acústico instalado. O ruído continua passando.",
  },
];
