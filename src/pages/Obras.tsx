
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  Search
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data
const obras = [
  {
    id: 1,
    nome: "Tratamento Acústico - Escritório ABC",
    cliente: "Empresa ABC",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    dataInicio: "2025-05-15",
    dataPrevisaoTermino: "2025-06-10",
    responsavel: "João Silva",
    status: "em_andamento",
    progresso: 35
  },
  {
    id: 2,
    nome: "Isolamento Acústico - Studio XYZ",
    cliente: "Studio XYZ",
    endereco: "Rua Augusta, 1500",
    cidade: "São Paulo",
    estado: "SP",
    dataInicio: "2025-06-01",
    dataPrevisaoTermino: "2025-07-15",
    responsavel: "Maria Oliveira",
    status: "planejamento",
    progresso: 0
  },
  {
    id: 3,
    nome: "Redução de Ruído - Restaurante",
    cliente: "Restaurante Boa Mesa",
    endereco: "Av. Brasil, 500",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    dataInicio: "2025-04-15",
    dataPrevisaoTermino: "2025-04-30",
    dataTerminoReal: "2025-05-05",
    responsavel: "Pedro Almeida",
    status: "concluida",
    progresso: 100
  }
];

const Obras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Filter obras based on search and filter
  const obrasFiltradas = obras.filter(obra => {
    const matchesSearch = 
      obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filtroStatus) {
      return matchesSearch && obra.status === filtroStatus;
    }
    
    return matchesSearch;
  });
  
  // Format date
  const formatarData = (data: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };
  
  // Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planejamento":
        return "bg-blue-100 text-blue-800";
      case "em_andamento":
        return "bg-amber-100 text-amber-800";
      case "pausada":
        return "bg-purple-100 text-purple-800";
      case "concluida":
        return "bg-emerald-100 text-emerald-800";
      case "atrasada":
        return "bg-red-100 text-red-800";
      case "cancelada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Status text
  const getStatusTexto = (status: string) => {
    switch (status) {
      case "planejamento": return "Planejamento";
      case "em_andamento": return "Em Andamento";
      case "pausada": return "Pausada";
      case "concluida": return "Concluída";
      case "atrasada": return "Atrasada";
      case "cancelada": return "Cancelada";
      default: return status;
    }
  };
  
  // Count obras by status
  const contarObras = (status: string) => {
    return obras.filter(o => o.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Obras</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Obra
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obras.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarObras("em_andamento")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Planejamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarObras("planejamento")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarObras("concluida")}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar obras por nome, cliente ou cidade..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filtroStatus || ""}
          onValueChange={(value) => setFiltroStatus(value === "" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <span>{filtroStatus ? getStatusTexto(filtroStatus) : "Todos os Status"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os Status</SelectItem>
            <SelectItem value="planejamento">Planejamento</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="pausada">Pausada</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="atrasada">Atrasada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Obra</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="hidden md:table-cell">Data Início</TableHead>
              <TableHead className="hidden md:table-cell">Previsão Término</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Progresso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obrasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-16 text-center">
                  Nenhuma obra encontrada.
                </TableCell>
              </TableRow>
            ) : (
              obrasFiltradas.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell>{obra.nome}</TableCell>
                  <TableCell>{obra.cliente}</TableCell>
                  <TableCell>
                    {obra.cidade}/{obra.estado}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatarData(obra.dataInicio)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatarData(obra.dataPrevisaoTermino)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(obra.status)} variant="secondary">
                      {getStatusTexto(obra.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={obra.progresso} className="h-2" />
                      <span className="text-xs whitespace-nowrap">{obra.progresso}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Obras
          </CardTitle>
          <CardDescription>Visualize a localização das obras ativas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">
              Mapa de obras será implementado em breve
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Obras;
