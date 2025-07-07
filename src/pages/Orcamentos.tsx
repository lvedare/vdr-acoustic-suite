
import React from "react";
import PropostasExportButton from "@/components/orcamento/PropostasExportButton";
import PropostasFiltradas from "@/components/orcamento/PropostasFiltradas";
import PropostasMetrics from "@/components/orcamento/PropostasMetrics";
import PropostasSearch from "@/components/orcamento/PropostasSearch";
import DeleteConfirmDialog from "@/components/orcamento/DeleteConfirmDialog";
import StatusChangeDialog from "@/components/orcamento/StatusChangeDialog";
import PropostaDetailsDialog from "@/components/orcamento/PropostaDetailsDialog";
import { usePropostas } from "@/hooks/usePropostas";

const Orcamentos = () => {
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
          <p className="text-gray-600">{error.message || 'Erro desconhecido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Orçamentos</h1>
        <PropostasExportButton propostas={propostasFiltradas} />
      </div>

      <PropostasMetrics propostas={propostas} />

      <div className="grid gap-6">
        <PropostasSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <PropostasFiltradas
          propostas={propostasFiltradas}
          onVerDetalhes={handleVerDetalhes}
          onPreExcluir={handlePreExcluirProposta}
          isLoading={isLoading}
        />
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteProposta}
        propostaSelecionada={propostaSelecionada}
      />

      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={handleStatusChange}
        propostaSelecionada={propostaSelecionada}
      />

      <PropostaDetailsDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        proposta={propostaSelecionada}
      />
    </div>
  );
};

export default Orcamentos;
