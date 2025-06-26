
import React, { useState } from "react";
import AtendimentoHeader from "@/components/atendimento/AtendimentoHeader";
import AtendimentoContent from "@/components/atendimento/AtendimentoContent";
import AtendimentoLoadingState from "@/components/atendimento/AtendimentoLoadingState";
import { useAtendimentoHandlers } from "@/components/atendimento/AtendimentoHandlers";
import { convertAtendimentosData, convertSelectedAtendimento } from "@/components/atendimento/AtendimentoDataConverter";

const Atendimento = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNovoAtendimentoOpen, setIsNovoAtendimentoOpen] = useState(false);
  const [isLigacaoDialogOpen, setIsLigacaoDialogOpen] = useState(false);
  
  const {
    atendimentos,
    isLoading,
    selectedAtendimento,
    setSelectedAtendimento,
    handleNovoAtendimento,
    handleDeleteAtendimento,
    handleChangeStatus,
    handleViewHistory,
    handleConverterEmOrcamento
  } = useAtendimentoHandlers();

  // Update selected atendimento when data loads
  React.useEffect(() => {
    if (atendimentos.length > 0 && !selectedAtendimento) {
      setSelectedAtendimento(atendimentos[0]);
    }
  }, [atendimentos, selectedAtendimento, setSelectedAtendimento]);

  // Filter atendimentos based on search term
  const filteredAtendimentos = atendimentos.filter(
    (item) =>
      item.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mensagem && item.mensagem.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to register a call
  const handleRegistrarLigacao = () => {
    setIsLigacaoDialogOpen(true);
  };

  const handleNovoAtendimentoSubmit = (data: any) => {
    handleNovoAtendimento(data);
    setIsNovoAtendimentoOpen(false);
  };

  const convertedAtendimentos = convertAtendimentosData(filteredAtendimentos);
  const convertedSelectedAtendimento = convertSelectedAtendimento(selectedAtendimento, convertedAtendimentos);

  const handleSelectAtendimento = (atendimento: any) => {
    const originalAtendimento = atendimentos.find(a => 
      parseInt(a.id?.substring(0, 8) || '0', 16) === atendimento.id
    );
    if (originalAtendimento) {
      setSelectedAtendimento(originalAtendimento);
    }
  };

  if (isLoading) {
    return <AtendimentoLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AtendimentoHeader
        isNovoAtendimentoOpen={isNovoAtendimentoOpen}
        setIsNovoAtendimentoOpen={setIsNovoAtendimentoOpen}
        onNovoAtendimento={handleNovoAtendimentoSubmit}
        onRegistrarLigacao={handleRegistrarLigacao}
      />

      <AtendimentoContent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        convertedAtendimentos={convertedAtendimentos}
        convertedSelectedAtendimento={convertedSelectedAtendimento}
        onSelectAtendimento={handleSelectAtendimento}
        onViewHistory={handleViewHistory}
        onConverterEmOrcamento={handleConverterEmOrcamento}
        onDeleteAtendimento={handleDeleteAtendimento}
        onChangeStatus={handleChangeStatus}
        isLigacaoDialogOpen={isLigacaoDialogOpen}
        setIsLigacaoDialogOpen={setIsLigacaoDialogOpen}
      />
    </div>
  );
};

export default Atendimento;
