
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EstoqueSummaryCardsProps {
  countTotal: number;
  countBaixoEstoque: number;
  countEsgotados: number;
  countRegular: number;
}

export const EstoqueSummaryCards = ({ 
  countTotal, 
  countBaixoEstoque, 
  countEsgotados,
  countRegular
}: EstoqueSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {countTotal}
            <span className="text-sm font-normal text-muted-foreground ml-2">itens</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            {countBaixoEstoque}
          </div>
          {countBaixoEstoque > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-800">
              Atenção
            </Badge>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Itens Esgotados</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            {countEsgotados}
          </div>
          {countEsgotados > 0 && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-800">
              Crítico
            </Badge>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Regular</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {countRegular}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
