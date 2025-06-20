
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Proposta, formatCurrency } from "@/types/orcamento";

interface PropostaDetailsDialogProps {
  proposta: Proposta;
  formatDate: (date: string) => string;
  onDownloadPDF: (proposta: Proposta) => void;
}

const PropostaDetailsDialog = ({ proposta, formatDate, onDownloadPDF }: PropostaDetailsDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>Detalhes da Proposta</DialogTitle>
        <DialogDescription>
          Proposta {proposta.numero} - {formatDate(proposta.data)}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-2">
          <h3 className="font-medium">Informações do Cliente</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Nome:</span> {proposta.cliente.nome}
            </div>
            <div>
              <span className="font-medium">Empresa:</span> {proposta.cliente.empresa || 'N/A'}
            </div>
            <div>
              <span className="font-medium">E-mail:</span> {proposta.cliente.email}
            </div>
            <div>
              <span className="font-medium">Telefone:</span> {proposta.cliente.telefone}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Itens da Proposta</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposta.itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell className="max-w-[250px] truncate" title={item.descricao}>
                    {item.descricao}
                  </TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.valorUnitario)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.valorTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Informações Comerciais</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Forma de Pagamento:</span> {proposta.formaPagamento}
            </div>
            <div>
              <span className="font-medium">Prazo de Entrega:</span> {proposta.prazoEntrega}
            </div>
            <div>
              <span className="font-medium">Prazo de Obra:</span> {proposta.prazoObra}
            </div>
            <div>
              <span className="font-medium">Validade:</span> {proposta.validade}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Observações</h3>
          <p className="text-sm whitespace-pre-line">{proposta.observacoes}</p>
        </div>
      </div>
      
      <DialogFooter className="flex justify-between items-center">
        <span className="text-xl font-medium">
          Total: {formatCurrency(proposta.valorTotal)}
        </span>
        <Button onClick={() => onDownloadPDF(proposta)}>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PropostaDetailsDialog;
