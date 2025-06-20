import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

// Custom components
import PropostasSearch from "@/components/orcamento/PropostasSearch";
import PropostasList from "@/components/orcamento/PropostasList";
import PropostasFiltradas from "@/components/orcamento/PropostasFiltradas";
import AtendimentosTab from "@/components/orcamento/AtendimentosTab";

// Types and Utilities
import { Proposta } from "@/types/orcamento";
import { gerarNumeroProposta, converterAtendimentoParaProposta } from "@/utils/propostaUtils";

// Dados de exemplo
const clientesExemplo = [
  {
    id: 1,
    nome: "Rayan Fássio Santos",
    email: "rayanfassio@gmail.com",
    telefone: "(62)98244-4078",
    empresa: "J TEM RAYAN FASSIO",
    cnpj: "11"
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "maria@empresa.com",
    telefone: "(62)98765-4321",
    empresa: "Empresa ABC",
    cnpj: "12.345.678/0001-90"
  },
  {
    id: 3,
    nome: "João Pereira",
    email: "joao@construcoes.com",
    telefone: "(62)91234-5678",
    empresa: "Construções XYZ",
    cnpj: "98.765.432/0001-10"
  }
];

// Propostas iniciais de exemplo
const propostasIniciais = [
  {
    id: 1,
    numero: "VDR27.3.20241425.0RO",
    data: "2025-05-07",
    cliente: clientesExemplo[0],
    status: "enviada",
    itens: [
      {
        id: 1,
        codigo: "PA148",
        descricao: "PORTA ACÚSTICA, COMPOSIÇÃO DE MADEIRA, DIMENSÃO 80X210 CM, ESPESSURA DE PAREDE 11 X 15 CM",
        unidade: "PÇ",
        quantidade: 1,
        valorUnitario: 6820.05,
        valorTotal: 6820.05
      }
    ],
    custos: [
      { id: 1, descricao: "Material acústico", valor: 2500 },
      { id: 2, descricao: "Mão de obra", valor: 1800 },
      { id: 3, descricao: "Ferragens", valor: 700 },
      { id: 4, descricao: "Transporte", valor: 300 }
    ],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 6820.05,
    formaPagamento: "50% DE ENTRADA E 50% NO FINAL",
    prazoEntrega: "15 DIAS",
    prazoObra: "10 DIAS",
    validade: "05 DIAS"
  },
  {
    id: 2,
    numero: "VDR27.3.20241426.0RO",
    data: "2025-05-01",
    cliente: clientesExemplo[1],
    status: "aprovada",
    itens: [
      {
        id: 1,
        codigo: "PA150",
        descricao: "REVESTIMENTO ACÚSTICO PARA PAREDE, ESPUMA DE ALTA DENSIDADE, 50MM",
        unidade: "M²",
        quantidade: 25,
        valorUnitario: 320.00,
        valorTotal: 8000.00
      },
      {
        id: 2,
        codigo: "PA151",
        descricao: "INSTALAÇÃO DE REVESTIMENTO ACÚSTICO",
        unidade: "M²",
        quantidade: 25,
        valorUnitario: 80.00,
        valorTotal: 2000.00
      }
    ],
    custos: [
      { id: 1, descricao: "Material acústico", valor: 6500 },
      { id: 2, descricao: "Mão de obra", valor: 2500 },
      { id: 3, descricao: "Transporte", valor: 500 }
    ],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 10000.00,
    formaPagamento: "40% DE ENTRADA, 30% NA ENTREGA DOS MATERIAIS E 30% NA FINALIZAÇÃO",
    prazoEntrega: "20 DIAS",
    prazoObra: "15 DIAS",
    validade: "07 DIAS"
  },
  {
    id: 3,
    numero: "VDR27.3.20241427.0RO",
    data: "2025-04-25",
    cliente: clientesExemplo[2],
    status: "rejeitada",
    itens: [
      {
        id: 1,
        codigo: "PA160",
        descricao: "TRATAMENTO ACÚSTICO PARA SALA DE REUNIÕES",
        unidade: "M²",
        quantidade: 35,
        valorUnitario: 450.00,
        valorTotal: 15750.00
      }
    ],
    custos: [
      { id: 1, descricao: "Material acústico premium", valor: 10000 },
      { id: 2, descricao: "Mão de obra especializada", valor: 4000 },
      { id: 3, descricao: "Logística e transporte", valor: 800 },
    ],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 15750.00,
    formaPagamento: "30% DE ENTRADA, 40% NA ENTREGA DOS MATERIAIS E 30% NA FINALIZAÇÃO",
    prazoEntrega: "25 DIAS",
    prazoObra: "20 DIAS",
    validade: "10 DIAS"
  }
];

// Dados de exemplo para atendimentos
const atendimentosExemplo = [
  {
    id: 1,
    cliente: "João Silva",
    contato: "(11) 98765-4321",
    assunto: "Orçamento para tratamento acústico",
    data: "07/05/2025",
    hora: "09:30",
    canal: "WhatsApp",
    status: "Novo",
    mensagem: "Olá, gostaria de um orçamento para tratamento acústico em meu home studio."
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
    mensagem: "Bom dia, gostaria de saber qual o melhor material para isolamento acústico em uma sala pequena."
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
    mensagem: "Preciso de uma visita técnica para avaliar o isolamento acústico de salas de reunião."
  }
];

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermAtendimento, setSearchTermAtendimento] = useState("");
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const navigate = useNavigate();

  // Recuperar propostas do localStorage ou usar o exemplo
  useEffect(() => {
    const savedPropostas = localStorage.getItem("propostas");
    if (savedPropostas) {
      setPropostas(JSON.parse(savedPropostas));
    } else {
      setPropostas(propostasIniciais);
      localStorage.setItem("propostas", JSON.stringify(propostasIniciais));
    }
  }, []);

  // Filtrar propostas com base no termo de pesquisa
  const filteredPropostas = propostas.filter(proposta => {
    return (
      proposta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filtrar atendimentos com base no termo de pesquisa
  const filteredAtendimentos = atendimentosExemplo.filter(atendimento => {
    return (
      atendimento.cliente.toLowerCase().includes(searchTermAtendimento.toLowerCase()) ||
      atendimento.assunto.toLowerCase().includes(searchTermAtendimento.toLowerCase()) ||
      atendimento.mensagem.toLowerCase().includes(searchTermAtendimento.toLowerCase())
    );
  });

  // Função para formatar datas
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para lidar com a exclusão de proposta
  const handleDelete = (id: number) => {
    const updatedPropostas = propostas.filter(proposta => proposta.id !== id);
    setPropostas(updatedPropostas);
    localStorage.setItem("propostas", JSON.stringify(updatedPropostas));
    
    toast.success("Proposta excluída com sucesso!");
  };

  // Função para mudar o status
  const handleChangeStatus = (id: number, newStatus: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => {
    const updatedPropostas = propostas.map(proposta => {
      if (proposta.id === id) {
        return { ...proposta, status: newStatus };
      }
      return proposta;
    });
    
    setPropostas(updatedPropostas);
    localStorage.setItem("propostas", JSON.stringify(updatedPropostas));
    
    toast.success(`Status alterado para ${newStatus.toUpperCase()}`);
  };

  // Função para converter um atendimento em orçamento
  const handleCriarPropostaFromAtendimento = (atendimento: any) => {
    // Convert service record to proposal
    const novaProposta = converterAtendimentoParaProposta(atendimento);
    
    // Navigate to new proposal page with the atendimento data
    navigate("/novo-orcamento", {
      state: { 
        clienteId: atendimento.clienteId,
        fromAtendimento: true, 
        atendimentoId: atendimento.id,
        atendimento: atendimento
      }
    });
  };

  // Função para criar revisão de proposta
  const handleCriarRevisao = (proposta: Proposta) => {
    // Criar cópia da proposta original
    const revisaoProposta: Proposta = {
      ...proposta,
      id: Date.now(), // Novo ID para a revisão
      numero: `${proposta.numero}-REV${new Date().toISOString().slice(0,10)}`, // Adiciona REV ao número
      data: new Date().toISOString().split('T')[0], // Data atual
      status: "rascunho", // Inicia como rascunho
    };
    
    // Adicionar a revisão às propostas existentes
    const novasPropostas = [...propostas, revisaoProposta];
    setPropostas(novasPropostas);
    localStorage.setItem("propostas", JSON.stringify(novasPropostas));
    
    // Notificar o usuário
    toast.success(`Revisão da proposta ${proposta.numero} criada com sucesso!`);
    
    // Navegar para a edição da nova revisão
    navigate(`/novo-orcamento`, { 
      state: { 
        propostaId: revisaoProposta.id,
        isRevisao: true,
        propostaOriginalId: proposta.id
      } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
      </div>

      <Card>
        <CardHeader>
          <PropostasSearch 
            searchTerm={searchTerm} 
            onSearchChange={(value) => setSearchTerm(value)} 
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas">
            <TabsList className="mb-4">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
              <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
              <TabsTrigger value="atendimentos">
                <MessageSquare className="mr-2 h-4 w-4" />
                Atendimentos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="todas">
              <PropostasList 
                propostas={filteredPropostas}
                onDelete={handleDelete}
                onChangeStatus={handleChangeStatus}
                onCriarRevisao={handleCriarRevisao}
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="enviadas">
              <PropostasFiltradas 
                propostas={filteredPropostas}
                status="enviada"
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="aprovadas">
              <PropostasFiltradas 
                propostas={filteredPropostas}
                status="aprovada"
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="rejeitadas">
              <PropostasFiltradas 
                propostas={filteredPropostas}
                status="rejeitada"
                formatDate={formatDate}
              />
            </TabsContent>

            <TabsContent value="atendimentos">
              <AtendimentosTab 
                atendimentos={filteredAtendimentos}
                searchTerm={searchTermAtendimento}
                onSearchChange={(value) => setSearchTermAtendimento(value)}
                onCriarProposta={handleCriarPropostaFromAtendimento}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orcamentos;
