
import React, { useState } from "react";
import { useAtendimentos } from "@/hooks/useAtendimentos";
import { AtendimentoList } from "./AtendimentoList";
import { AtendimentoKanbanView } from "./AtendimentoKanbanView";
import AtendimentoDetail from "./AtendimentoDetail";
import NovoAtendimentoDialog from "./NovoAtendimentoDialog";
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
  const { atendimentos, isLoading, criarAtendimento, excluirAtendimento } = useAtendimentos();
  const [selectedAtendimento, setSelectedAtendimento] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isNovoAtendimentoOpen, setIsNovoAtendimentoOpen] = useState(false);
  const [isEnviarOrcamentoOpen, setIsEnviarOrcamentoOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [atendimentoToDelete, setAtendimentoToDelete] = useState<any>(null);

  // Filtrar atendimentos
  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const matchesSearch = !searchTerm || 
      atendimento.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.contato?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || atendimento.status === statusFilter;
    const matchesCanal = !canalFilter || atendimento.canal === canalFilter;
    
    return matchesSearch && matchesStatus && matchesCanal;
  });

  const handleVerDetalhes = (atendimento: any) => {
    setSelectedAtendimento(atendimento);
    setIsDetailDialogOpen(true);
  };

  const handleExcluir = (atendimento: any) => {
    setAtendimentoToDelete(atendimento);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (atendimentoToDelete?.id) {
      try {
        await excluirAtendimento(atendimentoToDelete.id);
        toast.success("Atendimento excluído com sucesso!");
        setIsDeleteDialogOpen(false);
        setAtendimentoToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir atendimento:", error);
        toast.error("Erro ao excluir atendimento");
      }
    }
  };

  const handleEnviarParaOrcamento = (atendimento: any) => {
    setSelectedAtendimento(atendimento);
    setIsEnviarOrcamentoOpen(true);
  };

  const handleNovoAtendimento = async (novoAtendimento: any) => {
    try {
      await criarAtendimento(novoAtendimento);
      toast.success("Atendimento criado com sucesso!");
      setIsNovoAtendimentoOpen(false);
    } catch (error) {
      console.error("Erro ao criar atendimento:", error);
      toast.error("Erro ao criar atendimento");
    }
  };

  const handleViewHistory = () => {
    // Implementar visualização do histórico
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

      {/* Use a Dialog wrapper for AtendimentoDetail */}
      {selectedAtendimento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Detalhes do Atendimento</h2>
              <button 
                onClick={() => setSelectedAtendimento(null)}
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

      <NovoAtendimentoDialog
        isOpen={isNovoAtendimentoOpen}
        onOpenChange={setIsNovoAtendimentoOpen}
        onSubmit={handleNovoAtendimento}
      />

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
