
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export const AtendimentosTab = () => {
  const [atendimentosParaOrcamento, setAtendimentosParaOrcamento] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Carregar atendimentos enviados do CRM
  useEffect(() => {
    const loadAtendimentos = () => {
      const atendimentos = JSON.parse(localStorage.getItem('atendimentos_para_orcamento') || '[]');
      setAtendimentosParaOrcamento(atendimentos);
    };

    loadAtendimentos();
    
    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      loadAtendimentos();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filtrar atendimentos
  const atendimentosFiltrados = atendimentosParaOrcamento.filter(atendimento => {
    const matchesSearch = !searchTerm || 
      atendimento.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.assunto?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || atendimento.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCriarOrcamento = (atendimento: any) => {
    // Criar novo orçamento baseado no atendimento
    const novoOrcamento = {
      id: Date.now(),
      numero: `ORC-${Date.now()}`,
      cliente_nome: atendimento.cliente_nome,
      cliente_id: atendimento.cliente_id,
      data: new Date().toISOString().split('T')[0],
      status: 'rascunho',
      valor_total: 0,
      atendimento_origem: atendimento,
      observacoes: atendimento.observacoes_orcamento || ''
    };

    // Salvar no localStorage
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos_do_atendimento') || '[]');
    orcamentos.push(novoOrcamento);
    localStorage.setItem('orcamentos_do_atendimento', JSON.stringify(orcamentos));

    toast.success("Orçamento criado com sucesso!");
    
    // Remover da lista de atendimentos pendentes
    const atendimentosAtualizados = atendimentosParaOrcamento.filter(a => a.id !== atendimento.id);
    setAtendimentosParaOrcamento(atendimentosAtualizados);
    localStorage.setItem('atendimentos_para_orcamento', JSON.stringify(atendimentosAtualizados));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Novo': { variant: 'default' as const, color: 'bg-blue-500' },
      'Em Andamento': { variant: 'secondary' as const, color: 'bg-yellow-500' },
      'Resolvido': { variant: 'outline' as const, color: 'bg-green-500' },
      'Fechado': { variant: 'outline' as const, color: 'bg-gray-500' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Novo'];
    return <Badge variant={config.variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Atendimentos Recebidos do CRM</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Atendimentos enviados do módulo de CRM que estão aguardando criação de orçamento.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente ou assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="Novo">Novo</SelectItem>
            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
            <SelectItem value="Resolvido">Resolvido</SelectItem>
            <SelectItem value="Fechado">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Atendimentos */}
      <div className="grid gap-4">
        {atendimentosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {atendimentosParaOrcamento.length === 0 
                  ? "Nenhum atendimento foi enviado do CRM ainda."
                  : "Nenhum atendimento encontrado com os filtros aplicados."
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Os atendimentos enviados do módulo de CRM aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          atendimentosFiltrados.map((atendimento) => (
            <Card key={atendimento.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{atendimento.cliente_nome}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {atendimento.assunto}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(atendimento.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Canal</p>
                    <p className="text-sm">{atendimento.canal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contato</p>
                    <p className="text-sm">{atendimento.contato}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data do Atendimento</p>
                    <p className="text-sm">{formatDate(atendimento.data)}</p>
                  </div>
                </div>

                {atendimento.observacoes_orcamento && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Observações para Orçamento</p>
                    <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                      {atendimento.observacoes_orcamento}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Ver detalhes do atendimento */}}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCriarOrcamento(atendimento)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Orçamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
