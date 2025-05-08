
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  LineChart,
  Plus,
  Search,
  Wallet
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Pie, PieChart, Cell, Legend } from "recharts";

// Interfaces
interface Transacao {
  id: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string;
  valor: number;
  descricao: string;
  formaPagamento: string;
  status: "pendente" | "pago" | "atrasado" | "cancelado";
  contaBancaria?: string;
  documentoRef?: string;
}

interface ContaBancaria {
  id: number;
  nome: string;
  tipo: string;
  saldo: number;
}

interface Categoria {
  id: number;
  nome: string;
  tipo: "receita" | "despesa";
}

// Dados mockados
const transacoesMock: Transacao[] = [
  {
    id: 1,
    tipo: "receita",
    categoria: "Vendas",
    data: "2025-05-05",
    valor: 15000,
    descricao: "Pagamento - Tratamento Acústico Escritório ABC",
    formaPagamento: "Transferência",
    status: "pago",
    contaBancaria: "Conta Principal",
    documentoRef: "VDR27.3.2025050101.123RO"
  },
  {
    id: 2,
    tipo: "despesa",
    categoria: "Fornecedores",
    data: "2025-05-06",
    valor: 3200,
    descricao: "Compra de materiais - Lã de Rocha",
    formaPagamento: "Débito",
    status: "pago",
    contaBancaria: "Conta Principal",
    documentoRef: "NF-7845"
  },
  {
    id: 3,
    tipo: "receita",
    categoria: "Vendas",
    data: "2025-05-10",
    valor: 28500,
    descricao: "Pagamento - Studio XYZ",
    formaPagamento: "PIX",
    status: "pendente",
    contaBancaria: "Conta Principal",
    documentoRef: "VDR27.3.2025050501.145RO"
  },
  {
    id: 4,
    tipo: "despesa",
    categoria: "Salários",
    data: "2025-05-01",
    valor: 12000,
    descricao: "Folha de pagamento - Maio/2025",
    formaPagamento: "Transferência",
    status: "pago",
    contaBancaria: "Conta Principal"
  },
  {
    id: 5,
    tipo: "despesa",
    categoria: "Impostos",
    data: "2025-05-20",
    valor: 4560,
    descricao: "Impostos - Maio/2025",
    formaPagamento: "Boleto",
    status: "pendente",
    documentoRef: "DAR-2025-05"
  },
  {
    id: 6,
    tipo: "receita",
    categoria: "Vendas",
    data: "2025-04-15",
    valor: 22800,
    descricao: "Pagamento - Restaurante Boa Mesa",
    formaPagamento: "Transferência",
    status: "pago",
    contaBancaria: "Conta Principal",
    documentoRef: "VDR27.3.2025041501.092RO"
  },
  {
    id: 7,
    tipo: "despesa",
    categoria: "Operacionais",
    data: "2025-05-03",
    valor: 750,
    descricao: "Aluguel de equipamentos",
    formaPagamento: "Débito",
    status: "pago",
    contaBancaria: "Conta Principal"
  }
];

const contasMock: ContaBancaria[] = [
  {
    id: 1,
    nome: "Conta Principal",
    tipo: "Corrente",
    saldo: 45790.50
  },
  {
    id: 2,
    nome: "Reserva Emergencial",
    tipo: "Poupança",
    saldo: 25000
  },
  {
    id: 3,
    nome: "Investimentos",
    tipo: "Aplicação",
    saldo: 75000
  }
];

const categoriasMock: Categoria[] = [
  { id: 1, nome: "Vendas", tipo: "receita" },
  { id: 2, nome: "Serviços", tipo: "receita" },
  { id: 3, nome: "Outros Recebimentos", tipo: "receita" },
  { id: 4, nome: "Fornecedores", tipo: "despesa" },
  { id: 5, nome: "Salários", tipo: "despesa" },
  { id: 6, nome: "Impostos", tipo: "despesa" },
  { id: 7, nome: "Operacionais", tipo: "despesa" },
  { id: 8, nome: "Aluguel", tipo: "despesa" },
  { id: 9, nome: "Serviços Terceiros", tipo: "despesa" }
];

// Dados para gráficos
const dadosFluxoCaixa = [
  { mes: "Jan", receitas: 45000, despesas: 32000 },
  { mes: "Fev", receitas: 48000, despesas: 35000 },
  { mes: "Mar", receitas: 52000, despesas: 38000 },
  { mes: "Abr", receitas: 58000, despesas: 41000 },
  { mes: "Mai", receitas: 66300, despesas: 45000 },
];

const dadosDespesasPorCategoria = [
  { categoria: "Fornecedores", valor: 18500 },
  { categoria: "Salários", valor: 12000 },
  { categoria: "Impostos", valor: 8700 },
  { categoria: "Operacionais", valor: 5800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

const Financeiro = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesMock);
  const [contas, setContas] = useState<ContaBancaria[]>(contasMock);
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasMock);
  const [isNovaTransacaoDialogOpen, setIsNovaTransacaoDialogOpen] = useState(false);
  const [filtro, setFiltro] = useState({
    termo: "",
    tipo: "",
    status: "",
    periodo: "todos"
  });

  // Nova transação vazia
  const transacaoVazia: Omit<Transacao, "id"> = {
    tipo: "receita",
    categoria: "",
    data: new Date().toISOString().split('T')[0],
    valor: 0,
    descricao: "",
    formaPagamento: "",
    status: "pendente",
    contaBancaria: "",
    documentoRef: ""
  };

  const [novaTransacao, setNovaTransacao] = useState<Omit<Transacao, "id">>(transacaoVazia);

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchesTermo = 
      transacao.descricao.toLowerCase().includes(filtro.termo.toLowerCase()) ||
      transacao.categoria.toLowerCase().includes(filtro.termo.toLowerCase()) ||
      transacao.documentoRef?.toLowerCase().includes(filtro.termo.toLowerCase()) ||
      false;
    
    const matchesTipo = !filtro.tipo || transacao.tipo === filtro.tipo;
    
    const matchesStatus = !filtro.status || transacao.status === filtro.status;
    
    let matchesPeriodo = true;
    if (filtro.periodo === "mes-atual") {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      const dataTransacao = new Date(transacao.data);
      
      matchesPeriodo = dataTransacao >= primeiroDiaMes && dataTransacao <= ultimoDiaMes;
    }
    
    return matchesTermo && matchesTipo && matchesStatus && matchesPeriodo;
  });
  
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
  
  // Salvar nova transação
  const handleSalvarTransacao = () => {
    if (!novaTransacao.descricao || !novaTransacao.valor || !novaTransacao.categoria || !novaTransacao.data) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    const novaTransacaoCriada: Transacao = {
      id: Date.now(),
      ...novaTransacao
    };
    
    setTransacoes([...transacoes, novaTransacaoCriada]);
    
    // Atualizar saldo da conta bancária
    if (novaTransacao.contaBancaria) {
      const contasAtualizadas = contas.map(conta => {
        if (conta.nome === novaTransacao.contaBancaria) {
          const valorAlterado = novaTransacao.tipo === "receita" ? novaTransacao.valor : -novaTransacao.valor;
          return {
            ...conta,
            saldo: conta.saldo + valorAlterado
          };
        }
        return conta;
      });
      
      setContas(contasAtualizadas);
    }
    
    toast.success(`${novaTransacao.tipo === "receita" ? "Receita" : "Despesa"} registrada com sucesso!`);
    
    // Fechar dialog e resetar estado
    setIsNovaTransacaoDialogOpen(false);
    setNovaTransacao(transacaoVazia);
  };
  
  // Calcular totais
  const calcularTotalReceitas = () => {
    const receitasPagas = transacoes
      .filter(t => t.tipo === "receita" && t.status === "pago")
      .reduce((total, t) => total + t.valor, 0);
    
    const receitasPendentes = transacoes
      .filter(t => t.tipo === "receita" && t.status === "pendente")
      .reduce((total, t) => total + t.valor, 0);
    
    return { receitasPagas, receitasPendentes };
  };
  
  const calcularTotalDespesas = () => {
    const despesasPagas = transacoes
      .filter(t => t.tipo === "despesa" && t.status === "pago")
      .reduce((total, t) => total + t.valor, 0);
    
    const despesasPendentes = transacoes
      .filter(t => t.tipo === "despesa" && t.status === "pendente")
      .reduce((total, t) => total + t.valor, 0);
    
    return { despesasPagas, despesasPendentes };
  };
  
  const { receitasPagas, receitasPendentes } = calcularTotalReceitas();
  const { despesasPagas, despesasPendentes } = calcularTotalDespesas();
  
  // Saldo total de todas as contas
  const saldoTotal = contas.reduce((total, conta) => total + conta.saldo, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <Dialog open={isNovaTransacaoDialogOpen} onOpenChange={setIsNovaTransacaoDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da transação financeira abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Label>Tipo de Transação</Label>
                <div className="flex rounded-md overflow-hidden">
                  <Button
                    type="button"
                    variant={novaTransacao.tipo === "receita" ? "default" : "outline"}
                    className={
                      novaTransacao.tipo === "receita" 
                        ? "rounded-r-none bg-emerald-600 hover:bg-emerald-700"
                        : "rounded-r-none"
                    }
                    onClick={() => setNovaTransacao({...novaTransacao, tipo: "receita"})}
                  >
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant={novaTransacao.tipo === "despesa" ? "default" : "outline"}
                    className={
                      novaTransacao.tipo === "despesa" 
                        ? "rounded-l-none bg-red-600 hover:bg-red-700"
                        : "rounded-l-none"
                    }
                    onClick={() => setNovaTransacao({...novaTransacao, tipo: "despesa"})}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Despesa
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input 
                    id="valor" 
                    type="number"
                    step="0.01"
                    value={novaTransacao.valor || ""}
                    onChange={(e) => setNovaTransacao({...novaTransacao, valor: Number(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input 
                    id="data" 
                    type="date"
                    value={novaTransacao.data}
                    onChange={(e) => setNovaTransacao({...novaTransacao, data: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input 
                  id="descricao" 
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao({...novaTransacao, descricao: e.target.value})}
                  placeholder="Ex: Pagamento de cliente, Compra de materiais, etc."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select 
                    value={novaTransacao.categoria}
                    onValueChange={(value) => setNovaTransacao({...novaTransacao, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias
                        .filter(cat => cat.tipo === novaTransacao.tipo)
                        .map(categoria => (
                          <SelectItem key={categoria.id} value={categoria.nome}>
                            {categoria.nome}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Select 
                    value={novaTransacao.formaPagamento}
                    onValueChange={(value) => setNovaTransacao({...novaTransacao, formaPagamento: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="Boleto">Boleto</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contaBancaria">Conta Bancária</Label>
                  <Select 
                    value={novaTransacao.contaBancaria}
                    onValueChange={(value) => setNovaTransacao({...novaTransacao, contaBancaria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {contas.map(conta => (
                        <SelectItem key={conta.id} value={conta.nome}>
                          {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={novaTransacao.status}
                    onValueChange={(value: "pendente" | "pago" | "atrasado" | "cancelado") => 
                      setNovaTransacao({...novaTransacao, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentoRef">Referência/Documento</Label>
                <Input 
                  id="documentoRef" 
                  value={novaTransacao.documentoRef || ""}
                  onChange={(e) => setNovaTransacao({...novaTransacao, documentoRef: e.target.value})}
                  placeholder="Ex: Número de NF, Proposta, etc."
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsNovaTransacaoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarTransacao}>
                Salvar Transação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                {formatarMoeda(saldoTotal)}
              </div>
              <Badge className="ml-2" variant="outline">
                {contas.length} contas
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ArrowDownLeft className="mr-2 h-4 w-4 text-emerald-600" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {formatarMoeda(receitasPagas)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              + {formatarMoeda(receitasPendentes)} pendente
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-2 h-4 w-4 text-red-600" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {formatarMoeda(despesasPagas)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              + {formatarMoeda(despesasPendentes)} pendente
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
              Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {formatarMoeda(receitasPagas - despesasPagas)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Saldo líquido do período
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="fluxo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="contas">Contas</TabsTrigger>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fluxo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                  Fluxo de Caixa
                </CardTitle>
                <CardDescription>
                  Comparativo de receitas e despesas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={dadosFluxoCaixa}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                      />
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
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  Despesas por Categoria
                </CardTitle>
                <CardDescription>
                  Distribuição de gastos no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosDespesasPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="valor"
                        nameKey="categoria"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {dadosDespesasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Próximos Vencimentos
                </CardTitle>
                <CardDescription>
                  Pagamentos e recebimentos programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoes
                      .filter(t => t.status === "pendente")
                      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                      .slice(0, 5)
                      .map(transacao => (
                        <TableRow key={transacao.id}>
                          <TableCell>{formatarData(transacao.data)}</TableCell>
                          <TableCell>{transacao.descricao}</TableCell>
                          <TableCell>
                            <Badge 
                              className={transacao.tipo === "receita" 
                                ? "bg-emerald-100 text-emerald-800" 
                                : "bg-red-100 text-red-800"
                              }
                              variant="secondary"
                            >
                              {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatarMoeda(transacao.valor)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {transacoes.filter(t => t.status === "pendente").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            Não há vencimentos pendentes.
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contas">
          <Card>
            <CardHeader>
              <CardTitle>Contas Bancárias</CardTitle>
              <CardDescription>Gerencie suas contas e visualize saldos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contas.map(conta => (
                  <Card key={conta.id} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{conta.nome}</h3>
                          <p className="text-sm text-muted-foreground">{conta.tipo}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatarMoeda(conta.saldo)}
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <FileText className="h-4 w-4 mr-1" />
                            Extrato
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Wallet className="mr-2 h-4 w-4" />
                    Nova Conta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transacoes">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Transações Financeiras
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar transações..."
                      className="pl-8"
                      value={filtro.termo}
                      onChange={(e) => setFiltro({...filtro, termo: e.target.value})}
                    />
                  </div>
                  <Select
                    value={filtro.tipo}
                    onValueChange={(value) => setFiltro({...filtro, tipo: value})}
                  >
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>{filtro.tipo === "receita" ? "Receitas" : filtro.tipo === "despesa" ? "Despesas" : "Todos"}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="receita">Receitas</SelectItem>
                      <SelectItem value="despesa">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filtro.periodo}
                    onValueChange={(value) => setFiltro({...filtro, periodo: value})}
                  >
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{filtro.periodo === "mes-atual" ? "Mês Atual" : "Todos"}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="mes-atual">Mês Atual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="hidden md:table-cell">Forma Pagto.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoesFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhuma transação encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transacoesFiltradas
                        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                        .map((transacao) => {
                          const badgeVariants = {
                            "pendente": "bg-yellow-100 text-yellow-800",
                            "pago": "bg-emerald-100 text-emerald-800",
                            "atrasado": "bg-red-100 text-red-800",
                            "cancelado": "bg-gray-100 text-gray-800",
                          }
                          
                          const statusText = {
                            "pendente": "Pendente",
                            "pago": "Pago",
                            "atrasado": "Atrasado",
                            "cancelado": "Cancelado",
                          }
                          
                          return (
                            <TableRow key={transacao.id}>
                              <TableCell>{formatarData(transacao.data)}</TableCell>
                              <TableCell>
                                <div className="font-medium">{transacao.descricao}</div>
                                {transacao.documentoRef && (
                                  <div className="text-xs text-muted-foreground">
                                    Ref: {transacao.documentoRef}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{transacao.categoria}</TableCell>
                              <TableCell className="hidden md:table-cell">{transacao.formaPagamento}</TableCell>
                              <TableCell>
                                <Badge className={badgeVariants[transacao.status]} variant="secondary">
                                  {statusText[transacao.status]}
                                </Badge>
                              </TableCell>
                              <TableCell className={`text-right font-medium ${
                                transacao.tipo === "receita" ? "text-emerald-700" : "text-red-700"
                              }`}>
                                {transacao.tipo === "receita" ? "+" : "-"} {formatarMoeda(transacao.valor)}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="relatorios">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Financeiros</CardTitle>
                <CardDescription>Acesse os relatórios para análise financeira</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-blue-100 p-2">
                        <BarChart className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">DRE</h3>
                        <p className="text-sm text-muted-foreground">Demonstrativo de Resultado</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-emerald-100 p-2">
                        <LineChart className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Fluxo de Caixa</h3>
                        <p className="text-sm text-muted-foreground">Análise de Fluxo de Caixa</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-purple-100 p-2">
                        <FileText className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Faturamento</h3>
                        <p className="text-sm text-muted-foreground">Relatório de Faturamento</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-amber-100 p-2">
                        <FileText className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Contas a Pagar</h3>
                        <p className="text-sm text-muted-foreground">Relatório de Contas a Pagar</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-cyan-100 p-2">
                        <FileText className="h-5 w-5 text-cyan-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Contas a Receber</h3>
                        <p className="text-sm text-muted-foreground">Relatório de Contas a Receber</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-none hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="rounded-md bg-red-100 p-2">
                        <FileText className="h-5 w-5 text-red-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Inadimplência</h3>
                        <p className="text-sm text-muted-foreground">Relatório de Inadimplência</p>
                      </div>
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;
