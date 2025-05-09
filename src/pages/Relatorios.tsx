
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as ChartIcon, 
  Calendar, 
  Check, 
  Download, 
  FileText, 
  Filter, 
  LineChart as LineChartIcon, 
  PieChart, 
  Printer, 
  Search, 
  Table as TableIcon, 
  User 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { Label } from "@/components/ui/label";

// Mock data
const dadosVendasPorMes = [
  { mes: "Jan", valor: 45000 },
  { mes: "Fev", valor: 48000 },
  { mes: "Mar", valor: 52000 },
  { mes: "Abr", valor: 58000 },
  { mes: "Mai", valor: 66300 },
];

const topClientes = [
  { id: 1, nome: "Empresa ABC", contato: "João Silva", email: "contato@empresaabc.com", telefone: "(11) 98765-4321", totalCompras: 45000, ultimaCompra: "2025-05-01" },
  { id: 2, nome: "Studio XYZ", contato: "Maria Oliveira", email: "maria@studioxyz.com", telefone: "(11) 91234-5678", totalCompras: 28500, ultimaCompra: "2025-05-10" },
  { id: 3, nome: "Restaurante Boa Mesa", contato: "Pedro Almeida", email: "pedro@boamesa.com", telefone: "(21) 98888-7777", totalCompras: 22800, ultimaCompra: "2025-04-15" }
];

const Relatorios = () => {
  const [periodo, setPeriodo] = useState("ultimo-mes");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Verificar se há parâmetros na URL para exibir relatórios específicos
  const params = new URLSearchParams(location.search);
  const tipoRelatorio = params.get('tipo');
  const reportName = params.get('report');
  
  // Define a aba inicial com base nos parâmetros da URL
  const getInitialTab = () => {
    if (tipoRelatorio === 'financeiro') {
      return 'financeiro';
    } else if (reportName === 'estoque') {
      return 'estoque';
    }
    return 'vendas';
  };
  
  const [tabAtiva, setTabAtiva] = useState(getInitialTab());
  
  // Formatar valor para moeda
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };
  
  // Formatar data
  const formatarData = (data: string): string => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };
  
  // Filtra os clientes de acordo com o termo de busca
  const clientesFiltrados = topClientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.contato.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Exportar relatório
  const exportarRelatorio = (tipoRelatorio: string) => {
    toast.info(`Exportando relatório de ${tipoRelatorio}...`);
    setTimeout(() => {
      toast.success(`Relatório de ${tipoRelatorio} exportado com sucesso!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>
      
      <Tabs defaultValue={tabAtiva} onValueChange={setTabAtiva} className="space-y-4">
        <TabsList className="grid grid-cols-1 sm:grid-cols-5">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="producao">Produção</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="text-sm">Período:</div>
            <Select
              value={periodo}
              onValueChange={setPeriodo}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ultimo-mes">Último Mês</SelectItem>
                <SelectItem value="ultimo-trimestre">Último Trimestre</SelectItem>
                <SelectItem value="ultimo-semestre">Último Semestre</SelectItem>
                <SelectItem value="ultimo-ano">Último Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => exportarRelatorio(tabAtiva)}
          >
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
        
        <TabsContent value="vendas">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
                <CardDescription>Análise mensal de receita de vendas</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosVendasPorMes}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                    <Legend />
                    <Bar dataKey="valor" name="Vendas" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Vendas</CardTitle>
                <CardDescription>Valores e métricas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Vendas</p>
                  <p className="text-3xl font-bold">{formatarMoeda(dadosVendasPorMes.reduce((acc, item) => acc + item.valor, 0))}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Média Mensal</p>
                  <p className="text-2xl font-medium">{formatarMoeda(dadosVendasPorMes.reduce((acc, item) => acc + item.valor, 0) / dadosVendasPorMes.length)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Crescimento</p>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                      +15% comparado ao período anterior
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Principais Clientes</CardTitle>
                    <CardDescription>Clientes com maior volume de compras</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden md:table-cell">Contato</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Total de Compras</TableHead>
                      <TableHead>Última Compra</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.contato}</TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.email}</TableCell>
                        <TableCell>{formatarMoeda(cliente.totalCompras)}</TableCell>
                        <TableCell>{formatarData(cliente.ultimaCompra)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/clientes?id=${cliente.id}`)}>
                            Ver detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>Demonstrações financeiras e análises</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <LineChartIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Relatórios Financeiros</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Os relatórios financeiros detalhados serão implementados em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="estoque">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Estoque</CardTitle>
              <CardDescription>Análise de movimentação e níveis de estoque</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <ChartIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Relatórios de Estoque</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Os relatórios de estoque detalhados serão implementados em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="producao">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Produção</CardTitle>
              <CardDescription>Análise de eficiência e produtividade</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <TableIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Relatórios de Produção</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Os relatórios de produção detalhados serão implementados em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Clientes</CardTitle>
              <CardDescription>Segmentação e análise de clientes</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <User className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Relatórios de Clientes</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Os relatórios de clientes detalhados serão implementados em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
