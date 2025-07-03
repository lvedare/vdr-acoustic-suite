
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { OrdemProducaoFromProposta } from "@/components/producao/OrdemProducaoFromProposta";
import { ProducaoDialog } from "@/components/producao/ProducaoDialog";
import { useOrdensProducao } from "@/hooks/useSupabaseModules";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { ProducaoSummaryCards } from "@/components/producao/ProducaoSummaryCards";
import { ProducaoFilterBar } from "@/components/producao/ProducaoFilterBar";

interface OrdemExemplo {
  id: string;
  numero: string;
  produto: string;
  quantidade: number;
  unidade: string;
  status: string;
  progresso: number;
  dataInicio: string;
  dataPrevisao: string;
  responsavel: string;
  cliente: string;
}

const Producao = () => {
  const { ordensProducao, excluirOrdem, isLoading } = useOrdensProducao();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ordemToDelete, setOrdemToDelete] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Dados de exemplo para ordens de produção
  const ordensExemplo: OrdemExemplo[] = [
    {
      id: "OP-2025-001",
      numero: "OP-2025-001",
      produto: "Painel Acústico 60mm",
      quantidade: 10,
      unidade: "pç",
      status: "em_andamento",
      progresso: 45,
      dataInicio: "2025-05-05",
      dataPrevisao: "2025-05-15",
      responsavel: "João Silva",
      cliente: "Studio XYZ"
    },
    {
      id: "OP-2025-002", 
      numero: "OP-2025-002",
      produto: "Porta Acústica 40dB",
      quantidade: 2,
      unidade: "pç",
      status: "aguardando",
      progresso: 0,
      dataInicio: "2025-05-07",
      dataPrevisao: "2025-05-20",
      responsavel: "Ana Costa",
      cliente: "Clínica Saúde Total"
    },
    {
      id: "OP-2025-003",
      numero: "OP-2025-003", 
      produto: "Espuma Acústica",
      quantidade: 50,
      unidade: "m²",
      status: "concluido",
      progresso: 100,
      dataInicio: "2025-04-20",
      dataPrevisao: "2025-05-01",
      responsavel: "Carlos Santos",
      cliente: "Empresa ABC"
    },
    {
      id: "OP-2025-004",
      numero: "OP-2025-004",
      produto: "Divisória Acústica",
      quantidade: 5,
      unidade: "pç", 
      status: "planejamento",
      progresso: 0,
      dataInicio: null,
      dataPrevisao: "2025-05-25",
      responsavel: "Maria Silva",
      cliente: "Escritório Tech"
    },
    {
      id: "OP-2025-005",
      numero: "OP-2025-005",
      produto: "Isolamento Acústico Especial",
      quantidade: 30,
      unidade: "m²",
      status: "atrasado",
      progresso: 75,
      dataInicio: "2025-04-20",
      dataPrevisao: "2025-05-05",
      responsavel: "Ana Costa",
      cliente: "Condomínio Green Park"
    }
  ];

  // Combinar ordens do Supabase com ordens de exemplo
  const todasOrdens = [...ordensExemplo, ...ordensProducao];

  // Filtrar ordens
  const ordensFiltradas = todasOrdens.filter(ordem => {
    const matchesSearch = 
      ordem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProdutoName(ordem).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClienteName(ordem).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || ordem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (ordem: any) => {
    setOrdemToDelete(ordem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (ordemToDelete) {
      try {
        if (ordemToDelete.id.includes('OP-2025')) {
          // Ordem de exemplo - apenas remove da visualização
          toast.success("Ordem de produção excluída com sucesso!");
        } else {
          // Ordem do Supabase
          await excluirOrdem(ordemToDelete.id);
        }
        setDeleteDialogOpen(false);
        setOrdemToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir ordem:', error);
        toast.error("Erro ao excluir ordem de produção");
      }
    }
  };

  const formatarData = (data: string | null) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

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

  const handleViewDetails = (ordem: any) => {
    setSelectedOrdem(ordem);
    setDialogOpen(true);
  };

  const handleEdit = (ordem: any) => {
    setSelectedOrdem(ordem);
    setDialogOpen(true);
  };

  const getProdutoName = (ordem: any) => {
    return ordem.produto || (ordem.produtos_acabados ? ordem.produtos_acabados.nome : 'Produto não encontrado');
  };

  const getClienteName = (ordem: any) => {
    return ordem.cliente || 'Cliente não informado';
  };

  const getUnidade = (ordem: any) => {
    return ordem.unidade || (ordem.produtos_acabados ? ordem.produtos_acabados.unidade_medida : 'un');
  };

  const getProgresso = (ordem: any) => {
    return ordem.progresso || 0;
  };

  const getDataPrevisao = (ordem: any) => {
    return ordem.dataPrevisao || ordem.data_previsao;
  };

  const getResponsavel = (ordem: any) => {
    return ordem.responsavel || 'Não atribuído';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Produção</h1>
      </div>

      <ProducaoSummaryCards ordens={todasOrdens} />

      <Tabs defaultValue="propostas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="propostas">
            <FileText className="mr-2 h-4 w-4" />
            Criar da Proposta
          </TabsTrigger>
          <TabsTrigger value="ordens">Lista de Ordens</TabsTrigger>
        </TabsList>

        <TabsContent value="propostas">
          <OrdemProducaoFromProposta />
        </TabsContent>

        <TabsContent value="ordens">
          <Card>
            <CardHeader>
              <CardTitle>Ordens de Produção</CardTitle>
              <CardDescription>
                Gerencie todas as ordens de produção ativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProducaoFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Previsão</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                   <TableBody>
                     {ordensFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Nenhuma ordem de produção encontrada.
                        </TableCell>
                      </TableRow>
                     ) : (
                       ordensFiltradas.map((ordem) => (
                        <TableRow key={ordem.id}>
                          <TableCell className="font-medium">{ordem.numero}</TableCell>
                          <TableCell>{getProdutoName(ordem)}</TableCell>
                          <TableCell>{getClienteName(ordem)}</TableCell>
                          <TableCell>{ordem.quantidade} {getUnidade(ordem)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(ordem.status)}>
                              {ordem.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={getProgresso(ordem)} className="h-2 w-16" />
                              <span className="text-xs">{getProgresso(ordem)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatarData(getDataPrevisao(ordem))}</TableCell>
                          <TableCell>{getResponsavel(ordem)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleViewDetails(ordem)}
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEdit(ordem)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteClick(ordem)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Ordem de Produção"
        itemName={ordemToDelete?.numero}
      />

      <ProducaoDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        ordem={selectedOrdem}
      />
    </div>
  );
};

export default Producao;
