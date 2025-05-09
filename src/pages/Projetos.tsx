
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarIcon, 
  CheckSquare, 
  ClipboardList, 
  Clock, 
  FileText, 
  Filter, 
  Plus, 
  Search, 
  Users 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample project data
const projetosMock = [
  {
    id: 1,
    nome: "Tratamento Acústico - Escritório ABC",
    cliente: "Empresa ABC",
    inicio: "2025-05-01",
    previsaoTermino: "2025-05-20",
    responsavel: "João Silva",
    status: "em_andamento",
    progresso: 35,
    descricao: "Instalação de tratamento acústico em sala de reuniões e espaço colaborativo.",
    proposta: "VDR27.3.2025050101.123RO",
    orcamento: 15000
  },
  {
    id: 2,
    nome: "Isolamento Acústico - Studio XYZ",
    cliente: "Studio XYZ",
    inicio: "2025-05-05",
    previsaoTermino: "2025-06-10",
    responsavel: "Maria Oliveira",
    status: "planejamento",
    progresso: 10,
    descricao: "Isolamento acústico completo para estúdio de gravação.",
    proposta: "VDR27.3.2025050501.145RO",
    orcamento: 28500
  },
  {
    id: 3,
    nome: "Redução de Ruído - Restaurante Boa Mesa",
    cliente: "Restaurante Boa Mesa",
    inicio: "2025-04-15",
    previsaoTermino: "2025-04-30",
    responsavel: "Carlos Santos",
    status: "concluido",
    progresso: 100,
    descricao: "Instalação de painéis absorvedores para redução de ruído no salão principal.",
    proposta: "VDR27.3.2025041501.092RO",
    orcamento: 22800
  }
];

const Projetos = () => {
  const [projetos, setProjetos] = useState(projetosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Filter projects based on search term and status
  const projetosFiltrados = projetos.filter(projeto => {
    const matchesSearch = 
      projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filtroStatus) {
      return matchesSearch && projeto.status === filtroStatus;
    }
    
    return matchesSearch;
  });
  
  // Format date
  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planejamento":
        return "bg-blue-100 text-blue-800";
      case "em_andamento":
        return "bg-amber-100 text-amber-800";
      case "aguardando":
        return "bg-purple-100 text-purple-800";
      case "concluido":
        return "bg-emerald-100 text-emerald-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      case "cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "planejamento": return "Planejamento";
      case "em_andamento": return "Em Andamento";
      case "aguardando": return "Aguardando";
      case "concluido": return "Concluído";
      case "atrasado": return "Atrasado";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };
  
  // Navigate to orcamento
  const handleNavigateToOrcamento = (propostaId: string) => {
    navigate(`/orcamentos/${propostaId}`);
  };
  
  // Count projects by status
  const contarProjetos = (status: string) => {
    return projetos.filter(p => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projetos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarProjetos("em_andamento")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Planejamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarProjetos("planejamento")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarProjetos("concluido")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarProjetos("atrasado")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarProjetos("cancelado")}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Projetos</TabsTrigger>
          <TabsTrigger value="kanban">Quadro Kanban</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Projetos Ativos</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar projetos..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium text-sm">Projeto</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Cliente</th>
                      <th className="py-3 px-4 text-left font-medium text-sm hidden md:table-cell">Responsável</th>
                      <th className="py-3 px-4 text-left font-medium text-sm hidden sm:table-cell">Início</th>
                      <th className="py-3 px-4 text-left font-medium text-sm hidden lg:table-cell">Término</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-sm hidden md:table-cell">Progresso</th>
                      <th className="py-3 px-4 text-right font-medium text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projetosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-muted-foreground">
                          Nenhum projeto encontrado
                        </td>
                      </tr>
                    ) : (
                      projetosFiltrados.map((projeto) => (
                        <tr key={projeto.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="font-medium">{projeto.nome}</div>
                          </td>
                          <td className="py-3 px-4">{projeto.cliente}</td>
                          <td className="py-3 px-4 hidden md:table-cell">{projeto.responsavel}</td>
                          <td className="py-3 px-4 hidden sm:table-cell">{formatarData(projeto.inicio)}</td>
                          <td className="py-3 px-4 hidden lg:table-cell">{formatarData(projeto.previsaoTermino)}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(projeto.status)} variant="secondary">
                              {getStatusText(projeto.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress value={projeto.progresso} className="h-2" />
                              <span className="text-xs">{projeto.progresso}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleNavigateToOrcamento(projeto.proposta)}
                              >
                                Orçamento
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                Detalhes
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["planejamento", "em_andamento", "aguardando", "concluido"].map((status) => (
              <Card key={status} className="overflow-hidden">
                <CardHeader className={`py-2 ${
                  status === "concluido" ? "bg-emerald-50" : 
                  status === "em_andamento" ? "bg-amber-50" : 
                  status === "planejamento" ? "bg-blue-50" : 
                  "bg-purple-50"
                }`}>
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{getStatusText(status)}</span>
                    <Badge variant="outline" className="font-normal">
                      {projetos.filter(p => p.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 max-h-[600px] overflow-y-auto">
                  <div className="space-y-3">
                    {projetos.filter(p => p.status === status).map((projeto) => (
                      <Card key={projeto.id} className="cursor-pointer hover:border-primary">
                        <CardContent className="p-3">
                          <div className="font-medium line-clamp-1">{projeto.nome}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{projeto.cliente}</div>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatarData(projeto.previsaoTermino)}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{projeto.responsavel.split(' ')[0]}</span>
                            </div>
                          </div>
                          <Progress value={projeto.progresso} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                    ))}
                    
                    {projetos.filter(p => p.status === status).length === 0 && (
                      <div className="py-8 text-center text-muted-foreground text-sm">
                        Nenhum projeto nesta coluna
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo dos Projetos</CardTitle>
              <CardDescription>Visualização cronológica dos projetos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-6 before:w-[1px] before:bg-muted">
                {projetosFiltrados.map((projeto) => (
                  <div key={projeto.id} className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      {projeto.status === "concluido" ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : projeto.status === "atrasado" ? (
                        <Clock className="h-5 w-5 text-red-600" />
                      ) : (
                        <ClipboardList className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground text-sm">
                        {formatarData(projeto.inicio)} - {formatarData(projeto.previsaoTermino)}
                      </div>
                      <h4 className="font-semibold">{projeto.nome}</h4>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(projeto.status)} variant="secondary">
                          {getStatusText(projeto.status)}
                        </Badge>
                        <span className="text-muted-foreground text-sm">Cliente: {projeto.cliente}</span>
                      </div>
                      <Progress value={projeto.progresso} className="h-2 mt-1" />
                      <div className="mt-2 flex justify-between">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{projeto.responsavel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-sm"
                            onClick={() => handleNavigateToOrcamento(projeto.proposta)}
                          >
                            <span className="text-sm">{projeto.proposta.split('.').pop()}</span>
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/obras?projeto=${projeto.id}`)}
                        >
                          Ver Obra
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projetos;
