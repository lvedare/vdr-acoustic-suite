
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database, Loader2 } from "lucide-react";

// Custom components
import PropostasSearch from "@/components/orcamento/PropostasSearch";
import PropostasList from "@/components/orcamento/PropostasList";
import PropostasFiltradas from "@/components/orcamento/PropostasFiltradas";
import { AtendimentosTab } from "@/components/orcamento/AtendimentosTab";
import PropostasExportButton from "@/components/orcamento/PropostasExportButton";
import PropostasMetrics from "@/components/orcamento/PropostasMetrics";
import { RascunhoTab } from "@/components/orcamento/RascunhoTab";

// Hooks e serviços
import { usePropostas, useMigrationToSupabase } from "@/hooks/usePropostas";
import { converterAtendimentoParaProposta } from "@/utils/propostaUtils";

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
    mensagem: "Olá, gostaria de um orçamento para tratamento acústico em meu home studio.",
    clienteId: 1
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
    mensagem: "Bom dia, gostaria de saber qual o melhor material para isolamento acústico em uma sala pequena.",
    clienteId: 2
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
    mensagem: "Preciso de uma visita técnica para avaliar o isolamento acústico de salas de reunião.",
    clienteId: 3
  }
];

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermAtendimento, setSearchTermAtendimento] = useState("");
  const navigate = useNavigate();

  // Usar hooks do Supabase
  const {
    propostas,
    clientes,
    isLoading,
    criarProposta,
    atualizarProposta,
    excluirProposta,
    atualizarStatus,
    isExcluindo,
    isAtualizandoStatus
  } = usePropostas();

  const { migrarDados, isMigrating } = useMigrationToSupabase();

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

  // Função para lidar com a exclusão de proposta - CORRIGIDA
  const handleDelete = async (id: number) => {
    try {
      await excluirProposta(id);
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
    }
  };

  // Função para mudar o status
  const handleChangeStatus = (id: number, newStatus: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => {
    atualizarStatus({ id, status: newStatus });
  };

  // Função para converter um atendimento em orçamento - CORRIGIDA
  const handleCriarPropostaFromAtendimento = (atendimento: any) => {
    navigate("/novo-orcamento", {
      state: { 
        atendimento: atendimento,
        clientePreSelecionado: true
      }
    });
  };

  // Função para criar revisão de proposta
  const handleCriarRevisao = (proposta: any) => {
    navigate(`/novo-orcamento`, { 
      state: { 
        propostaOriginal: proposta,
        isRevisao: true,
        propostaOriginalId: proposta.id
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando propostas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <div className="flex gap-2">
          <Button 
            onClick={migrarDados} 
            disabled={isMigrating}
            variant="outline"
            size="sm"
          >
            {isMigrating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Migrar localStorage
          </Button>
          <PropostasExportButton propostas={filteredPropostas} />
        </div>
      </div>

      <PropostasMetrics propostas={filteredPropostas} />

      <Card>
        <CardHeader>
          <PropostasSearch 
            searchTerm={searchTerm} 
            onSearchChange={(value) => setSearchTerm(value)} 
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="atendimentos">
            <TabsList className="mb-4">
              <TabsTrigger value="atendimentos">
                <MessageSquare className="mr-2 h-4 w-4" />
                Atendimentos
              </TabsTrigger>
              <TabsTrigger value="rascunhos">Rascunhos</TabsTrigger>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
              <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
            </TabsList>

            <TabsContent value="atendimentos">
              <AtendimentosTab 
                atendimentos={filteredAtendimentos}
                searchTerm={searchTermAtendimento}
                onSearchChange={(value) => setSearchTermAtendimento(value)}
                onCriarProposta={handleCriarPropostaFromAtendimento}
              />
            </TabsContent>

            <TabsContent value="rascunhos">
              <RascunhoTab
                propostas={filteredPropostas}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            </TabsContent>
            
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orcamentos;
