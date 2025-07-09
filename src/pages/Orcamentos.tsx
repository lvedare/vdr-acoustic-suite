
import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropostasExportButton from "@/components/orcamento/PropostasExportButton";
import PropostasFiltradas from "@/components/orcamento/PropostasFiltradas";
import PropostasMetrics from "@/components/orcamento/PropostasMetrics";
import PropostasSearch from "@/components/orcamento/PropostasSearch";
import DeleteConfirmDialog from "@/components/orcamento/DeleteConfirmDialog";
import StatusChangeDialog from "@/components/orcamento/StatusChangeDialog";
import PropostaDetailsDialog from "@/components/orcamento/PropostaDetailsDialog";
import { AtendimentosTab } from "@/components/orcamento/AtendimentosTab";
import { usePropostas } from "@/hooks/usePropostas";
import { toast } from "sonner";

const Orcamentos = () => {
  const [activeTab, setActiveTab] = useState("atendimentos");
  
  const {
    propostas,
    propostasFiltradas,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    propostaSelecionada,
    setPropostaSelecionada,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    handleDeleteProposta,
    handleStatusChange,
    handleVerDetalhes,
    handlePreExcluirProposta,
    isLoading,
    error
  } = usePropostas();

  console.log('Orcamentos render - isLoading:', isLoading, 'error:', error);

  // Mostrar loading enquanto carrega
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando módulo de orçamentos...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    console.error('Erro no módulo de orçamentos:', error);
    toast.error('Erro ao carregar módulo de orçamentos');
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar orçamentos</h1>
          <p className="text-gray-600 mb-4">{typeof error === 'string' ? error : 'Erro desconhecido'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return 'Data não informada';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const handleDownloadPDF = (proposta: any) => {
    console.log('Download PDF:', proposta);
    toast.success('Funcionalidade de download em desenvolvimento');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada":
        return "bg-green-100 text-green-800 border-green-300";
      case "enviada":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "rejeitada":
        return "bg-red-100 text-red-800 border-red-300";
      case "expirada":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Garantir que propostasFiltradas é um array
  const propostas_seguras = Array.isArray(propostasFiltradas) ? propostasFiltradas : [];
  const propostas_todas = Array.isArray(propostas) ? propostas : [];
  
  // Filtrar propostas por origem com verificação de segurança
  const propostasOriginais = propostas_seguras.filter(p => !p.origem || p.origem !== 'atendimento');
  const propostasDeAtendimento = propostas_seguras.filter(p => p.origem === 'atendimento');

  console.log('Propostas carregadas:', {
    total: propostas_todas.length,
    filtradas: propostas_seguras.length,
    originais: propostasOriginais.length,
    deAtendimento: propostasDeAtendimento.length
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Orçamentos</h1>
        <PropostasExportButton propostas={propostas_seguras} />
      </div>

      <PropostasMetrics propostas={propostas_todas} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atendimentos">
            Atendimentos ({propostasDeAtendimento.length})
          </TabsTrigger>
          <TabsTrigger value="propostas">
            Propostas ({propostasOriginais.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="atendimentos" className="space-y-6">
          <AtendimentosTab 
            propostas={propostasDeAtendimento}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="propostas" className="space-y-6">
          <div className="grid gap-6">
            <PropostasSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <PropostasFiltradas
              propostas={propostasOriginais}
              status="enviada"
              formatDate={formatDate}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog
          propostaNumero={propostaSelecionada?.numero || ''}
          onConfirm={handleDeleteProposta}
        />
      </Dialog>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <StatusChangeDialog
          propostaId={propostaSelecionada?.id as number || 0}
          propostaNumero={propostaSelecionada?.numero || ''}
          currentStatus={propostaSelecionada?.status || ''}
          onChangeStatus={(id, status) => handleStatusChange(status)}
          getStatusColor={getStatusColor}
        />
      </Dialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        {propostaSelecionada && (
          <PropostaDetailsDialog
            proposta={propostaSelecionada}
            formatDate={formatDate}
            onDownloadPDF={handleDownloadPDF}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Orcamentos;
