
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, MapPin, Edit, Trash2, Users } from "lucide-react";
import { useObras } from "@/hooks/useObras";
import { SafeDeleteDialog } from "@/components/common/SafeDeleteDialog";

const ObrasList = () => {
  const { obras, excluirObra, verificarRelacionamentos, isExcluindo } = useObras();
  const [obraSelecionada, setObraSelecionada] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planejamento":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "concluido":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Não definida";
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleDeleteClick = (obra: any) => {
    setObraSelecionada(obra);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (obraSelecionada) {
      excluirObra(obraSelecionada.id);
      setIsDeleteDialogOpen(false);
      setObraSelecionada(null);
    }
  };

  if (obras.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma obra cadastrada</h3>
          <p className="text-muted-foreground text-center">
            Comece criando sua primeira obra para gerenciar seus projetos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Obras Cadastradas ({obras.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Previsão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obras.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell className="font-medium">{obra.nome}</TableCell>
                    <TableCell className="max-w-xs truncate">{obra.endereco}</TableCell>
                    <TableCell>
                      {obra.cliente ? (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {obra.cliente.nome}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sem cliente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(obra.status)}>
                        {obra.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {formatDate(obra.data_inicio)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {formatDate(obra.data_previsao)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(obra)}
                          disabled={isExcluindo}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SafeDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Obra"
        itemName={obraSelecionada?.nome || ''}
        isLoading={isExcluindo}
        onCheckRelations={() => verificarRelacionamentos(obraSelecionada?.id || '')}
      />
    </>
  );
};

export default ObrasList;
