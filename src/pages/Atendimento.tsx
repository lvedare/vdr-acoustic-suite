
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MessageSquare,
  Search,
  Phone,
  User,
  Plus,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample data
const atendimentos = [
  {
    id: 1,
    cliente: "João Silva",
    contato: "(11) 98765-4321",
    assunto: "Orçamento para tratamento acústico",
    data: "07/05/2025",
    hora: "09:30",
    canal: "WhatsApp",
    status: "Novo",
    mensagem:
      "Olá, gostaria de um orçamento para tratamento acústico em meu home studio.",
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    contato: "(11) 91234-5678",
    assunto: "Dúvida sobre material",
    data: "07/05/2025",
    hora: "10:15",
    canal: "Email",
    status: "Em andamento",
    mensagem:
      "Bom dia, gostaria de saber qual o melhor material para isolamento acústico em uma sala pequena.",
  },
  {
    id: 3,
    cliente: "Empresa ABC",
    contato: "(11) 3123-4567",
    assunto: "Visita técnica",
    data: "07/05/2025",
    hora: "11:00",
    canal: "Telefone",
    status: "Agendado",
    mensagem:
      "Preciso de uma visita técnica para avaliar o isolamento acústico de salas de reunião.",
  },
  {
    id: 4,
    cliente: "Studio XYZ",
    contato: "(11) 98888-7777",
    assunto: "Orçamento para estúdio",
    data: "06/05/2025",
    hora: "14:20",
    canal: "WhatsApp",
    status: "Convertido",
    mensagem:
      "Precisamos de um orçamento completo para isolamento e tratamento acústico de um estúdio de gravação.",
  },
  {
    id: 5,
    cliente: "Carlos Mendes",
    contato: "(11) 99876-5432",
    assunto: "Reclamação",
    data: "06/05/2025",
    hora: "16:45",
    canal: "Email",
    status: "Crítico",
    mensagem:
      "Estou com problemas no isolamento acústico instalado. O ruído continua passando.",
  },
];

const Atendimento = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAtendimento, setSelectedAtendimento] = useState(atendimentos[0]);

  // Filter atendimentos based on search term
  const filteredAtendimentos = atendimentos.filter(
    (item) =>
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-blue-100 text-blue-800";
      case "Em andamento":
        return "bg-amber-100 text-amber-800";
      case "Agendado":
        return "bg-purple-100 text-purple-800";
      case "Convertido":
        return "bg-emerald-100 text-emerald-800";
      case "Crítico":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">CRM / Atendimento</h1>
        <div className="flex items-center gap-2">
          <Button className="bg-vdr-blue hover:bg-blue-800">
            <Phone className="mr-2 h-4 w-4" /> Registrar Ligação
          </Button>
          <Button className="bg-vdr-blue hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
          </Button>
        </div>
      </div>

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
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, assunto ou conteúdo..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" /> Filtrar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Todos</DropdownMenuItem>
                    <DropdownMenuItem>Novos</DropdownMenuItem>
                    <DropdownMenuItem>Em andamento</DropdownMenuItem>
                    <DropdownMenuItem>Agendados</DropdownMenuItem>
                    <DropdownMenuItem>Convertidos</DropdownMenuItem>
                    <DropdownMenuItem>Críticos</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Ordenar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Lista de atendimentos */}
                <div className="rounded-md border">
                  <div className="flex flex-col divide-y">
                    {filteredAtendimentos.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Nenhum atendimento encontrado.
                      </div>
                    ) : (
                      filteredAtendimentos.map((atendimento) => (
                        <div
                          key={atendimento.id}
                          className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                            selectedAtendimento.id === atendimento.id
                              ? "bg-muted/50"
                              : ""
                          }`}
                          onClick={() => setSelectedAtendimento(atendimento)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{atendimento.cliente}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{atendimento.data}</span>
                              <span>{atendimento.hora}</span>
                            </div>
                          </div>
                          <div className="mt-1 text-sm">{atendimento.assunto}</div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{atendimento.canal}</Badge>
                              <Badge
                                className={getStatusColor(atendimento.status)}
                                variant="secondary"
                              >
                                {atendimento.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Detalhes do atendimento selecionado */}
                <div className="rounded-md border">
                  {selectedAtendimento ? (
                    <div className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Detalhes do Atendimento
                        </h3>
                        <Badge
                          className={getStatusColor(selectedAtendimento.status)}
                          variant="secondary"
                        >
                          {selectedAtendimento.status}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">
                            Cliente
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedAtendimento.cliente}</span>
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">
                            Contato
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedAtendimento.contato}</span>
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">
                            Assunto
                          </div>
                          <div>{selectedAtendimento.assunto}</div>
                        </div>

                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">
                            Canal
                          </div>
                          <Badge variant="outline">{selectedAtendimento.canal}</Badge>
                        </div>

                        <Separator />

                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">
                            Mensagem
                          </div>
                          <div className="rounded-md bg-muted p-3 text-sm">
                            {selectedAtendimento.mensagem}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline">Histórico</Button>
                        {selectedAtendimento.status !== "Convertido" && (
                          <Button className="bg-vdr-blue hover:bg-blue-800">
                            Converter em Orçamento
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
                      Selecione um atendimento para ver os detalhes.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat WhatsApp</CardTitle>
              <CardDescription>
                Integração com WhatsApp será implementada com Z-API ou Twilio.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[500px] items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  Integração com WhatsApp
                </h3>
                <p className="mt-2 text-muted-foreground">
                  A integração com a API do WhatsApp Business será implementada em breve.
                </p>
                <Button className="mt-4 bg-vdr-blue hover:bg-blue-800">
                  Configurar Integração
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atendimentos</CardTitle>
              <CardDescription>
                Visualize o histórico completo de atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[500px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  O histórico detalhado de atendimentos será implementado em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Atendimento;
