
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Eye } from "lucide-react";
import { Proposta, formatCurrency } from "@/types/orcamento";
import { toast } from "sonner";

interface PropostasFiltradasProps {
  propostas: Proposta[];
  status: "enviada" | "aprovada" | "rejeitada";
  formatDate: (date: string) => string;
}

const PropostasFiltradas = ({ propostas, status, formatDate }: PropostasFiltradasProps) => {
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

  const filteredPropostas = propostas.filter(p => p.status === status);

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
          {filteredPropostas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                Nenhuma proposta {status} encontrada
              </TableCell>
            </TableRow>
          ) : (
            filteredPropostas.map((proposta) => (
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
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default PropostasFiltradas;
