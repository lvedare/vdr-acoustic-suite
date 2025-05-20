
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { converterAtendimentoParaProposta } from "@/utils/propostaUtils";
import { atendimentosData } from "@/components/atendimento/utils";
import NovoAtendimentoDialog from "@/components/atendimento/NovoAtendimentoDialog";
import AtendimentoTabs from "@/components/atendimento/AtendimentoTabs";

const Atendimento = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAtendimento, setSelectedAtendimento] = useState(atendimentosData[0]);
  const [isNovoAtendimentoOpen, setIsNovoAtendimentoOpen] = useState(false);
  const [atendimentos, setAtendimentos] = useState<any[]>(atendimentosData);
  const navigate = useNavigate();

  // Load saved atendimentos
  useEffect(() => {
    const savedAtendimentos = localStorage.getItem("atendimentos");
    if (savedAtendimentos) {
      const parsedAtendimentos = JSON.parse(savedAtendimentos);
      setAtendimentos([...atendimentosData, ...parsedAtendimentos]);
    }
  }, []);

  // Filter atendimentos based on search term
  const filteredAtendimentos = atendimentos.filter(
    (item) =>
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mensagem && item.mensagem.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to create a new service record
  const handleNovoAtendimento = (data: any) => {
    // Add to existing atendimentos
    const updatedAtendimentos = [data, ...atendimentos];
    setAtendimentos(updatedAtendimentos);
    
    // Save to localStorage
    const existingAtendimentos = JSON.parse(localStorage.getItem("atendimentos") || "[]");
    localStorage.setItem("atendimentos", JSON.stringify([data, ...existingAtendimentos]));
    
    // Show success message
    toast.success("Novo atendimento criado com sucesso!");
    setIsNovoAtendimentoOpen(false);
    
    // Select the new atendimento
    setSelectedAtendimento(data);
  };

  // Function to register a call
  const handleRegistrarLigacao = () => {
    toast.success("Formulário de registro de ligação será aberto");
    // Further implementation would open a form to register the call
  };

  // Function to view history
  const handleViewHistory = () => {
    toast.info("Visualizando histórico de atendimentos");
    // Further implementation would show a detailed history
  };

  // Function to convert service to proposal
  const handleConverterEmOrcamento = (atendimento: any) => {
    // Convert service to proposal
    const novaProposta = converterAtendimentoParaProposta(atendimento);
    
    // Store the new proposal in localStorage to be accessed in the Orcamentos page
    const propostasAtuais = JSON.parse(localStorage.getItem("propostas") || "[]");
    propostasAtuais.push(novaProposta);
    localStorage.setItem("propostas", JSON.stringify(propostasAtuais));
    
    // Show success message
    toast.success(`Atendimento convertido em orçamento com sucesso!`);
    
    // Navigate to the new proposal, passing the client info
    navigate(`/novo-orcamento`, {
      state: { 
        clienteId: atendimento.clienteId,
        fromAtendimento: true, 
        atendimentoId: atendimento.id 
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">CRM / Atendimento</h1>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-vdr-blue hover:bg-blue-800"
            onClick={handleRegistrarLigacao}
          >
            <Phone className="mr-2 h-4 w-4" /> Registrar Ligação
          </Button>
          <NovoAtendimentoDialog
            isOpen={isNovoAtendimentoOpen}
            onOpenChange={setIsNovoAtendimentoOpen}
            onSubmit={handleNovoAtendimento}
          />
        </div>
      </div>

      <AtendimentoTabs
        atendimentos={filteredAtendimentos}
        selectedAtendimento={selectedAtendimento}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectAtendimento={setSelectedAtendimento}
        onViewHistory={handleViewHistory}
        onConverterEmOrcamento={handleConverterEmOrcamento}
      />
    </div>
  );
};

export default Atendimento;
