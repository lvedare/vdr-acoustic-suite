
import React from "react";
import { FileText, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusConfig, formatarData as formatarDataFn } from "@/types/obra";

interface Obra {
  id: number;
  nome: string;
  endereco: string;
  cliente: string;
  status: string;
  dataInicio: string;
  dataPrevisao: string;
  dataConclusao?: string;
}

interface ObrasListProps {
  obras: Obra[];
  statusMap: Record<string, StatusConfig>;
  formatarData?: (data: string) => string;
  onEdit?: (obra: Obra) => void;
  onView?: (obra: Obra) => void;
}

export function ObrasList({ obras, statusMap, formatarData, onEdit, onView }: ObrasListProps) {
  // Use the imported formatter as a fallback if none is provided
  const formatDate = formatarData || formatarDataFn;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Previsão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obras.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Nenhuma obra encontrada com os filtros atuais.
              </TableCell>
            </TableRow>
          ) : (
            obras.map((obra) => (
              <TableRow key={obra.id}>
                <TableCell className="font-medium">{obra.nome}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {obra.endereco}
                  </div>
                </TableCell>
                <TableCell>{obra.cliente}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {formatDate(obra.dataInicio)}
                  </div>
                </TableCell>
                <TableCell>{formatDate(obra.dataPrevisao)}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[obra.status].variant}>
                    {statusMap[obra.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onView && onView(obra)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Ver detalhes</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
