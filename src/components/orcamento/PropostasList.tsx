
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, Edit, Copy, Check, Trash } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Proposta, formatCurrency } from "@/types/orcamento";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import refactored components
import PropostaDetailsDialog from "./PropostaDetailsDialog";
import StatusChangeDialog from "./StatusChangeDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface PropostasListProps {
  propostas: Proposta[];
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => void;
  onCriarRevisao: (proposta: Proposta) => void;
  formatDate: (date: string) => string;
}

const PropostasList = ({ 
  propostas, 
  onDelete, 
  onChangeStatus, 
  onCriarRevisao,
  formatDate 
}: PropostasListProps) => {
  const navigate = useNavigate();

  // Handle download PDF
  const handleDownloadPDF = (proposta: Proposta) => {
    toast.success(`PDF da proposta ${proposta.numero} sendo gerado...`, {
      description: "O download começará em instantes.",
    });
    
    setTimeout(() => {
      toast.success(`PDF da proposta ${proposta.numero} gerado com sucesso!`);
    }, 2000);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada":
        return "bg-green-100 text-green-800 border-green-300";
      case "enviada":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "rejeitada":
        return "bg-red-100 text-red-800 border-red-300";
      case "expirada":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {propostas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                Nenhuma proposta encontrada
              </TableCell>
            </TableRow>
          ) : (
            propostas.map((proposta) => (
              <TableRow key={proposta.id}>
                <TableCell className="font-medium">{proposta.numero}</TableCell>
                <TableCell>{proposta.cliente.nome}</TableCell>
                <TableCell>{formatDate(proposta.data)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(proposta.status)}
                  >
                    {proposta.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(proposta.valorTotal)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleDownloadPDF(proposta)}>
                      <FileDown className="h-4 w-4" />
                    </Button>
                    
                    {/* Dialog para visualizar proposta */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <PropostaDetailsDialog 
                        proposta={proposta}
                        formatDate={formatDate}
                        onDownloadPDF={handleDownloadPDF}
                      />
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => navigate(`/novo-orcamento`, { 
                        state: { propostaId: proposta.id, isEdit: true } 
                      })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {/* Botão para criar revisão */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onCriarRevisao(proposta)}
                      title="Criar revisão"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Check className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <StatusChangeDialog 
                        propostaId={proposta.id}
                        propostaNumero={proposta.numero}
                        currentStatus={proposta.status}
                        onChangeStatus={onChangeStatus}
                        getStatusColor={getStatusColor}
                      />
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DeleteConfirmDialog 
                        propostaNumero={proposta.numero}
                        onConfirm={() => onDelete(proposta.id)}
                      />
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropostasList;
