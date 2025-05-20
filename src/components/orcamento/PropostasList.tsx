
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, Edit, Copy, Check, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Proposta, formatCurrency } from "@/types/orcamento";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
                      <DialogContent className="sm:max-w-[650px]">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Proposta</DialogTitle>
                          <DialogDescription>
                            Proposta {proposta.numero} - {formatDate(proposta.data)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <PropostaDetailsView proposta={proposta} formatCurrency={formatCurrency} />
                        
                        <DialogFooter className="flex justify-between items-center">
                          <span className="text-xl font-medium">
                            Total: {formatCurrency(proposta.valorTotal)}
                          </span>
                          <Button onClick={() => handleDownloadPDF(proposta)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </DialogFooter>
                      </DialogContent>
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
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alterar Status</DialogTitle>
                          <DialogDescription>
                            Selecione o novo status para a proposta {proposta.numero}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <StatusChangeButtons 
                          propostaId={proposta.id} 
                          currentStatus={proposta.status} 
                          onChangeStatus={onChangeStatus} 
                          getStatusColor={getStatusColor}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar exclusão</DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja excluir a proposta {proposta.numero}?
                            Esta ação não pode ser desfeita.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <DialogFooter>
                          <Button
                            variant="destructive" 
                            onClick={() => {
                              onDelete(proposta.id);
                              document.querySelector("dialog")?.close();
                            }}
                          >
                            Excluir
                          </Button>
                        </DialogFooter>
                      </DialogContent>
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

// Component for status change buttons
const StatusChangeButtons = ({ 
  propostaId, 
  currentStatus, 
  onChangeStatus, 
  getStatusColor 
}: { 
  propostaId: number; 
  currentStatus: string;
  onChangeStatus: (id: number, status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => void;
  getStatusColor: (status: string) => string;
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 py-4">
      <Button
        variant="outline"
        onClick={() => {
          onChangeStatus(propostaId, "enviada");
          document.querySelector("dialog")?.close();
        }}
        className={`justify-start ${currentStatus === 'enviada' ? 'border-blue-500' : ''}`}
      >
        <Badge variant="outline" className={getStatusColor("enviada")}>ENVIADA</Badge>
      </Button>
      
      <Button
        variant="outline"
        onClick={() => {
          onChangeStatus(propostaId, "aprovada");
          document.querySelector("dialog")?.close();
        }}
        className={`justify-start ${currentStatus === 'aprovada' ? 'border-green-500' : ''}`}
      >
        <Badge variant="outline" className={getStatusColor("aprovada")}>APROVADA</Badge>
      </Button>
      
      <Button
        variant="outline"
        onClick={() => {
          onChangeStatus(propostaId, "rejeitada");
          document.querySelector("dialog")?.close();
        }}
        className={`justify-start ${currentStatus === 'rejeitada' ? 'border-red-500' : ''}`}
      >
        <Badge variant="outline" className={getStatusColor("rejeitada")}>REJEITADA</Badge>
      </Button>
      
      <Button
        variant="outline"
        onClick={() => {
          onChangeStatus(propostaId, "expirada");
          document.querySelector("dialog")?.close();
        }}
        className={`justify-start ${currentStatus === 'expirada' ? 'border-yellow-500' : ''}`}
      >
        <Badge variant="outline" className={getStatusColor("expirada")}>EXPIRADA</Badge>
      </Button>
    </div>
  );
};

// Component for proposal details view
const PropostaDetailsView = ({ 
  proposta,
  formatCurrency
}: {
  proposta: Proposta;
  formatCurrency: (value: number) => string;
}) => {
  return (
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
  );
};

export default PropostasList;
