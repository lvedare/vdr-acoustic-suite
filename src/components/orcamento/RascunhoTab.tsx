
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Proposta, formatCurrency } from "@/types/orcamento";
import { useNavigate } from "react-router-dom";

interface RascunhoTabProps {
  propostas: Proposta[];
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}

export function RascunhoTab({ propostas, onDelete, formatDate }: RascunhoTabProps) {
  const navigate = useNavigate();
  
  const rascunhos = propostas.filter(p => p.status === 'rascunho');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propostas em Rascunho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rascunhos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nenhuma proposta em rascunho encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                rascunhos.map((proposta) => (
                  <TableRow key={proposta.id}>
                    <TableCell className="font-medium">{proposta.numero}</TableCell>
                    <TableCell>{proposta.cliente.nome}</TableCell>
                    <TableCell>{formatDate(proposta.data)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(proposta.valorTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => navigate(`/novo-orcamento`, { 
                            state: { propostaId: proposta.id, isEdit: true } 
                          })}
                          title="Continuar editando"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => onDelete(proposta.id)}
                          title="Excluir rascunho"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
