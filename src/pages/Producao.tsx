
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Hammer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ClipboardList, 
  Package, 
  Plus,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const ordens = [
  {
    id: "OP-2025-001",
    produto: "Painel Acústico 60mm",
    quantidade: 30,
    unidade: "pç",
    dataInicio: "2025-05-05",
    dataPrevisao: "2025-05-15",
    responsavel: "João Silva",
    status: "em_andamento",
    progresso: 45,
    cliente: "Studio XYZ"
  },
  {
    id: "OP-2025-002",
    produto: "Porta Acústica 40dB",
    quantidade: 5,
    unidade: "pç",
    dataInicio: "2025-05-07",
    dataPrevisao: "2025-05-20",
    responsavel: "Ana Costa",
    status: "aguardando",
    progresso: 0,
    cliente: "Clínica Saúde Total"
  },
  {
    id: "OP-2025-003",
    produto: "Baffles Acústicos",
    quantidade: 15,
    unidade: "pç",
    dataInicio: "2025-05-01",
    dataPrevisao: "2025-05-10",
    responsavel: "Pedro Almeida",
    status: "concluido",
    progresso: 100,
    cliente: "Restaurante Boa Mesa"
  },
  {
    id: "OP-2025-004",
    produto: "Painéis Perfurados MDF 15mm",
    quantidade: 50,
    unidade: "m²",
    dataInicio: "2025-05-10",
    dataPrevisao: "2025-05-30",
    responsavel: "João Silva",
    status: "planejamento",
    progresso: 0,
    cliente: "Empresa ABC"
  },
  {
    id: "OP-2025-005",
    produto: "Isolamento Acústico Especial",
    quantidade: 80,
    unidade: "m²",
    dataInicio: "2025-04-20",
    dataPrevisao: "2025-05-05",
    responsavel: "Ana Costa",
    status: "atrasado",
    progresso: 75,
    cliente: "Condomínio Green Park"
  }
];

const Producao = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  
  // Filtrar ordens com base na busca e filtros
  const ordensFiltradas = ordens.filter(ordem => {
    const matchesSearch = ordem.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ordem.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filtroStatus ? ordem.status === filtroStatus : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Formatação para data
  const formatarData = (data: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };
  
  // Obter texto e cor do status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planejamento":
        return { text: "Planejamento", className: "bg-blue-100 text-blue-800" };
      case "aguardando":
        return { text: "Aguardando", className: "bg-purple-100 text-purple-800" };
      case "em_andamento":
        return { text: "Em andamento", className: "bg-amber-100 text-amber-800" };
      case "concluido":
        return { text: "Concluído", className: "bg-emerald-100 text-emerald-800" };
      case "atrasado":
        return { text: "Atrasado", className: "bg-red-100 text-red-800" };
      default:
        return { text: "Desconhecido", className: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Produção</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem de Produção
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ordens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordens.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordens.filter(o => o.status === "em_andamento").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordens.filter(o => o.status === "concluido").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{ordens.filter(o => o.status === "atrasado").length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="ordens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ordens">Ordens de Produção</TabsTrigger>
          <TabsTrigger value="programacao">Programação</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ordens">
          <Card>
            <CardHeader>
              <CardTitle>Ordens de Produção</CardTitle>
              <CardDescription>Gerencie as ordens de produção em andamento e planejadas</CardDescription>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar ordens por ID, produto ou cliente..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="flex">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="hidden md:table-cell">Quantidade</TableHead>
                      <TableHead className="hidden lg:table-cell">Data Previsão</TableHead>
                      <TableHead className="hidden md:table-cell">Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Progresso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordensFiltradas.map(ordem => {
                      const { text, className } = getStatusBadge(ordem.status);
                      return (
                        <TableRow key={ordem.id}>
                          <TableCell className="font-medium">{ordem.id}</TableCell>
                          <TableCell>{ordem.produto}</TableCell>
                          <TableCell className="hidden md:table-cell">{ordem.quantidade} {ordem.unidade}</TableCell>
                          <TableCell className="hidden lg:table-cell">{formatarData(ordem.dataPrevisao)}</TableCell>
                          <TableCell className="hidden md:table-cell">{ordem.cliente}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={className}>
                              {text}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress value={ordem.progresso} className="h-2" />
                              <span className="text-xs">{ordem.progresso}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {ordensFiltradas.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Nenhuma ordem de produção encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="rounded-full bg-red-100 p-2">
                      <AlertCircle className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-800">Atenção para Ordens Atrasadas</h3>
                      <p className="text-sm text-red-700">
                        {ordens.filter(o => o.status === "atrasado").length} ordens de produção estão atrasadas.
                        É necessário revisar o cronograma de produção.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="programacao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Programação de Produção
              </CardTitle>
              <CardDescription>
                Visualize e gerencie o cronograma de produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">O módulo de programação será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recursos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Alocação de Recursos
              </CardTitle>
              <CardDescription>
                Gerencie a disponibilidade e alocação de recursos da produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">O módulo de recursos será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" />
                Relatórios de Produção
              </CardTitle>
              <CardDescription>
                Visualize relatórios e métricas de produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">O módulo de relatórios será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Producao;
