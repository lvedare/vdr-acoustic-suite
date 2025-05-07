
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Building2,
  CalendarRange,
  Clipboard,
  Hammer,
  Layers,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from "recharts";

// Sample data for the charts
const salesData = [
  { month: "Jan", valor: 8000 },
  { month: "Fev", valor: 12000 },
  { month: "Mar", valor: 15000 },
  { month: "Abr", valor: 18000 },
  { month: "Mai", valor: 20000 },
  { month: "Jun", valor: 22000 },
];

const projectsData = [
  { month: "Jan", concluidos: 3, andamento: 5 },
  { month: "Fev", concluidos: 5, andamento: 4 },
  { month: "Mar", concluidos: 4, andamento: 6 },
  { month: "Abr", concluidos: 6, andamento: 3 },
  { month: "Mai", concluidos: 7, andamento: 4 },
  { month: "Jun", concluidos: 8, andamento: 5 },
];

// Summary card component
interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
  icon: React.ElementType;
  iconColor?: string;
  trendUp?: boolean;
}

const SummaryCard = ({
  title,
  value,
  trend,
  description,
  icon: Icon,
  iconColor = "text-blue-500",
  trendUp = true,
}: SummaryCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          {trend && (
            <p
              className={`mt-1 text-sm ${
                trendUp ? "text-emerald-600" : "text-vdr-red"
              }`}
            >
              {trend}
            </p>
          )}
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={`rounded-md bg-blue-50 p-2 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Propostas Abertas"
          value="12"
          trend="+3 desde o último mês"
          icon={Clipboard}
          trendUp={true}
        />
        <SummaryCard
          title="Ordens de Produção"
          value="8"
          description="3 em atraso"
          icon={Hammer}
          iconColor="text-purple-500"
        />
        <SummaryCard
          title="Obras em Andamento"
          value="5"
          description="2 iniciando esta semana"
          icon={Building2}
          iconColor="text-amber-500"
        />
        <SummaryCard
          title="Faturamento Mensal"
          value="R$ 185.000"
          trend="+12% comparado ao mês anterior"
          icon={Wallet}
          iconColor="text-emerald-500"
          trendUp={true}
        />
      </div>

      <Tabs defaultValue="vendas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        <TabsContent value="vendas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Mês</CardTitle>
              <CardDescription>
                Análise de vendas dos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                  <Bar dataKey="valor" fill="#013576" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projetos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Status de Projetos</CardTitle>
              <CardDescription>
                Projetos concluídos vs. em andamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="concluidos" stroke="#013576" name="Concluídos" />
                  <Line type="monotone" dataKey="andamento" stroke="#FC0118" name="Em Andamento" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financeiro" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>
                Visão geral de receitas e despesas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Dados financeiros detalhados serão implementados em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarRange className="h-5 w-5 text-vdr-blue" /> 
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visita Técnica</p>
                    <p className="text-sm text-muted-foreground">
                      Cliente: Escritório ABC
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">Hoje</p>
                    <p className="text-muted-foreground">14:00h</p>
                  </div>
                </div>
              </div>
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Início de Obra</p>
                    <p className="text-sm text-muted-foreground">
                      Cliente: Empresa XYZ
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">Amanhã</p>
                    <p className="text-muted-foreground">08:30h</p>
                  </div>
                </div>
              </div>
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reunião de Equipe</p>
                    <p className="text-sm text-muted-foreground">
                      Planejamento Semanal
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">14/05</p>
                    <p className="text-muted-foreground">09:00h</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-vdr-blue" /> 
              Estoque Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3">
                <div>
                  <p className="font-medium">Lã de Rocha 50mm</p>
                  <p className="text-sm text-red-600">
                    Estoque: 10 placas
                  </p>
                </div>
                <p className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  Crítico
                </p>
              </div>
              <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-3">
                <div>
                  <p className="font-medium">Perfil Metálico 48mm</p>
                  <p className="text-sm text-amber-600">
                    Estoque: 25 barras
                  </p>
                </div>
                <p className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                  Baixo
                </p>
              </div>
              <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-3">
                <div>
                  <p className="font-medium">Parafuso 4.2x13mm</p>
                  <p className="text-sm text-amber-600">
                    Estoque: 300 unidades
                  </p>
                </div>
                <p className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                  Baixo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-vdr-blue" /> 
              Atendimentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-3">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">João Silva</p>
                    <p className="text-xs text-muted-foreground">Há 1 hora</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solicitou orçamento para tratamento acústico
                  </p>
                </div>
              </div>
              <div className="rounded-md bg-muted p-3">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Maria Oliveira</p>
                    <p className="text-xs text-muted-foreground">Há 3 horas</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pediu informações sobre isolamento acústico
                  </p>
                </div>
              </div>
              <div className="rounded-md bg-muted p-3">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Empresa ABC</p>
                    <p className="text-xs text-muted-foreground">Há 5 horas</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solicitou visita técnica para avaliação
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-vdr-blue" /> 
            Propostas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Nº</th>
                  <th className="py-3 text-left font-medium">Cliente</th>
                  <th className="py-3 text-left font-medium">Descrição</th>
                  <th className="py-3 text-left font-medium">Valor</th>
                  <th className="py-3 text-left font-medium">Data</th>
                  <th className="py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">1234</td>
                  <td className="py-3">Empresa ABC</td>
                  <td className="py-3">Isolamento acústico para sala de reuniões</td>
                  <td className="py-3">R$ 15.000,00</td>
                  <td className="py-3">05/05/2025</td>
                  <td className="py-3">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                      Aguardando aprovação
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">1233</td>
                  <td className="py-3">Studio XYZ</td>
                  <td className="py-3">Tratamento acústico para estúdio</td>
                  <td className="py-3">R$ 28.500,00</td>
                  <td className="py-3">04/05/2025</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                      Aprovada
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">1232</td>
                  <td className="py-3">Restaurante Boa Mesa</td>
                  <td className="py-3">Redução de ruído para salão principal</td>
                  <td className="py-3">R$ 22.800,00</td>
                  <td className="py-3">03/05/2025</td>
                  <td className="py-3">
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800">
                      Em revisão
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">1231</td>
                  <td className="py-3">Clínica Saúde Total</td>
                  <td className="py-3">Isolamento acústico para consultórios</td>
                  <td className="py-3">R$ 35.200,00</td>
                  <td className="py-3">02/05/2025</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                      Aprovada
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
