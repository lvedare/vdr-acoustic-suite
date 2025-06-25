
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Phone, Mail } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { toast } from "sonner";

interface Atendimento {
  id: number;
  cliente: string;
  contato: string;
  assunto: string;
  data: string;
  hora: string;
  canal: string;
  status: string;
  mensagem: string;
}

interface AtendimentoKanbanViewProps {
  atendimentos: Atendimento[];
  onDeleteAtendimento: (id: number) => void;
  onChangeStatus: (id: number, newStatus: string) => void;
  onConverterEmOrcamento: (atendimento: Atendimento) => void;
}

const statusColumns = [
  { key: "Novo", label: "Novos", color: "bg-blue-50 border-blue-200" },
  { key: "Em andamento", label: "Em Andamento", color: "bg-amber-50 border-amber-200" },
  { key: "Agendado", label: "Agendados", color: "bg-purple-50 border-purple-200" },
  { key: "Convertido", label: "Convertidos", color: "bg-green-50 border-green-200" },
  { key: "Crítico", label: "Críticos", color: "bg-red-50 border-red-200" }
];

export function AtendimentoKanbanView({ 
  atendimentos, 
  onDeleteAtendimento, 
  onChangeStatus, 
  onConverterEmOrcamento 
}: AtendimentoKanbanViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [atendimentoToDelete, setAtendimentoToDelete] = useState<Atendimento | null>(null);

  const handleDeleteClick = (atendimento: Atendimento) => {
    setAtendimentoToDelete(atendimento);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (atendimentoToDelete) {
      onDeleteAtendimento(atendimentoToDelete.id);
      setDeleteDialogOpen(false);
      setAtendimentoToDelete(null);
      toast.success("Atendimento excluído com sucesso!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo": return "bg-blue-100 text-blue-800";
      case "Em andamento": return "bg-amber-100 text-amber-800";
      case "Agendado": return "bg-purple-100 text-purple-800";
      case "Convertido": return "bg-green-100 text-green-800";
      case "Crítico": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (atendimentoId: number, newStatus: string) => {
    onChangeStatus(atendimentoId, newStatus);
    toast.success(`Status alterado para ${newStatus}`);
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-full">
        {statusColumns.map((column) => {
          const columnAtendimentos = atendimentos.filter(a => a.status === column.key);
          
          return (
            <div key={column.key} className={`${column.color} p-4 rounded-lg border`}>
              <h3 className="font-semibold text-center mb-4 flex items-center justify-center gap-2">
                {column.label}
                <Badge variant="secondary">{columnAtendimentos.length}</Badge>
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {columnAtendimentos.map((atendimento) => (
                  <Card key={atendimento.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{atendimento.cliente}</CardTitle>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onConverterEmOrcamento(atendimento)}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick(atendimento)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{atendimento.assunto}</p>
                        <div className="flex items-center gap-2 text-xs">
                          {atendimento.canal === "WhatsApp" && <Phone className="h-3 w-3" />}
                          {atendimento.canal === "Email" && <Mail className="h-3 w-3" />}
                          <span>{atendimento.canal}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{atendimento.data} às {atendimento.hora}</p>
                        
                        {/* Botões para mudar status */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {statusColumns
                            .filter(s => s.key !== atendimento.status)
                            .map((status) => (
                              <Button
                                key={status.key}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                                onClick={() => handleStatusChange(atendimento.id, status.key)}
                              >
                                {status.key}
                              </Button>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Atendimento"
        itemName={atendimentoToDelete?.cliente}
      />
    </div>
  );
}
