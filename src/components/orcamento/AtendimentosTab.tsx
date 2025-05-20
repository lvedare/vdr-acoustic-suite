
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface AtendimentosTabProps {
  atendimentos: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCriarProposta: (atendimento: any) => void;
}

const AtendimentosTab = ({ 
  atendimentos, 
  searchTerm, 
  onSearchChange,
  onCriarProposta
}: AtendimentosTabProps) => {
  const [selectedAtendimento, setSelectedAtendimento] = useState<any | null>(null);
  
  // Get status color for atendimentos
  const getAtendimentoStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-blue-100 text-blue-800";
      case "Em andamento":
        return "bg-amber-100 text-amber-800";
      case "Agendado":
        return "bg-purple-100 text-purple-800";
      case "Convertido":
        return "bg-emerald-100 text-emerald-800";
      case "Crítico":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar atendimentos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Lista de atendimentos */}
        <div className="rounded-md border">
          <div className="flex flex-col divide-y">
            {atendimentos.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum atendimento encontrado.
              </div>
            ) : (
              atendimentos.map((atendimento) => (
                <div
                  key={atendimento.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                    selectedAtendimento?.id === atendimento.id
                      ? "bg-muted/50"
                      : ""
                  }`}
                  onClick={() => setSelectedAtendimento(atendimento)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{atendimento.cliente}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{atendimento.data}</span>
                      <span>{atendimento.hora}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm">{atendimento.assunto}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{atendimento.canal}</Badge>
                      <Badge
                        className={getAtendimentoStatusColor(atendimento.status)}
                        variant="secondary"
                      >
                        {atendimento.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detalhes do atendimento selecionado */}
        <div className="rounded-md border">
          {selectedAtendimento ? (
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Detalhes do Atendimento
                </h3>
                <Badge
                  className={getAtendimentoStatusColor(selectedAtendimento.status)}
                  variant="secondary"
                >
                  {selectedAtendimento.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Cliente</div>
                    <div className="font-medium">{selectedAtendimento.cliente}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Contato</div>
                    <div>{selectedAtendimento.contato}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Assunto</div>
                    <div>{selectedAtendimento.assunto}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Data e Hora</div>
                    <div>{selectedAtendimento.data} às {selectedAtendimento.hora}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Canal</div>
                    <Badge variant="outline">{selectedAtendimento.canal}</Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Mensagem</div>
                  <div className="rounded-md bg-muted p-3 text-sm">
                    {selectedAtendimento.mensagem}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  className="bg-vdr-blue hover:bg-blue-800"
                  onClick={() => onCriarProposta(selectedAtendimento)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Criar Proposta
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
              Selecione um atendimento para ver os detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtendimentosTab;
