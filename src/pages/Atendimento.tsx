
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { converterAtendimentoParaProposta } from "@/utils/propostaUtils";
import NovoAtendimentoDialog from "@/components/atendimento/NovoAtendimentoDialog";
import AtendimentoTabs from "@/components/atendimento/AtendimentoTabs";
import { AtendimentoKanbanView } from "@/components/atendimento/AtendimentoKanbanView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrarLigacaoDialog from "@/components/atendimento/RegistrarLigacaoDialog";
import { useAtendimentos } from "@/hooks/useAtendimentos";

const Atendimento = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNovoAtendimentoOpen, setIsNovoAtendimentoOpen] = useState(false);
  const [isLigacaoDialogOpen, setIsLigacaoDialogOpen] = useState(false);
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

  // Update selected atendimento when data loads
  React.useEffect(() => {
    if (atendimentos.length > 0 && !selectedAtendimento) {
      setSelectedAtendimento(atendimentos[0]);
    }
  }, [atendimentos, selectedAtendimento]);

  // Filter atendimentos based on search term
  const filteredAtendimentos = atendimentos.filter(
    (item) =>
      item.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mensagem && item.mensagem.toLowerCase().includes(searchTerm.toLowerCase()))
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
    setIsNovoAtendimentoOpen(false);
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

  // Function to register a call
  const handleRegistrarLigacao = () => {
    setIsLigacaoDialogOpen(true);
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

  const convertedAtendimentos = filteredAtendimentos.map(atendimento => ({
    id: parseInt(atendimento.id?.substring(0, 8) || '0', 16),
    cliente: atendimento.cliente_nome,
    contato: atendimento.contato,
    assunto: atendimento.assunto,
    data: new Date(atendimento.data).toLocaleDateString('pt-BR'),
    hora: atendimento.hora,
    canal: atendimento.canal,
    status: atendimento.status,
    mensagem: atendimento.mensagem || '',
    clienteId: atendimento.cliente_id ? parseInt(atendimento.cliente_id.substring(0, 8), 16) : undefined
  }));

  const convertedSelectedAtendimento = selectedAtendimento ? {
    id: parseInt(selectedAtendimento.id?.substring(0, 8) || '0', 16),
    cliente: selectedAtendimento.cliente_nome,
    contato: selectedAtendimento.contato,
    assunto: selectedAtendimento.assunto,
    data: new Date(selectedAtendimento.data).toLocaleDateString('pt-BR'),
    hora: selectedAtendimento.hora,
    canal: selectedAtendimento.canal,
    status: selectedAtendimento.status,
    mensagem: selectedAtendimento.mensagem || '',
    clienteId: selectedAtendimento.cliente_id ? parseInt(selectedAtendimento.cliente_id.substring(0, 8), 16) : undefined
  } : (convertedAtendimentos[0] || {
    id: 0,
    cliente: '',
    contato: '',
    assunto: '',
    data: '',
    hora: '',
    canal: '',
    status: '',
    mensagem: ''
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">CRM / Atendimento</h1>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-lg font-medium text-muted-foreground">
              Carregando atendimentos...
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            atendimentos={convertedAtendimentos}
            selectedAtendimento={convertedSelectedAtendimento}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectAtendimento={(atendimento) => {
              const originalAtendimento = atendimentos.find(a => 
                parseInt(a.id?.substring(0, 8) || '0', 16) === atendimento.id
              );
              if (originalAtendimento) {
                setSelectedAtendimento(originalAtendimento);
              }
            }}
            onViewHistory={handleViewHistory}
            onConverterEmOrcamento={handleConverterEmOrcamento}
            onDeleteAtendimento={handleDeleteAtendimento}
          />
        </TabsContent>

        <TabsContent value="kanban">
          <AtendimentoKanbanView
            atendimentos={convertedAtendimentos}
            onDeleteAtendimento={handleDeleteAtendimento}
            onChangeStatus={handleChangeStatus}
            onConverterEmOrcamento={handleConverterEmOrcamento}
          />
        </TabsContent>
      </Tabs>

      <RegistrarLigacaoDialog
        isOpen={isLigacaoDialogOpen}
        onOpenChange={setIsLigacaoDialogOpen}
      />
    </div>
  );
};

export default Atendimento;
