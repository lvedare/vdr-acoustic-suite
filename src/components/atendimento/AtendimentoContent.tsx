
import React, { useState } from "react";
import { useAtendimentos } from "@/hooks/useAtendimentos";
import { AtendimentoList } from "./AtendimentoList";
import { AtendimentoKanbanView } from "./AtendimentoKanbanView";
import AtendimentoDetail from "./AtendimentoDetail";
import { EnviarParaOrcamentoDialog } from "./EnviarParaOrcamentoDialog";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { toast } from "sonner";

interface AtendimentoContentProps {
  view: 'lista' | 'kanban';
  searchTerm: string;
  statusFilter: string;
  canalFilter: string;
}

export const AtendimentoContent: React.FC<AtendimentoContentProps> = ({
  view,
  searchTerm,
  statusFilter,
  canalFilter
}) => {
  const { atendimentos, isLoading, excluirAtendimento } = useAtendimentos();
  const [selectedAtendimento, setSelectedAtendimento] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEnviarOrcamentoOpen, setIsEnviarOrcamentoOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [atendimentoToDelete, setAtendimentoToDelete] = useState<any>(null);

  console.log('AtendimentoContent - atendimentos carregados:', atendimentos);

  // Filtrar atendimentos
  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const matchesSearch = !searchTerm || 
      atendimento.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.contato?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || atendimento.status === statusFilter;
    const matchesCanal = !canalFilter || canalFilter === 'all' || atendimento.canal === canalFilter;
    
    return matchesSearch && matchesStatus && matchesCanal;
  });

  console.log('AtendimentoContent - atendimentos filtrados:', atendimentosFiltrados);

  const handleVerDetalhes = (atendimento: any) => {
    console.log('Ver detalhes do atendimento:', atendimento);
    setSelectedAtendimento(atendimento);
    setIsDetailDialogOpen(true);
  };

  const handleExcluir = (atendimento: any) => {
    console.log('Preparando exclusão do atendimento:', atendimento);
    setAtendimentoToDelete(atendimento);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (atendimentoToDelete?.id) {
      try {
        console.log('Excluindo atendimento:', atendimentoToDelete.id);
        await excluirAtendimento(atendimentoToDelete.id);
        setIsDeleteDialogOpen(false);
        setAtendimentoToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir atendimento:", error);
        toast.error("Erro ao excluir atendimento");
      }
    }
  };

  const handleEnviarParaOrcamento = (atendimento: any) => {
    console.log('Enviar para orçamento:', atendimento);
    setSelectedAtendimento(atendimento);
    setIsEnviarOrcamentoOpen(true);
  };

  const handleViewHistory = () => {
    console.log("Ver histórico do atendimento");
  };

  const handleConverterEmOrcamento = (atendimento: any) => {
    handleEnviarParaOrcamento(atendimento);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando atendimentos...</div>;
  }

  return (
    <>
      {view === 'lista' ? (
        <AtendimentoList
          atendimentos={atendimentosFiltrados}
          onVerDetalhes={handleVerDetalhes}
          onExcluir={handleExcluir}
          onEnviarParaOrcamento={handleEnviarParaOrcamento}
        />
      ) : (
        <AtendimentoKanbanView
          atendimentos={atendimentosFiltrados}
          onVerDetalhes={handleVerDetalhes}
          onExcluir={handleExcluir}
          onEnviarParaOrcamento={handleEnviarParaOrcamento}
        />
      )}

      {/* Dialog para detalhes do atendimento */}
      {selectedAtendimento && isDetailDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Detalhes do Atendimento</h2>
              <button 
                onClick={() => {
                  setSelectedAtendimento(null);
                  setIsDetailDialogOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <AtendimentoDetail
              atendimento={selectedAtendimento}
              onViewHistory={handleViewHistory}
              onConverterEmOrcamento={handleConverterEmOrcamento}
            />
          </div>
        </div>
      )}

      <EnviarParaOrcamentoDialog
        isOpen={isEnviarOrcamentoOpen}
        onOpenChange={setIsEnviarOrcamentoOpen}
        atendimento={selectedAtendimento}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Atendimento"
        description={`Tem certeza que deseja excluir o atendimento de ${atendimentoToDelete?.cliente_nome}?`}
        itemName={atendimentoToDelete?.assunto}
      />
    </>
  );
};
