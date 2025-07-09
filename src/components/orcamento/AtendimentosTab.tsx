
import React from "react";
import { AtendimentosHeader } from "./atendimentos/AtendimentosHeader";
import { AtendimentosFilters } from "./atendimentos/AtendimentosFilters";
import { AtendimentosList } from "./atendimentos/AtendimentosList";
import { PropostasCriadasSection } from "./atendimentos/PropostasCriadasSection";
import { useAtendimentosLogic } from "./atendimentos/useAtendimentosLogic";

interface AtendimentosTabProps {
  propostas: any[];
  formatDate: (date: string) => string;
}

export const AtendimentosTab: React.FC<AtendimentosTabProps> = ({ propostas, formatDate }) => {
  const {
    searchTerm,
    setSearchTerm,
    canalFilter,
    setCanalFilter,
    atendimentosPendentes,
    atendimentosFiltrados,
    isLoading,
    handleCriarProposta,
    handleVisualizarAtendimento,
  } = useAtendimentosLogic();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Carregando atendimentos pendentes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AtendimentosHeader />

      <AtendimentosFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        canalFilter={canalFilter}
        onCanalFilterChange={setCanalFilter}
      />

      <AtendimentosList
        atendimentosFiltrados={atendimentosFiltrados}
        atendimentosPendentes={atendimentosPendentes}
        formatDate={formatDate}
        onVisualizarAtendimento={handleVisualizarAtendimento}
        onCriarProposta={handleCriarProposta}
      />

      <PropostasCriadasSection propostas={propostas} />
    </div>
  );
};
