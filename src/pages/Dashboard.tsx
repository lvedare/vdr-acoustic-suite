
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Package, 
  Building2, 
  Wrench, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { usePropostas } from "@/hooks/usePropostas";
import { useInsumos, useProdutosAcabados, useProjetos, useObras } from "@/hooks/useSupabaseModules";
import SupabaseTestPanel from "@/components/supabase/SupabaseTestPanel";

const Dashboard = () => {
  const { propostas, clientes, isLoading: loadingPropostas } = usePropostas();
  const { insumos, isLoading: loadingInsumos } = useInsumos();
  const { produtos, isLoading: loadingProdutos } = useProdutosAcabados();
  const { projetos, isLoading: loadingProjetos } = useProjetos();
  const { obras, isLoading: loadingObras } = useObras();

  // Estatísticas das propostas
  const propostasAprovadas = propostas.filter(p => p.status === 'aprovada').length;
  const propostasEnviadas = propostas.filter(p => p.status === 'enviada').length;
  const propostasRascunho = propostas.filter(p => p.status === 'rascunho').length;
  const valorTotalPropostas = propostas.reduce((acc, p) => acc + p.valorTotal, 0);

  // Estatísticas dos projetos
  const projetosAtivos = projetos.filter(p => p.status === 'em_andamento').length;
  const projetosConcluidos = projetos.filter(p => p.status === 'concluido').length;

  // Estatísticas das obras
  const obrasAndamento = obras.filter(o => o.status === 'em_andamento').length;
  const obrasConcluidas = obras.filter(o => o.status === 'concluido').length;

  // Estoque baixo (menos de 10 unidades)
  const insumosEstoqueBaixo = insumos.filter(i => i.quantidade_estoque < 10).length;
  const produtosEstoqueBaixo = produtos.filter(p => p.quantidade_estoque < 10).length;

  const dashboardCards = [
    {
      title: "Total de Clientes",
      value: clientes.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Propostas Enviadas",
      value: propostasEnviadas,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Projetos Ativos",
      value: projetosAtivos,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Obras em Andamento",
      value: obrasAndamento,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Valor Total Propostas",
      value: `R$ ${valorTotalPropostas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Itens Estoque Baixo",
      value: insumosEstoqueBaixo + produtosEstoqueBaixo,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Integrado com Supabase
        </Badge>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo por Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Propostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rascunho</span>
              <Badge variant="secondary">{propostasRascunho}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Enviadas</span>
              <Badge variant="outline">{propostasEnviadas}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Aprovadas</span>
              <Badge variant="default">{propostasAprovadas}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos e Obras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projetos Ativos</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <Badge variant="default">{projetosAtivos}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projetos Concluídos</span>
              <Badge variant="secondary">{projetosConcluidos}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Obras em Andamento</span>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-orange-600" />
                <Badge variant="outline">{obrasAndamento}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Obras Concluídas</span>
              <Badge variant="secondary">{obrasConcluidas}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel de teste do Supabase */}
      <SupabaseTestPanel />
    </div>
  );
};

export default Dashboard;
