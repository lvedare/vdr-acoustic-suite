
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { formatCurrency, ProdutoAcabado } from "@/types/orcamento";
import { EstoqueMovimentacaoButton } from "@/components/estoque/EstoqueMovimentacaoButton";

interface ProdutoCardProps {
  produto: ProdutoAcabado;
  onVerDetalhes: (produto: ProdutoAcabado) => void;
  onCriarItemOrcamento: (produto: ProdutoAcabado) => void;
}

export function ProdutoCard({ produto, onVerDetalhes, onCriarItemOrcamento }: ProdutoCardProps) {
  return (
    <Card key={produto.id} className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {produto.codigo}
            </Badge>
            <CardTitle className="text-base line-clamp-2">{produto.nome}</CardTitle>
          </div>
          <Badge variant="secondary" className="font-normal">
            {produto.categoria}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-20 overflow-hidden text-sm text-muted-foreground mb-4">
          {produto.descricao || "Sem descrição disponível."}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-slate-50 rounded-md">
            <div className="text-xs text-muted-foreground">Valor Base</div>
            <div className="font-semibold">{formatCurrency(produto.valorBase)}</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-md">
            <div className="text-xs text-muted-foreground">Em Estoque</div>
            <div className={`font-semibold ${produto.quantidadeEstoque < 10 ? "text-red-500" : ""}`}>
              {produto.quantidadeEstoque} {produto.unidadeMedida}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onVerDetalhes(produto)}
            >
              Detalhes
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => onCriarItemOrcamento(produto)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Orçar
            </Button>
          </div>
          <EstoqueMovimentacaoButton 
            produtoId={produto.id.toString()}
            produtoNome={produto.nome}
            tipo="produto"
          />
        </div>
      </CardContent>
    </Card>
  );
}
