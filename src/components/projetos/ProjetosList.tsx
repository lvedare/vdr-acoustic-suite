
import React from "react";
import { FileText } from "lucide-react";
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

interface Projeto {
  id: number;
  nome: string;
  cliente: string;
  status: string;
  tipo: string;
  dataInicio: string;
  dataPrevisao: string;
  dataConclusao?: string;
}

interface ProjetosListProps {
  projetos: Projeto[];
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }>;
  formatarData: (data: string) => string;
}

export function ProjetosList({ projetos, statusMap, formatarData }: ProjetosListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Previsão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projetos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Nenhum projeto encontrado com os filtros atuais.
              </TableCell>
            </TableRow>
          ) : (
            projetos.map((projeto) => (
              <TableRow key={projeto.id}>
                <TableCell className="font-medium">{projeto.nome}</TableCell>
                <TableCell>{projeto.cliente}</TableCell>
                <TableCell className="capitalize">{projeto.tipo}</TableCell>
                <TableCell>{formatarData(projeto.dataInicio)}</TableCell>
                <TableCell>{formatarData(projeto.dataPrevisao)}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[projeto.status].variant}>
                    {statusMap[projeto.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
