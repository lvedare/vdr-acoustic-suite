
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePropostas } from '@/hooks/usePropostas';
import { useProdutosAcabados, useInsumos } from '@/hooks/useSupabaseModules';

export const EstoqueIntegracaoProposta = () => {
  const [selectedPropostaId, setSelectedPropostaId] = useState<string>("");
  
  const { propostasAprovadas } = usePropostas();
  const { produtos } = useProdutosAcabados();
  const { insumos } = useInsumos();

  const propostaSelecionada = propostasAprovadas.find(p => p.id.toString() === selectedPropostaId);

  const verificarEstoque = () => {
    if (!propostaSelecionada) return { suficiente: true, itensInsuficientes: [] };

    const itensInsuficientes = propostaSelecionada.itens.filter(item => {
      // Procurar produto correspondente no estoque
      const produto = produtos.find(p => 
        p.codigo === item.codigo || 
        p.nome.toLowerCase().includes(item.descricao.toLowerCase())
      );
      
      return produto && produto.quantidade_estoque < item.quantidade;
    });

    return {
      suficiente: itensInsuficientes.length === 0,
      itensInsuficientes
    };
  };

  const verificacaoEstoque = verificarEstoque();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Verificação de Estoque para Propostas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Proposta Aprovada:</label>
          <Select value={selectedPropostaId} onValueChange={setSelectedPropostaId}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Selecione uma proposta para verificar estoque" />
            </SelectTrigger>
            <SelectContent>
              {propostasAprovadas.map((proposta) => (
                <SelectItem key={proposta.id} value={proposta.id.toString()}>
                  {proposta.numero} - {proposta.cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {propostaSelecionada && (
          <div className="space-y-4">
            {verificacaoEstoque.suficiente ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Estoque suficiente para atender todos os itens desta proposta.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Alguns itens não possuem estoque suficiente. Verifique os itens abaixo.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Itens da proposta:</h4>
              {propostaSelecionada.itens.map((item, index) => {
                const produto = produtos.find(p => 
                  p.codigo === item.codigo || 
                  p.nome.toLowerCase().includes(item.descricao.toLowerCase())
                );
                
                const estoqueAtual = produto?.quantidade_estoque || 0;
                const suficiente = estoqueAtual >= item.quantidade;

                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${suficiente ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{item.descricao}</p>
                        <p className="text-xs text-muted-foreground">Código: {item.codigo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Necessário: <span className="font-medium">{item.quantidade}</span>
                        </p>
                        <p className="text-sm">
                          Estoque: <span className={`font-medium ${suficiente ? 'text-green-600' : 'text-red-600'}`}>
                            {estoqueAtual}
                          </span>
                        </p>
                      </div>
                    </div>
                    {!suficiente && (
                      <p className="text-xs text-red-600 mt-1">
                        Faltam {item.quantidade - estoqueAtual} unidades
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!verificacaoEstoque.suficiente && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Considere gerar ordens de produção ou fazer movimentações de entrada no estoque antes de iniciar a obra.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
