import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

interface ProducaoSummaryCardsProps {
  ordens: any[];
}

export const ProducaoSummaryCards = ({ ordens }: ProducaoSummaryCardsProps) => {
  const totalOrdens = ordens.length;
  const ordensEmAndamento = ordens.filter(o => o.status === 'em_andamento').length;
  const ordensAtrasadas = ordens.filter(o => o.status === 'atrasado').length;
  const ordensConcluidas = ordens.filter(o => o.status === 'concluido').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Ordens</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrdens}</div>
          <p className="text-xs text-muted-foreground">
            Ordens de produção ativas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{ordensEmAndamento}</div>
          <p className="text-xs text-muted-foreground">
            Ordens sendo produzidas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{ordensAtrasadas}</div>
          <p className="text-xs text-muted-foreground">
            Necessitam atenção
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{ordensConcluidas}</div>
          <p className="text-xs text-muted-foreground">
            Finalizadas no período
          </p>
        </CardContent>
      </Card>
    </div>
  );
};