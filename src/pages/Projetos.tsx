
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Filter } from "lucide-react";
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

const Projetos = () => {
  const [filter, setFilter] = React.useState("todos");
  const [search, setSearch] = React.useState("");

  const mockProjetos = [
    {
      id: 1,
      nome: "Projeto Residencial Vila Nova",
      cliente: "João Silva",
      status: "em_andamento",
      tipo: "residencial",
      dataInicio: "2025-02-15",
      dataPrevisao: "2025-05-20",
    },
    {
      id: 2,
      nome: "Edifício Comercial Centro",
      cliente: "Construtora ABC",
      status: "concluido",
      tipo: "comercial",
      dataInicio: "2024-10-05",
      dataPrevisao: "2025-03-10",
      dataConclusao: "2025-03-08",
    },
    {
      id: 3,
      nome: "Reforma Apartamento 302",
      cliente: "Maria Oliveira",
      status: "planejamento",
      tipo: "reforma",
      dataInicio: "2025-06-01",
      dataPrevisao: "2025-07-30",
    },
  ];

  const statusMap: Record<string, { label: string; variant: "default" | "success" | "secondary" | "outline" }> = {
    planejamento: { label: "Planejamento", variant: "secondary" },
    em_andamento: { label: "Em Andamento", variant: "default" },
    concluido: { label: "Concluído", variant: "success" },
    cancelado: { label: "Cancelado", variant: "outline" },
  };

  const filteredProjetos = mockProjetos.filter(projeto => {
    if (filter !== "todos" && projeto.status !== filter) return false;
    if (search && !projeto.nome.toLowerCase().includes(search.toLowerCase()) && 
        !projeto.cliente.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
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
                <div className="text-2xl font-bold">{mockProjetos.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockProjetos.filter(p => p.status === "em_andamento").length}</div>
                <div className="text-sm text-muted-foreground">Em Andamento</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockProjetos.filter(p => p.status === "planejamento").length}</div>
                <div className="text-sm text-muted-foreground">Planejamento</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{mockProjetos.filter(p => p.status === "concluido").length}</div>
                <div className="text-sm text-muted-foreground">Concluídos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Lista de Projetos</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Buscar projeto..." 
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
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluídos</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhum projeto encontrado com os filtros atuais.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjetos.map((projeto) => (
                    <TableRow key={projeto.id}>
                      <TableCell className="font-medium">{projeto.nome}</TableCell>
                      <TableCell>{projeto.cliente}</TableCell>
                      <TableCell className="capitalize">{projeto.tipo}</TableCell>
                      <TableCell>{formatarData(projeto.dataInicio)}</TableCell>
                      <TableCell>{formatarData(projeto.dataPrevisao)}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[projeto.status].variant}>
                          {statusMap[projeto.status].label}
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

export default Projetos;
