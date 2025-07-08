
import React, { useState } from "react";
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

const Orcamentos = () => {
  const [activeTab, setActiveTab] = useState("propostas");
  
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

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar orçamentos</h1>
          <p className="text-gray-600">{typeof error === 'string' ? error : 'Erro desconhecido'}</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleDownloadPDF = (proposta: any) => {
    console.log('Download PDF:', proposta);
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

  // Filtrar propostas por origem
  const propostasOriginais = propostasFiltradas.filter(p => p.origem !== 'atendimento');
  const propostasDeAtendimento = propostasFiltradas.filter(p => p.origem === 'atendimento');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Orçamentos</h1>
        <PropostasExportButton propostas={propostasFiltradas} />
      </div>

      <PropostasMetrics propostas={propostas} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="propostas">Propostas ({propostasOriginais.length})</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos ({propostasDeAtendimento.length})</TabsTrigger>
        </TabsList>
        
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
        
        <TabsContent value="atendimentos" className="space-y-6">
          <AtendimentosTab 
            propostas={propostasDeAtendimento}
            formatDate={formatDate}
          />
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
