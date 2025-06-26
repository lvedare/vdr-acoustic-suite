
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { converterAtendimentoParaProposta } from "@/utils/propostaUtils";
import { useAtendimentos } from "@/hooks/useAtendimentos";

export const useAtendimentoHandlers = () => {
  const navigate = useNavigate();
  const {
    atendimentos,
    isLoading,
    criarAtendimento,
    atualizarAtendimento,
    excluirAtendimento,
    isCriando,
    isAtualizando,
    isExcluindo
  } = useAtendimentos();

  const [selectedAtendimento, setSelectedAtendimento] = useState(
    atendimentos.length > 0 ? atendimentos[0] : null
  );

  // Function to create a new service record
  const handleNovoAtendimento = (data: any) => {
    const atendimentoData = {
      cliente_nome: data.cliente,
      contato: data.contato,
      assunto: data.assunto,
      mensagem: data.mensagem || '',
      data: data.data,
      hora: data.hora,
      canal: data.canal,
      status: data.status || 'Novo'
    };

    criarAtendimento(atendimentoData);
  };

  // Function to delete atendimento
  const handleDeleteAtendimento = (id: number | string) => {
    const atendimentoToDelete = atendimentos.find(a => 
      typeof id === 'string' ? a.id === id : a.id === id.toString()
    );
    
    if (atendimentoToDelete?.id) {
      excluirAtendimento(atendimentoToDelete.id);
      
      if (selectedAtendimento?.id === atendimentoToDelete.id) {
        setSelectedAtendimento(atendimentos.length > 1 ? atendimentos[0] : null);
      }
    }
  };

  // Function to change status
  const handleChangeStatus = (id: number | string, newStatus: string) => {
    const atendimentoToUpdate = atendimentos.find(a => 
      typeof id === 'string' ? a.id === id : a.id === id.toString()
    );
    
    if (atendimentoToUpdate?.id) {
      atualizarAtendimento({
        id: atendimentoToUpdate.id,
        atendimento: { status: newStatus }
      });
    }
  };

  // Function to view history
  const handleViewHistory = () => {
    toast.info("Visualizando histórico de atendimentos");
  };

  // Function to convert service to proposal
  const handleConverterEmOrcamento = (atendimento: any) => {
    const novaProposta = converterAtendimentoParaProposta(atendimento);
    
    const propostasAtuais = JSON.parse(localStorage.getItem("propostas") || "[]");
    propostasAtuais.push(novaProposta);
    localStorage.setItem("propostas", JSON.stringify(propostasAtuais));
    
    toast.success(`Atendimento convertido em orçamento com sucesso!`);
    
    navigate(`/novo-orcamento`, {
      state: { 
        clienteId: atendimento.cliente_id,
        fromAtendimento: true, 
        atendimentoId: atendimento.id,
        atendimento: {
          ...atendimento,
          cliente: atendimento.cliente_nome
        }
      }
    });
  };

  return {
    atendimentos,
    isLoading,
    selectedAtendimento,
    setSelectedAtendimento,
    handleNovoAtendimento,
    handleDeleteAtendimento,
    handleChangeStatus,
    handleViewHistory,
    handleConverterEmOrcamento,
    isCriando,
    isAtualizando,
    isExcluindo
  };
};
