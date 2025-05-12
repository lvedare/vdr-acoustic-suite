
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Filter, FileText, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Obras = () => {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const mockObras = [
    {
      id: 1,
      nome: "Edifício Residencial Parque das Flores",
      endereco: "Av. Principal, 1500, Centro",
      cliente: "Construtora Prima",
      status: "em_andamento",
      dataInicio: "2025-01-10",
      dataPrevisao: "2025-07-20",
    },
    {
      id: 2,
      nome: "Complexo Comercial Downtown",
      endereco: "Rua das Palmeiras, 500, Jardim",
      cliente: "Incorporadora Visão",
      status: "planejamento",
      dataInicio: "2025-04-15",
      dataPrevisao: "2025-12-30",
    },
    {
      id: 3,
      nome: "Resort Villa Mar",
      endereco: "Estrada da Praia, km 5",
      cliente: "Grupo Hoteleiro Solar",
      status: "concluido",
      dataInicio: "2024-06-10",
      dataPrevisao: "2025-02-28",
      dataConclusao: "2025-02-20",
    },
  ];

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    planejamento: { label: "Planejamento", variant: "secondary" },
    em_andamento: { label: "Em Andamento", variant: "default" },
    concluido: { label: "Concluído", variant: "outline" },
    cancelado: { label: "Cancelado", variant: "destructive" },
  };

  const filteredObras = mockObras.filter(obra => {
    if (filter !== "todos" && obra.status !== filter) return false;
    if (search && !obra.nome.toLowerCase().includes(search.toLowerCase()) && 
        !obra.cliente.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Obras</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Obra
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockObras.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockObras.filter(p => p.status === "em_andamento").length}</div>
                <div className="text-sm text-muted-foreground">Em Andamento</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockObras.filter(p => p.status === "planejamento").length}</div>
                <div className="text-sm text-muted-foreground">Planejamento</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockObras.filter(p => p.status === "concluido").length}</div>
                <div className="text-sm text-muted-foreground">Concluídas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Lista de Obras</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Buscar obra..." 
                  className="w-full sm:w-auto" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-auto">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluídas</SelectItem>
                      <SelectItem value="cancelado">Canceladas</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhuma obra encontrada com os filtros atuais.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredObras.map((obra) => (
                    <TableRow key={obra.id}>
                      <TableCell className="font-medium">{obra.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {obra.endereco}
                        </div>
                      </TableCell>
                      <TableCell>{obra.cliente}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatarData(obra.dataInicio)}
                        </div>
                      </TableCell>
                      <TableCell>{formatarData(obra.dataPrevisao)}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[obra.status].variant}>
                          {statusMap[obra.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Obras;
