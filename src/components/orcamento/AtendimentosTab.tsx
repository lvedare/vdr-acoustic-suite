
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AtendimentosTabProps {
  propostas: any[];
  formatDate: (date: string) => string;
}

export const AtendimentosTab: React.FC<AtendimentosTabProps> = ({ propostas, formatDate }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [atendimentosDetalhes, setAtendimentosDetalhes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar detalhes dos atendimentos
  useEffect(() => {
    const carregarAtendimentos = async () => {
      console.log('AtendimentosTab - propostas recebidas:', propostas);
      
      if (propostas.length === 0) {
        setAtendimentosDetalhes([]);
        setIsLoading(false);
        return;
      }

      try {
        const atendimentosIds = propostas
          .filter(p => p.atendimento_id)
          .map(p => p.atendimento_id);

        console.log('AtendimentosTab - IDs de atendimentos:', atendimentosIds);

        if (atendimentosIds.length === 0) {
          setAtendimentosDetalhes([]);
          setIsLoading(false);
          return;
        }

        const { data: atendimentos, error } = await supabase
          .from('atendimentos')
          .select(`
            *,
            cliente:clientes(empresa)
          `)
          .in('id', atendimentosIds);

        if (error) {
          console.error('Erro ao carregar atendimentos:', error);
          toast.error('Erro ao carregar detalhes dos atendimentos');
          setAtendimentosDetalhes([]);
        } else {
          console.log('AtendimentosTab - atendimentos carregados:', atendimentos);
          
          // Combinar dados das propostas com dados dos atendimentos
          const dadosCompletos = propostas.map(proposta => {
            const atendimento = atendimentos?.find(a => a.id === proposta.atendimento_id);
            return {
              ...proposta,
              atendimento: atendimento ? {
                ...atendimento,
                empresa: atendimento.cliente?.empresa || null
              } : null
            };
          });
          
          console.log('AtendimentosTab - dados completos:', dadosCompletos);
          setAtendimentosDetalhes(dadosCompletos);
        }
      } catch (error) {
        console.error('Erro ao carregar atendimentos:', error);
        toast.error('Erro inesperado ao carregar atendimentos');
        setAtendimentosDetalhes([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarAtendimentos();
  }, [propostas]);

  // Filtrar propostas de atendimentos
  const atendimentosFiltrados = atendimentosDetalhes.filter(item => {
    const atendimento = item.atendimento;
    if (!atendimento) return false;

    const matchesSearch = !searchTerm || 
      atendimento.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numero?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditarOrcamento = (proposta: any) => {
    navigate(`/novo-orcamento`, { 
      state: { propostaId: Number(proposta.id), isEdit: true } 
    });
  };

  const handleVisualizarOrcamento = (proposta: any) => {
    navigate(`/visualizar-orcamento/${proposta.id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'rascunho': { variant: 'secondary' as const, label: 'Rascunho' },
      'enviada': { variant: 'default' as const, label: 'Enviada' },
      'aprovada': { variant: 'outline' as const, label: 'Aprovada' },
      'rejeitada': { variant: 'destructive' as const, label: 'Rejeitada' },
      'expirada': { variant: 'secondary' as const, label: 'Expirada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['rascunho'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Carregando atendimentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Propostas Originadas de Atendimentos</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Propostas criadas a partir de atendimentos enviados do módulo de CRM.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por cliente, assunto ou número da proposta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="enviada">Enviada</SelectItem>
            <SelectItem value="aprovada">Aprovada</SelectItem>
            <SelectItem value="rejeitada">Rejeitada</SelectItem>
            <SelectItem value="expirada">Expirada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Propostas de Atendimentos */}
      <div className="grid gap-4">
        {atendimentosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {atendimentosDetalhes.length === 0 
                  ? "Nenhuma proposta de atendimento foi criada ainda."
                  : "Nenhuma proposta encontrada com os filtros aplicados."
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                As propostas criadas a partir de atendimentos aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          atendimentosFiltrados.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{item.numero}</span>
                      <Badge variant="outline" className="text-xs">
                        Atendimento
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cliente: {item.atendimento?.cliente_nome || 'N/A'}
                      {item.atendimento?.empresa && (
                        <span className="ml-2">({item.atendimento.empresa})</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assunto Original</p>
                    <p className="text-sm">{item.atendimento?.assunto || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Canal</p>
                    <p className="text-sm">{item.atendimento?.canal || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor da Proposta</p>
                    <p className="text-sm font-medium">{formatCurrency(item.valor_total || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data da Proposta</p>
                    <p className="text-sm">{formatDate(item.data)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contato</p>
                    <p className="text-sm">{item.atendimento?.contato || 'N/A'}</p>
                  </div>
                </div>

                {item.observacoes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Observações</p>
                    <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                      {item.observacoes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisualizarOrcamento(item)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarOrcamento(item)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Proposta
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
