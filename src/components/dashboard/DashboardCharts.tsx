
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { usePropostas } from "@/hooks/usePropostas";
import { useInsumos, useProdutosAcabados, useProjetos, useObras } from "@/hooks/useSupabaseModules";

const COLORS = {
  primary: "#0088FE",
  secondary: "#00C49F", 
  accent: "#FFBB28",
  warning: "#FF8042",
  success: "#8884D8",
  info: "#82CA9D"
};

const DashboardCharts = () => {
  const { propostas } = usePropostas();
  const { insumos } = useInsumos();
  const { produtos } = useProdutosAcabados();
  const { projetos } = useProjetos();
  const { obras } = useObras();

  // Dados para gráfico de pizza - Status das Propostas
  const dadosPropostasStatus = [
    {
      name: "Rascunho",
      value: propostas.filter(p => p.status === 'rascunho').length,
      color: COLORS.warning
    },
    {
      name: "Enviadas",
      value: propostas.filter(p => p.status === 'enviada').length,
      color: COLORS.info
    },
    {
      name: "Aprovadas",
      value: propostas.filter(p => p.status === 'aprovada').length,
      color: COLORS.success
    },
    {
      name: "Rejeitadas",
      value: propostas.filter(p => p.status === 'rejeitada').length,
      color: COLORS.warning
    }
  ].filter(item => item.value > 0);

  // Dados para gráfico de barras - Estoque por Categoria
  const categoriesInsumos = insumos.reduce((acc, insumo) => {
    acc[insumo.categoria] = (acc[insumo.categoria] || 0) + insumo.quantidade_estoque;
    return acc;
  }, {} as Record<string, number>);

  const categoriesProdutos = produtos.reduce((acc, produto) => {
    acc[produto.categoria] = (acc[produto.categoria] || 0) + produto.quantidade_estoque;
    return acc;
  }, {} as Record<string, number>);

  const dadosEstoque = [
    ...Object.entries(categoriesInsumos).map(([categoria, quantidade]) => ({
      categoria: categoria.length > 15 ? categoria.substring(0, 15) + '...' : categoria,
      insumos: quantidade,
      produtos: categoriesProdutos[categoria] || 0
    })),
    ...Object.entries(categoriesProdutos)
      .filter(([categoria]) => !categoriesInsumos[categoria])
      .map(([categoria, quantidade]) => ({
        categoria: categoria.length > 15 ? categoria.substring(0, 15) + '...' : categoria,
        insumos: 0,
        produtos: quantidade
      }))
  ];

  // Dados para gráfico de barras - Projetos e Obras por Status
  const dadosProjetosObras = [
    {
      status: "Planejamento",
      projetos: projetos.filter(p => p.status === 'planejamento').length,
      obras: obras.filter(o => o.status === 'planejamento').length
    },
    {
      status: "Em Andamento",
      projetos: projetos.filter(p => p.status === 'em_andamento').length,
      obras: obras.filter(o => o.status === 'em_andamento').length
    },
    {
      status: "Concluído",
      projetos: projetos.filter(p => p.status === 'concluido').length,
      obras: obras.filter(o => o.status === 'concluido').length
    },
    {
      status: "Cancelado",
      projetos: projetos.filter(p => p.status === 'cancelado').length,
      obras: obras.filter(o => o.status === 'cancelado').length
    }
  ];

  // Dados para gráfico de pizza - Valor das Propostas por Status
  const valorPropostasPorStatus = [
    {
      name: "Aprovadas",
      value: propostas
        .filter(p => p.status === 'aprovada')
        .reduce((sum, p) => sum + p.valorTotal, 0),
      color: COLORS.success
    },
    {
      name: "Enviadas",
      value: propostas
        .filter(p => p.status === 'enviada')
        .reduce((sum, p) => sum + p.valorTotal, 0),
      color: COLORS.info
    },
    {
      name: "Rascunho",
      value: propostas
        .filter(p => p.status === 'rascunho')
        .reduce((sum, p) => sum + p.valorTotal, 0),
      color: COLORS.warning
    }
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza - Status das Propostas */}
      <Card>
        <CardHeader>
          <CardTitle>Propostas por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPropostasStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dadosPropostasStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Estoque por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosEstoque}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="categoria" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="insumos" name="Insumos" fill={COLORS.primary} />
                <Bar dataKey="produtos" name="Produtos" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Projetos e Obras por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos e Obras por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosProjetosObras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projetos" name="Projetos" fill={COLORS.accent} />
                <Bar dataKey="obras" name="Obras" fill={COLORS.success} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Valor das Propostas */}
      <Card>
        <CardHeader>
          <CardTitle>Valor das Propostas por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={valorPropostasPorStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => 
                    `${name} R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  }
                >
                  {valorPropostasPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Valor'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
