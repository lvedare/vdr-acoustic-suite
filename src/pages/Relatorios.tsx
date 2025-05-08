
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { 
  BarChart3,
  Calendar,
  Clock,
  Download,
  FileSpreadsheet,
  FileSvg,
  FileText,
  Hammer,
  Package,
  Printer,
  Share2,
  Table as TableIcon,
  User,
  LineChart as LineChartIcon,
  Wallet,
  Timer,
  Package2,
  Calendar as CalendarIcon
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff', '#8884d8'];

// Dados mockados para os gráficos
const dadosVendas = [
  { mes: "Jan", vendas: 75000 },
  { mes: "Fev", vendas: 85000 },
  { mes: "Mar", vendas: 95000 },
  { mes: "Abr", vendas: 110000 },
  { mes: "Mai", vendas: 98000 },
];

const dadosProducao = [
  { mes: "Jan", concluidas: 15, emAndamento: 8, pendentes: 3 },
  { mes: "Fev", concluidas: 18, emAndamento: 6, pendentes: 5 },
  { mes: "Mar", concluidas: 22, emAndamento: 10, pendentes: 4 },
  { mes: "Abr", concluidas: 25, emAndamento: 7, pendentes: 6 },
  { mes: "Mai", concluidas: 19, emAndamento: 12, pendentes: 8 },
];

const dadosClientes = [
  { segmento: "Escritórios", valor: 150000 },
  { segmento: "Estúdios", valor: 120000 },
  { segmento: "Residencial", valor: 80000 },
  { segmento: "Restaurantes", valor: 70000 },
  { segmento: "Clínicas", valor: 65000 },
  { segmento: "Outros", valor: 45000 },
];

const Relatorios = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("mes");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  
  const handleExportarRelatorio = (tipo: string) => {
    toast.success(`Relatório ${tipo} exportado com sucesso!`);
  };
  
  const handleImprimirRelatorio = () => {
    toast.success("Enviando relatório para impressão...");
  };
  
  // Formatar valor para moeda
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImprimirRelatorio}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Select
            defaultValue="excel"
            onValueChange={(value) => handleExportarRelatorio(value)}
          >
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                <span>Exportar</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Selecione o período para os relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={periodoSelecionado}
              onValueChange={setPeriodoSelecionado}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Último Mês</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="semestre">Último Semestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            
            {periodoSelecionado === "personalizado" && (
              <>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicial">Data Inicial</Label>
                    <Input 
                      id="dataInicial" 
                      type="date" 
                      value={dataInicial}
                      onChange={(e) => setDataInicial(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataFinal">Data Final</Label>
                    <Input 
                      id="dataFinal" 
                      type="date" 
                      value={dataFinal}
                      onChange={(e) => setDataFinal(e.target.value)}
                    />
                  </div>
                </div>
                <Button className="self-end">Aplicar</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="producao">Produção</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        
        {/* Tab de Vendas */}
        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Vendas Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatarMoeda(dadosVendas.reduce((total, item) => total + item.vendas, 0))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Package2 className="mr-2 h-4 w-4" />
                  Total de Propostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Taxa de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Volume de Vendas
                </CardTitle>
                <CardDescription>
                  Evolução do volume de vendas por período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={dadosVendas}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Vendas']} />
                      <Legend />
                      <Bar 
                        dataKey="vendas" 
                        name="Vendas (R$)" 
                        fill="#0088FE" 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                  Desempenho de Propostas
                </CardTitle>
                <CardDescription>
                  Status das propostas enviadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Aprovadas", value: 32 },
                          { name: "Pendentes", value: 15 },
                          { name: "Rejeitadas", value: 8 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {[
                          { name: "Aprovadas", value: 32 },
                          { name: "Pendentes", value: 15 },
                          { name: "Rejeitadas", value: 8 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TableIcon className="h-5 w-5 text-muted-foreground" />
                  Relatórios Disponíveis
                </CardTitle>
                <CardDescription>
                  Selecione um relatório para visualização detalhada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-blue-100 p-2">
                        <FileSpreadsheet className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Análise de Vendas</h3>
                        <p className="text-sm text-muted-foreground">Desempenho detalhado</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-emerald-100 p-2">
                        <FileText className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Propostas por Cliente</h3>
                        <p className="text-sm text-muted-foreground">Análise por cliente</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-purple-100 p-2">
                        <FileSvg className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Taxa de Conversão</h3>
                        <p className="text-sm text-muted-foreground">Propostas vs. Vendas</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Financeiro */}
        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">
                  {formatarMoeda(463000)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% comparado ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {formatarMoeda(320000)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +5% comparado ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lucro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {formatarMoeda(143000)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +18% comparado ao período anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                  Fluxo de Caixa
                </CardTitle>
                <CardDescription>
                  Comparativo de receitas e despesas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { mes: "Jan", receitas: 75000, despesas: 60000 },
                        { mes: "Fev", receitas: 85000, despesas: 62000 },
                        { mes: "Mar", receitas: 95000, despesas: 65000 },
                        { mes: "Abr", receitas: 110000, despesas: 70000 },
                        { mes: "Mai", receitas: 98000, despesas: 63000 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="receitas" 
                        name="Receitas" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="despesas" 
                        name="Despesas" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Despesas por Categoria
                </CardTitle>
                <CardDescription>
                  Distribuição das despesas no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      layout="vertical"
                      data={[
                        { categoria: "Materiais", valor: 120000 },
                        { categoria: "Pessoal", valor: 95000 },
                        { categoria: "Impostos", valor: 45000 },
                        { categoria: "Operacional", valor: 35000 },
                        { categoria: "Marketing", valor: 25000 },
                      ]}
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="categoria" type="category" />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                      <Legend />
                      <Bar dataKey="valor" name="Valor (R$)" fill="#a64dff" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Produção */}
        <TabsContent value="producao" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Hammer className="mr-2 h-4 w-4" />
                  Total de Ordens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dadosProducao.reduce((total, item) => total + item.concluidas + item.emAndamento + item.pendentes, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Concluídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">
                  {dadosProducao.reduce((total, item) => total + item.concluidas, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {dadosProducao.reduce((total, item) => total + item.emAndamento, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  Tempo Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  12,5 dias
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Volume de Produção
                </CardTitle>
                <CardDescription>
                  Ordens de produção por status e período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={dadosProducao}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="concluidas" name="Concluídas" stackId="a" fill="#10b981" />
                      <Bar dataKey="emAndamento" name="Em Andamento" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="pendentes" name="Pendentes" stackId="a" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                  Eficiência da Produção
                </CardTitle>
                <CardDescription>
                  Tempo médio de produção por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      layout="vertical"
                      data={[
                        { categoria: "Painéis Acústicos", dias: 7 },
                        { categoria: "Difusores", dias: 12 },
                        { categoria: "Portas Acústicas", dias: 15 },
                        { categoria: "Baffles", dias: 5 },
                        { categoria: "Bass Traps", dias: 9 },
                      ]}
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="categoria" type="category" />
                      <Tooltip formatter={(value) => [`${value} dias`, 'Tempo Médio']} />
                      <Legend />
                      <Bar dataKey="dias" name="Dias" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Estoque */}
        <TabsContent value="estoque" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Valor Total em Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatarMoeda(98750.50)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Itens com Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-700">
                  12
                  <span className="text-xs font-normal text-muted-foreground ml-2">itens</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Movimentações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  56
                  <span className="text-xs font-normal text-muted-foreground ml-2">nos últimos 30 dias</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Valor em Estoque por Categoria
                </CardTitle>
                <CardDescription>
                  Distribuição do valor em estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { categoria: "Isolantes", valor: 32500 },
                        { categoria: "Estruturas", valor: 21450 },
                        { categoria: "Absorvedores", valor: 18700 },
                        { categoria: "Fixações", valor: 12100 },
                        { categoria: "Vedantes", valor: 8200 },
                        { categoria: "Portas e Janelas", valor: 5800 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                      <Legend />
                      <Bar dataKey="valor" name="Valor em Estoque" fill="#0088FE" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                  Consumo de Materiais
                </CardTitle>
                <CardDescription>
                  Materiais mais utilizados no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { nome: "Lã de Rocha 50mm", valor: 28 },
                          { nome: "Perfil Metálico F530", valor: 22 },
                          { nome: "MDF Perfurado", valor: 18 },
                          { nome: "Tecido Acústico", valor: 12 },
                          { nome: "Espuma Acústica", valor: 10 },
                          { nome: "Outros", valor: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="valor"
                        nameKey="nome"
                        label={({nome, percent}) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { nome: "Lã de Rocha 50mm", valor: 28 },
                          { nome: "Perfil Metálico F530", valor: 22 },
                          { nome: "MDF Perfurado", valor: 18 },
                          { nome: "Tecido Acústico", valor: 12 },
                          { nome: "Espuma Acústica", valor: 10 },
                          { nome: "Outros", valor: 10 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="h-5 w-5 text-muted-foreground" />
                Relatórios de Estoque
              </CardTitle>
              <CardDescription>
                Relatórios detalhados sobre o estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-md bg-amber-100 p-2">
                      <FileText className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Estoque Baixo</h3>
                      <p className="text-sm text-muted-foreground">Itens para reposição</p>
                    </div>
                    <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-md bg-blue-100 p-2">
                      <FileSpreadsheet className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Movimentações</h3>
                      <p className="text-sm text-muted-foreground">Entradas e saídas</p>
                    </div>
                    <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-md bg-emerald-100 p-2">
                      <FileSvg className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Inventário Geral</h3>
                      <p className="text-sm text-muted-foreground">Listagem completa</p>
                    </div>
                    <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab de Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Total de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  124
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Share2 className="mr-2 h-4 w-4" />
                  Novos Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  18
                  <span className="text-xs font-normal text-muted-foreground ml-2">nos últimos 30 dias</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cliente Mais Rentável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Empresa ABC
                  <div className="text-sm font-normal text-muted-foreground">
                    {formatarMoeda(45000)} em compras
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Vendas por Segmento de Cliente
                </CardTitle>
                <CardDescription>
                  Distribuição das vendas por tipo de cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosClientes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="valor"
                        nameKey="segmento"
                        label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {dadosClientes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                  Retenção de Clientes
                </CardTitle>
                <CardDescription>
                  Retorno de clientes para novas compras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { mes: "Jan", novos: 12, retorno: 8 },
                        { mes: "Fev", novos: 15, retorno: 10 },
                        { mes: "Mar", novos: 10, retorno: 12 },
                        { mes: "Abr", novos: 18, retorno: 15 },
                        { mes: "Mai", novos: 14, retorno: 18 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="novos" 
                        name="Novos Clientes" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="retorno" 
                        name="Clientes Retorno" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="h-5 w-5 text-muted-foreground" />
                Top 5 Clientes por Volume de Compras
              </CardTitle>
              <CardDescription>
                Clientes com maior volume de negócios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Cliente</th>
                      <th className="py-3 px-4 text-left font-medium">Segmento</th>
                      <th className="py-3 px-4 text-right font-medium">Compras Realizadas</th>
                      <th className="py-3 px-4 text-right font-medium">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Empresa ABC</td>
                      <td className="py-3 px-4">Escritórios</td>
                      <td className="py-3 px-4 text-right">7</td>
                      <td className="py-3 px-4 text-right">{formatarMoeda(45000)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Studio XYZ</td>
                      <td className="py-3 px-4">Estúdios</td>
                      <td className="py-3 px-4 text-right">3</td>
                      <td className="py-3 px-4 text-right">{formatarMoeda(38500)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Condomínio Green Park</td>
                      <td className="py-3 px-4">Residencial</td>
                      <td className="py-3 px-4 text-right">1</td>
                      <td className="py-3 px-4 text-right">{formatarMoeda(32000)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Clínica Saúde Total</td>
                      <td className="py-3 px-4">Clínicas</td>
                      <td className="py-3 px-4 text-right">2</td>
                      <td className="py-3 px-4 text-right">{formatarMoeda(28700)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Restaurante Boa Mesa</td>
                      <td className="py-3 px-4">Restaurantes</td>
                      <td className="py-3 px-4 text-right">2</td>
                      <td className="py-3 px-4 text-right">{formatarMoeda(22800)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
