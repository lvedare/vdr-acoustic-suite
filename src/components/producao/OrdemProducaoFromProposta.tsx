
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/types/orcamento";
import { usePropostas } from "@/hooks/usePropostas";
import { useOrdemProducaoService } from "@/hooks/useSupabaseModules";

export function OrdemProducaoFromProposta() {
  const { propostasAprovadas, isLoading } = usePropostas();
  const { criarOrdem } = useOrdemProducaoService();
  const [expandedPropostaId, setExpandedPropostaId] = useState<number | null>(null);

  const handleGerarOrdemProducao = async (proposta: any) => {
    try {
      for (const item of proposta.itens) {
        const ordem = {
          numero: `OP-${proposta.numero}-${item.codigo}`,
          produto_id: null, // Será definido depois ao selecionar o produto
          quantidade: item.quantidade,
          status: 'pendente' as const,
          data_pedido: new Date().toISOString().split('T')[0],
          data_previsao: null,
          data_conclusao: null,
          observacoes: `OP gerada da proposta ${proposta.numero} - ${item.descricao}\nCliente: ${proposta.cliente.nome}`
        };
        
        await criarOrdem(ordem);
      }
      
      toast.success(`${proposta.itens.length} ordem(ns) de produção criada(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar ordens de produção:', error);
      toast.error('Erro ao criar ordens de produção');
    }
  };

  const toggleExpanded = (propostaId: number) => {
    setExpandedPropostaId(expandedPropostaId === propostaId ? null : propostaId);
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-lg font-medium text-muted-foreground">
              Carregando propostas aprovadas...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Criar Ordem de Produção
        </CardTitle>
        <CardDescription>
          Selecione uma proposta aprovada para gerar ordens de produção
        </CardDescription>
      </CardHeader>
      <CardContent>
        {propostasAprovadas.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              Nenhuma proposta aprovada encontrada.
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Aprove propostas na seção de Orçamentos para gerar ordens de produção.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {propostasAprovadas.map((proposta) => (
              <div key={proposta.id} className="border rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{proposta.numero}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        APROVADA
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Cliente:</span> {proposta.cliente.nome}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Data:</span> {formatDate(proposta.data)} | 
                      <span className="font-medium"> Valor:</span> {formatCurrency(proposta.valorTotal)} |
                      <span className="font-medium"> Itens:</span> {proposta.itens.length}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(proposta.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {expandedPropostaId === proposta.id ? 'Ocultar' : 'Ver Itens'}
                    </Button>
                    <Button
                      onClick={() => handleGerarOrdemProducao(proposta)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Gerar OP
                    </Button>
                  </div>
                </div>
                
                {expandedPropostaId === proposta.id && (
                  <div className="border-t bg-muted/50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead className="text-right">Valor Unit.</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {proposta.itens.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.codigo}</TableCell>
                            <TableCell>{item.descricao}</TableCell>
                            <TableCell>{item.quantidade}</TableCell>
                            <TableCell>{item.unidade}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.valorTotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
