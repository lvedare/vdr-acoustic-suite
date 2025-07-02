
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AtendimentoList } from "./AtendimentoList";
import AtendimentoDetail from "./AtendimentoDetail";
import AtendimentoSearchBar from "./AtendimentoSearchBar";
import ChatWhatsapp from "./ChatWhatsapp";
import HistoricoAtendimentos from "./HistoricoAtendimentos";

type Atendimento = {
  id: number;
  cliente: string;
  contato: string;
  assunto: string;
  data: string;
  hora: string;
  canal: string;
  status: string;
  mensagem: string;
};

interface AtendimentoTabsProps {
  atendimentos: Atendimento[];
  selectedAtendimento: Atendimento;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectAtendimento: (atendimento: Atendimento) => void;
  onViewHistory: () => void;
  onConverterEmOrcamento: (atendimento: Atendimento) => void;
  onDeleteAtendimento: (id: number) => void;
}

const AtendimentoTabs = ({
  atendimentos,
  selectedAtendimento,
  searchTerm,
  onSearchChange,
  onSelectAtendimento,
  onViewHistory,
  onConverterEmOrcamento,
  onDeleteAtendimento,
}: AtendimentoTabsProps) => {
  return (
    <Tabs defaultValue="atendimentos" className="w-full">
      <TabsList>
        <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
        <TabsTrigger value="chat">Chat WhatsApp</TabsTrigger>
        <TabsTrigger value="historico">Histórico</TabsTrigger>
      </TabsList>

      <TabsContent value="atendimentos" className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Gerenciamento de Atendimentos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os atendimentos em aberto.
            </CardDescription>
            <AtendimentoSearchBar 
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AtendimentoList
                atendimentos={atendimentos}
                selectedAtendimento={selectedAtendimento}
                onSelectAtendimento={onSelectAtendimento}
                onDeleteAtendimento={onDeleteAtendimento}
                onConverterEmOrcamento={onConverterEmOrcamento}
              />
              <div className="rounded-md border">
                <AtendimentoDetail
                  atendimento={selectedAtendimento}
                  onViewHistory={onViewHistory}
                  onConverterEmOrcamento={onConverterEmOrcamento}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chat" className="mt-4">
        <ChatWhatsapp />
      </TabsContent>

      <TabsContent value="historico" className="mt-4">
        <HistoricoAtendimentos />
      </TabsContent>
    </Tabs>
  );
};

export default AtendimentoTabs;
