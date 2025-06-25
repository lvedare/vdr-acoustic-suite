
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, FileText, Hammer, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Cronograma = () => {
  // Dados de exemplo para obras em andamento
  const obrasAndamento = [
    {
      id: 1,
      nome: "Obra - Residencial Vila Nova",
      tipo: "obra",
      cliente: "João Silva",
      status: "em_andamento",
      dataInicio: "2025-02-15",
      dataPrevisao: "2025-05-20",
      progresso: 65,
      responsavel: "Equipe A",
      prioridade: "alta"
    },
    {
      id: 2,
      nome: "Obra - Edifício Comercial Centro",
      tipo: "obra", 
      cliente: "Construtora ABC",
      status: "planejamento",
      dataInicio: "2025-03-01",
      dataPrevisao: "2025-07-15",
      progresso: 10,
      responsavel: "Equipe B",
      prioridade: "media"
    }
  ];

  // Dados de exemplo para produção em andamento
  const producaoAndamento = [
    {
      id: "OP-2025-001",
      nome: "Painel Acústico 60mm",
      tipo: "producao",
      cliente: "Studio XYZ",
      status: "em_andamento",
      dataInicio: "2025-05-05",
      dataPrevisao: "2025-05-15",
      progresso: 45,
      responsavel: "João Silva",
      prioridade: "alta"
    },
    {
      id: "OP-2025-002",
      nome: "Porta Acústica 40dB",
      tipo: "producao",
      cliente: "Clínica Saúde Total",
      status: "aguardando",
      dataInicio: "2025-05-07",
      dataPrevisao: "2025-05-20",
      progresso: 0,
      responsavel: "Ana Costa",
      prioridade: "media"
    },
    {
      id: "OP-2025-005",
      nome: "Isolamento Acústico Especial",
      tipo: "producao",
      cliente: "Condomínio Green Park",
      status: "atrasado",
      dataInicio: "2025-04-20",
      dataPrevisao: "2025-05-05",
      progresso: 75,
      responsavel: "Ana Costa",
      prioridade: "critica"
    }
  ];

  // Combinar todos os itens
  const todosItens = [...obrasAndamento, ...producaoAndamento];

  // Formatação para data
  const formatarData = (data: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Obter cor do status
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obter cor da prioridade
  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "critica":
        return "bg-red-500 text-white";
      case "alta":
        return "bg-orange-500 text-white";
      case "media":
        return "bg-yellow-500 text-white";
      case "baixa":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Calcular dias restantes
  const calcularDiasRestantes = (dataPrevisao: string) => {
    const hoje = new Date();
    const previsao = new Date(dataPrevisao);
    const diferenca = Math.ceil((previsao.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diferenca;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Cronograma Geral</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Exportar Cronograma
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todosItens.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todosItens.filter(i => i.status === "em_andamento").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todosItens.filter(i => i.status === "atrasado").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{todosItens.filter(i => i.prioridade === "critica").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Cronograma Integrado - Obras e Produção
          </CardTitle>
          <CardDescription>
            Visualização unificada de todas as obras e ordens de produção em andamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome/ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead>Dias Restantes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todosItens.map((item) => {
                  const diasRestantes = calcularDiasRestantes(item.dataPrevisao);
                  
                  return (
                    <TableRow key={`${item.tipo}-${item.id}`}>
                      <TableCell>
                        <div className="flex items-center">
                          {item.tipo === "obra" ? (
                            <Hammer className="h-4 w-4 mr-2 text-blue-600" />
                          ) : (
                            <FileText className="h-4 w-4 mr-2 text-green-600" />
                          )}
                          <span className="capitalize">{item.tipo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>{item.cliente}</TableCell>
                      <TableCell>{item.responsavel}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(item.status)}>
                          {item.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPrioridadeColor(item.prioridade)}>
                          {item.prioridade.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.progresso} className="h-2 w-16" />
                          <span className="text-xs">{item.progresso}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatarData(item.dataPrevisao)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {diasRestantes < 0 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={diasRestantes < 0 ? "text-red-600 font-medium" : 
                                         diasRestantes <= 7 ? "text-orange-600 font-medium" : ""}>
                            {diasRestantes < 0 ? `${Math.abs(diasRestantes)} dias atrasado` : 
                             diasRestantes === 0 ? "Hoje" :
                             `${diasRestantes} dias`}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Prioridades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Itens Críticos e Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todosItens
                .filter(item => item.status === "atrasado" || item.prioridade === "critica")
                .map(item => (
                  <div key={`${item.tipo}-${item.id}`} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      {item.tipo === "obra" ? (
                        <Hammer className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium">{item.nome}</span>
                    </div>
                    <Badge className={item.status === "atrasado" ? "bg-red-500" : "bg-orange-500"}>
                      {item.status === "atrasado" ? "ATRASADO" : "CRÍTICO"}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Próximos Prazos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todosItens
                .filter(item => {
                  const dias = calcularDiasRestantes(item.dataPrevisao);
                  return dias >= 0 && dias <= 7;
                })
                .sort((a, b) => calcularDiasRestantes(a.dataPrevisao) - calcularDiasRestantes(b.dataPrevisao))
                .map(item => (
                  <div key={`${item.tipo}-${item.id}`} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      {item.tipo === "obra" ? (
                        <Hammer className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium">{item.nome}</span>
                    </div>
                    <span className="text-sm text-orange-600 font-medium">
                      {calcularDiasRestantes(item.dataPrevisao) === 0 ? "Hoje" : `${calcularDiasRestantes(item.dataPrevisao)} dias`}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cronograma;
