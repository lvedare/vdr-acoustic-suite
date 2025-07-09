
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Plus, FileText } from "lucide-react";
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
  const [canalFilter, setCanalFilter] = useState("");
  const [atendimentosPendentes, setAtendimentosPendentes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar atendimentos com status "Enviado para Orçamento"
  useEffect(() => {
    const carregarAtendimentosPendentes = async () => {
      try {
        setIsLoading(true);
        console.log('Carregando atendimentos pendentes de orçamento...');

        const { data: atendimentos, error } = await supabase
          .from('atendimentos')
          .select(`
            *,
            cliente:clientes(*)
          `)
          .eq('status', 'Enviado para Orçamento')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar atendimentos pendentes:', error);
          toast.error('Erro ao carregar atendimentos pendentes');
          setAtendimentosPendentes([]);
        } else {
          console.log('Atendimentos pendentes carregados:', atendimentos);
          setAtendimentosPendentes(atendimentos || []);
        }
      } catch (error) {
        console.error('Erro ao carregar atendimentos pendentes:', error);
        toast.error('Erro inesperado ao carregar atendimentos');
        setAtendimentosPendentes([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarAtendimentosPendentes();
  }, []);

  // Filtrar atendimentos pendentes
  const atendimentosFiltrados = atendimentosPendentes.filter(atendimento => {
    const matchesSearch = !searchTerm || 
      atendimento.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.assunto?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCanal = !canalFilter || atendimento.canal === canalFilter;
    
    return matchesSearch && matchesCanal;
  });

  const handleCriarProposta = async (atendimento: any) => {
    try {
      // Gerar número da proposta
      const numeroPropostaSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      const numeroProposta = `PROP-${numeroPropostaSuffix}`;
      
      console.log('Criando proposta a partir do atendimento:', atendimento);
      
      // Criar proposta no Supabase
      const { data: novaProposta, error } = await supabase
        .from('propostas')
        .insert({
          numero: numeroProposta,
          data: new Date().toISOString().split('T')[0],
          cliente_id: atendimento.cliente_id,
          atendimento_id: atendimento.id,
          origem: 'atendimento',
          status: 'rascunho',
          observacoes: `Proposta gerada a partir do atendimento: ${atendimento.assunto}`,
          valor_total: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar proposta:', error);
        toast.error('Erro ao criar proposta');
        return;
      }

      console.log('Proposta criada com sucesso:', novaProposta);
      toast.success("Proposta criada com sucesso!");
      
      // Navegar para editar a proposta
      navigate(`/novo-orcamento`, { 
        state: { propostaId: Number(novaProposta.id), isEdit: true } 
      });
      
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast.error("Erro ao criar proposta");
    }
  };

  const handleVisualizarAtendimento = (atendimento: any) => {
    // Por enquanto, mostrar detalhes em alert (pode ser melhorado com um modal)
    const detalhes = `
Cliente: ${atendimento.cliente_nome}
${atendimento.cliente?.empresa ? `Empresa: ${atendimento.cliente.empresa}` : ''}
Assunto: ${atendimento.assunto}
Canal: ${atendimento.canal}
Contato: ${atendimento.contato}
Data: ${formatDate(atendimento.data)}
Mensagem: ${atendimento.mensagem || 'Nenhuma mensagem adicional'}
    `;
    alert(detalhes);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Carregando atendimentos pendentes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Atendimentos Pendentes de Orçamento</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Atendimentos enviados do módulo de CRM que precisam de propostas orçamentárias.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por cliente ou assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={canalFilter} onValueChange={setCanalFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os canais</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Telefone">Telefone</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Presencial">Presencial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Atendimentos Pendentes */}
      <div className="grid gap-4">
        {atendimentosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {atendimentosPendentes.length === 0 
                  ? "Nenhum atendimento foi enviado para orçamento ainda."
                  : "Nenhum atendimento encontrado com os filtros aplicados."
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Os atendimentos enviados do módulo de CRM aparecerão aqui para criação de propostas.
              </p>
            </CardContent>
          </Card>
        ) : (
          atendimentosFiltrados.map((atendimento) => (
            <Card key={atendimento.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{atendimento.cliente_nome}</span>
                      <Badge variant="secondary" className="text-xs">
                        Pendente
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {atendimento.cliente?.empresa && `${atendimento.cliente.empresa} • `}
                      {atendimento.assunto}
                    </p>
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
                    <p className="text-sm">{formatDate(atendimento.data)} {atendimento.hora}</p>
                  </div>
                </div>

                {atendimento.mensagem && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Mensagem</p>
                    <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                      {atendimento.mensagem}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisualizarAtendimento(atendimento)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCriarProposta(atendimento)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Proposta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Seção de Propostas Criadas (se houver) */}
      {propostas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Propostas Criadas a partir de Atendimentos</h3>
          <div className="grid gap-4">
            {propostas.map((proposta) => (
              <Card key={proposta.id} className="hover:shadow-md transition-shadow border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{proposta.numero}</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          Proposta Criada
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cliente: {proposta.cliente?.nome}
                        {proposta.cliente?.empresa && ` (${proposta.cliente.empresa})`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/visualizar-orcamento/${proposta.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Visualizar Proposta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
