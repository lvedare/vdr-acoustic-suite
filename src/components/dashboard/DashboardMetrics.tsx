
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2
} from "lucide-react";
import { usePropostas } from "@/hooks/usePropostas";
import { useInsumos, useProdutosAcabados, useProjetos, useObras } from "@/hooks/useSupabaseModules";

const DashboardMetrics = () => {
  const { propostas } = usePropostas();
  const { insumos } = useInsumos();
  const { produtos } = useProdutosAcabados();
  const { projetos } = useProjetos();
  const { obras } = useObras();

  // Cálculos de métricas
  const valorTotalPropostas = propostas.reduce((acc, p) => acc + p.valorTotal, 0);
  const propostasAprovadas = propostas.filter(p => p.status === 'aprovada').length;
  const taxaAprovacao = propostas.length > 0 ? (propostasAprovadas / propostas.length) * 100 : 0;
  
  const insumosEstoqueBaixo = insumos.filter(i => i.quantidade_estoque < 10).length;
  const produtosEstoqueBaixo = produtos.filter(p => p.quantidade_estoque < 10).length;
  const totalEstoqueBaixo = insumosEstoqueBaixo + produtosEstoqueBaixo;
  
  const projetosAtivos = projetos.filter(p => p.status === 'em_andamento').length;
  const obrasAtivas = obras.filter(o => o.status === 'em_andamento').length;
  
  const valorEstoqueInsumos = insumos.reduce((acc, i) => acc + (i.valor_custo * i.quantidade_estoque), 0);
  const valorEstoqueProdutos = produtos.reduce((acc, p) => acc + (p.valor_base * p.quantidade_estoque), 0);
  const valorTotalEstoque = valorEstoqueInsumos + valorEstoqueProdutos;

  const metricsData = [
    {
      title: "Valor Total em Propostas",
      value: `R$ ${valorTotalPropostas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: taxaAprovacao > 50 ? "up" : "down",
      trendValue: `${taxaAprovacao.toFixed(1)}% aprovação`
    },
    {
      title: "Valor Total em Estoque",
      value: `R$ ${valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: totalEstoqueBaixo > 0 ? "down" : "up",
      trendValue: `${totalEstoqueBaixo} itens baixos`
    },
    {
      title: "Projetos Ativos",
      value: projetosAtivos.toString(),
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: projetosAtivos > obras.filter(o => o.status === 'concluido').length ? "up" : "down",
      trendValue: `${projetos.length} total`
    },
    {
      title: "Obras em Andamento",
      value: obrasAtivas.toString(),
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: obrasAtivas > 0 ? "up" : "down",
      trendValue: `${obras.length} total`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <Badge 
                  variant={metric.trend === "up" ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  <TrendIcon className="h-3 w-3" />
                  {metric.trendValue}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
