
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AtendimentoTabs from "./AtendimentoTabs";
import { AtendimentoKanbanView } from "./AtendimentoKanbanView";
import RegistrarLigacaoDialog from "./RegistrarLigacaoDialog";

interface AtendimentoContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  convertedAtendimentos: any[];
  convertedSelectedAtendimento: any;
  onSelectAtendimento: (atendimento: any) => void;
  onViewHistory: () => void;
  onConverterEmOrcamento: (atendimento: any) => void;
  onDeleteAtendimento: (id: number | string) => void;
  onChangeStatus: (id: number | string, newStatus: string) => void;
  isLigacaoDialogOpen: boolean;
  setIsLigacaoDialogOpen: (open: boolean) => void;
}

const AtendimentoContent = ({
  searchTerm,
  setSearchTerm,
  convertedAtendimentos,
  convertedSelectedAtendimento,
  onSelectAtendimento,
  onViewHistory,
  onConverterEmOrcamento,
  onDeleteAtendimento,
  onChangeStatus,
  isLigacaoDialogOpen,
  setIsLigacaoDialogOpen
}: AtendimentoContentProps) => {
  return (
    <>
      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Atendimentos</TabsTrigger>
          <TabsTrigger value="kanban">Kanban CRM</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <AtendimentoTabs
            atendimentos={convertedAtendimentos}
            selectedAtendimento={convertedSelectedAtendimento}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectAtendimento={onSelectAtendimento}
            onViewHistory={onViewHistory}
            onConverterEmOrcamento={onConverterEmOrcamento}
            onDeleteAtendimento={onDeleteAtendimento}
          />
        </TabsContent>

        <TabsContent value="kanban">
          <AtendimentoKanbanView
            atendimentos={convertedAtendimentos}
            onDeleteAtendimento={onDeleteAtendimento}
            onChangeStatus={onChangeStatus}
            onConverterEmOrcamento={onConverterEmOrcamento}
          />
        </TabsContent>
      </Tabs>

      <RegistrarLigacaoDialog
        isOpen={isLigacaoDialogOpen}
        onOpenChange={setIsLigacaoDialogOpen}
      />
    </>
  );
};

export default AtendimentoContent;
