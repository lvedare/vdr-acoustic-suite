
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, Plus, RefreshCw } from "lucide-react";
import { 
  useInsumos, 
  useProdutosAcabados, 
  useProjetos, 
  useObras, 
  useOrdensProducao 
} from "@/hooks/useSupabaseModules";
import { usePropostas } from "@/hooks/usePropostas";

const SupabaseTestPanel = () => {
  const [activeTest, setActiveTest] = useState('propostas');
  
  // Hooks para todos os módulos
  const { propostas, isLoading: loadingPropostas, clientes } = usePropostas();
  const { insumos, isLoading: loadingInsumos, criarInsumo } = useInsumos();
  const { produtos, isLoading: loadingProdutos, criarProduto } = useProdutosAcabados();
  const { projetos, isLoading: loadingProjetos, criarProjeto } = useProjetos();
  const {
    obras, 
    isLoading: loadingObras, 
    criarObra,
    isCriando: criandoObra
  } = useObras();
  const { ordensProducao, isLoading: loadingOrdens } = useOrdensProducao();

  // Dados de teste
  const criarInsumoTeste = () => {
    criarInsumo({
      codigo: `INS-${Date.now()}`,
      nome: "Espuma Acústica Teste",
      categoria: "Isolamento",
      unidade_medida: "m²",
      valor_custo: 25.50,
      quantidade_estoque: 100,
      fornecedor: "Fornecedor Teste",
      data_cadastro: new Date().toISOString().split('T')[0],
      pode_ser_revendido: true,
      descricao: "Espuma acústica para teste"
    });
  };

  const criarProdutoTeste = () => {
    criarProduto({
      codigo: `PROD-${Date.now()}`,
      nome: "Painel Acústico Teste",
      categoria: "Painéis",
      unidade_medida: "un",
      valor_base: 150.00,
      quantidade_estoque: 50,
      data_cadastro: new Date().toISOString().split('T')[0],
      descricao: "Painel acústico para teste"
    });
  };

  const criarProjetoTeste = () => {
    criarProjeto({
      nome: `Projeto Teste ${Date.now()}`,
      tipo: "Tratamento Acústico",
      status: "planejamento" as const,
      cliente_id: clientes.length > 0 ? clientes[0].id.toString() : null,
      data_inicio: null,
      data_previsao: null,
      data_conclusao: null,
      observacoes: "Projeto criado para teste"
    });
  };

  const criarObraTeste = () => {
    criarObra({
      nome: `Obra Teste ${Date.now()}`,
      endereco: "Rua Teste, 123 - São Paulo/SP",
      status: "planejamento" as const,
      cliente_id: clientes.length > 0 ? clientes[0].id.toString() : null,
      projeto_id: projetos.length > 0 ? projetos[0].id : null,
      data_inicio: null,
      data_previsao: null,
      data_conclusao: null,
      observacoes: "Obra criada para teste"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'rascunho': 'secondary',
      'enviada': 'outline',
      'aprovada': 'default',
      'rejeitada': 'destructive',
      'planejamento': 'secondary',
      'em_andamento': 'default',
      'concluido': 'default',
      'cancelado': 'destructive',
      'pendente': 'secondary'
    } as const;

    return (
      <Badge variant={statusColors[status as keyof typeof statusColors] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Painel de Teste - Integração Supabase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTest} onValueChange={setActiveTest}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="propostas">Propostas</TabsTrigger>
              <TabsTrigger value="clientes">Clientes</TabsTrigger>
              <TabsTrigger value="insumos">Insumos</TabsTrigger>
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="projetos">Projetos</TabsTrigger>
              <TabsTrigger value="obras">Obras</TabsTrigger>
            </TabsList>

            <TabsContent value="propostas" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Propostas ({propostas.length})</h3>
                {loadingPropostas && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {propostas.map((proposta) => (
                  <div key={proposta.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{proposta.numero}</span>
                      <span className="text-sm text-gray-600 ml-2">{proposta.cliente.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">R$ {proposta.valorTotal.toFixed(2)}</span>
                      {getStatusBadge(proposta.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="clientes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Clientes ({clientes.length})</h3>
              </div>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {clientes.map((cliente) => (
                  <div key={cliente.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{cliente.nome}</span>
                      {cliente.email && <span className="text-sm text-gray-600 ml-2">{cliente.email}</span>}
                    </div>
                    {cliente.empresa && (
                      <span className="text-sm text-gray-600">{cliente.empresa}</span>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insumos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Insumos ({insumos.length})</h3>
                <Button onClick={criarInsumoTeste} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Teste
                </Button>
              </div>
              {loadingInsumos ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {insumos.map((insumo) => (
                    <div key={insumo.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{insumo.nome}</span>
                        <span className="text-sm text-gray-600 ml-2">({insumo.codigo})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Estoque: {insumo.quantidade_estoque}</span>
                        <Badge variant="outline">{insumo.categoria}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="produtos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Produtos ({produtos.length})</h3>
                <Button onClick={criarProdutoTeste} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Teste
                </Button>
              </div>
              {loadingProdutos ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {produtos.map((produto) => (
                    <div key={produto.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{produto.nome}</span>
                        <span className="text-sm text-gray-600 ml-2">({produto.codigo})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">R$ {produto.valor_base.toFixed(2)}</span>
                        <Badge variant="outline">{produto.categoria}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projetos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Projetos ({projetos.length})</h3>
                <Button onClick={criarProjetoTeste} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Teste
                </Button>
              </div>
              {loadingProjetos ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {projetos.map((projeto) => (
                    <div key={projeto.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{projeto.nome}</span>
                        <span className="text-sm text-gray-600 ml-2">{projeto.tipo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {projeto.cliente && (
                          <span className="text-sm text-gray-600">{projeto.cliente.nome}</span>
                        )}
                        {getStatusBadge(projeto.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="obras" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Obras ({obras.length})</h3>
                <Button onClick={criarObraTeste} size="sm" disabled={criandoObra}>
                  {criandoObra ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Criar Teste
                </Button>
              </div>
              {loadingObras ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {obras.map((obra) => (
                    <div key={obra.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{obra.nome}</span>
                        <span className="text-sm text-gray-600 ml-2">{obra.endereco}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {obra.cliente && (
                          <span className="text-sm text-gray-600">{obra.cliente.nome}</span>
                        )}
                        {getStatusBadge(obra.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTestPanel;
