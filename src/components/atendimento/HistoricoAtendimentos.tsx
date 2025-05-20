
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatarData } from "@/utils/propostaUtils";
import { converterAtendimentoParaProposta } from "@/utils/propostaUtils";
import { toast } from "@/components/ui/sonner";

const HistoricoAtendimentos = () => {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar atendimentos do localStorage
    const savedAtendimentos = localStorage.getItem("atendimentos");
    if (savedAtendimentos) {
      setAtendimentos(JSON.parse(savedAtendimentos));
    }
  }, []);

  const handleCriarProposta = (atendimento: any) => {
    // Converter atendimento para proposta
    const novaProposta = converterAtendimentoParaProposta(atendimento);
    
    // Recuperar propostas existentes
    const propostasExistentes = JSON.parse(localStorage.getItem("propostas") || "[]");
    
    // Adicionar nova proposta
    const novasPropostas = [...propostasExistentes, novaProposta];
    
    // Salvar no localStorage
    localStorage.setItem("propostas", JSON.stringify(novasPropostas));
    
    toast.success("Proposta criada com sucesso!");
    
    // Redirecionar para criar nova proposta com o cliente selecionado
    navigate("/novo-orcamento", {
      state: { 
        clienteId: atendimento.clienteId,
        fromAtendimento: true, 
        atendimentoId: atendimento.id 
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atendimentos</CardTitle>
        <CardDescription>
          Visualize o histórico completo de atendimentos e crie propostas a partir deles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {atendimentos.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                Nenhum atendimento realizado até o momento.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {atendimentos.map((atendimento) => (
              <Card key={atendimento.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={atendimento.status === 'pendente' ? 'outline' : 'default'}>
                        {atendimento.status === 'pendente' ? 'Pendente' : 'Concluído'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ID: {atendimento.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{atendimento.cliente || 'Cliente não informado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{atendimento.data || formatarData(new Date().toISOString())}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="text-sm">{atendimento.mensagem || atendimento.assunto || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCriarProposta(atendimento)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Criar Proposta
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricoAtendimentos;
