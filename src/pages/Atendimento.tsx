
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { converterAtendimentoParaProposta } from "@/utils/propostaUtils";
import { atendimentosData } from "@/components/atendimento/utils";
import NovoAtendimentoDialog from "@/components/atendimento/NovoAtendimentoDialog";
import AtendimentoTabs from "@/components/atendimento/AtendimentoTabs";
import { AtendimentoKanbanView } from "@/components/atendimento/AtendimentoKanbanView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const updatedAtendimentos = [data, ...atendimentos];
    setAtendimentos(updatedAtendimentos);
    
    const existingAtendimentos = JSON.parse(localStorage.getItem("atendimentos") || "[]");
    localStorage.setItem("atendimentos", JSON.stringify([data, ...existingAtendimentos]));
    
    toast.success("Novo atendimento criado com sucesso!");
    setIsNovoAtendimentoOpen(false);
    setSelectedAtendimento(data);
  };

  // Function to delete atendimento
  const handleDeleteAtendimento = (id: number) => {
    const updatedAtendimentos = atendimentos.filter(a => a.id !== id);
    setAtendimentos(updatedAtendimentos);
    
    const savedAtendimentos = JSON.parse(localStorage.getItem("atendimentos") || "[]");
    const filteredSaved = savedAtendimentos.filter((a: any) => a.id !== id);
    localStorage.setItem("atendimentos", JSON.stringify(filteredSaved));
    
    if (selectedAtendimento?.id === id) {
      setSelectedAtendimento(atendimentos[0]);
    }
  };

  // Function to change status
  const handleChangeStatus = (id: number, newStatus: string) => {
    const updatedAtendimentos = atendimentos.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAtendimentos(updatedAtendimentos);
    
    const savedAtendimentos = JSON.parse(localStorage.getItem("atendimentos") || "[]");
    const updatedSaved = savedAtendimentos.map((a: any) => 
      a.id === id ? { ...a, status: newStatus } : a
    );
    localStorage.setItem("atendimentos", JSON.stringify(updatedSaved));
  };

  // Function to register a call
  const handleRegistrarLigacao = () => {
    toast.success("Formulário de registro de ligação será aberto");
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
        clienteId: atendimento.clienteId,
        fromAtendimento: true, 
        atendimentoId: atendimento.id,
        atendimento: atendimento
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

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Atendimentos</TabsTrigger>
          <TabsTrigger value="kanban">Kanban CRM</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <AtendimentoTabs
            atendimentos={filteredAtendimentos}
            selectedAtendimento={selectedAtendimento}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectAtendimento={setSelectedAtendimento}
            onViewHistory={handleViewHistory}
            onConverterEmOrcamento={handleConverterEmOrcamento}
          />
        </TabsContent>

        <TabsContent value="kanban">
          <AtendimentoKanbanView
            atendimentos={filteredAtendimentos}
            onDeleteAtendimento={handleDeleteAtendimento}
            onChangeStatus={handleChangeStatus}
            onConverterEmOrcamento={handleConverterEmOrcamento}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Atendimento;
