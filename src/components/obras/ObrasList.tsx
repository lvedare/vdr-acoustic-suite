
import React, { useState } from "react";
import { FileText, MapPin, Calendar, Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusConfig, formatarData as formatarDataFn } from "@/types/obra";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { ItemActions } from "@/components/common/ItemActions";
import { usePropostas } from "@/hooks/usePropostas";
import { useObras } from "@/hooks/useSupabaseModules";
import { toast } from "sonner";

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
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export function ObrasList({ 
  obras, 
  statusMap, 
  formatarData, 
  onEdit, 
  onView, 
  onDelete,
  isDeleting = false 
}: ObrasListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [obraToDelete, setObraToDelete] = useState<Obra | null>(null);
  const [selectedPropostaId, setSelectedPropostaId] = useState<string>("");
  
  const { propostasAprovadas, converterParaObra } = usePropostas();
  const { criarObra, isCriando } = useObras();
  
  // Use the imported formatter as a fallback if none is provided
  const formatDate = formatarData || formatarDataFn;

  const handleDeleteClick = (obra: Obra) => {
    setObraToDelete(obra);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (obraToDelete && onDelete) {
      onDelete(obraToDelete.id);
      setDeleteDialogOpen(false);
      setObraToDelete(null);
    }
  };

  const handleCriarObraFromProposta = () => {
    if (!selectedPropostaId) {
      toast.error('Selecione uma proposta aprovada');
      return;
    }

    const proposta = propostasAprovadas.find(p => p.id.toString() === selectedPropostaId);
    if (!proposta) {
      toast.error('Proposta não encontrada');
      return;
    }

    const novaObra = converterParaObra(proposta);
    if (novaObra) {
      const clienteData = {
        ...novaObra,
        cliente_id: proposta.cliente.id.toString()
      };
      
      console.log('Criando obra com dados:', clienteData);
      criarObra(clienteData);
      setSelectedPropostaId("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Seção para criar obra a partir de proposta aprovada */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <label className="text-sm font-medium">Criar obra a partir de proposta aprovada:</label>
          <Select value={selectedPropostaId} onValueChange={setSelectedPropostaId}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Selecione uma proposta aprovada" />
            </SelectTrigger>
            <SelectContent>
              {propostasAprovadas.map((proposta) => (
                <SelectItem key={proposta.id} value={proposta.id.toString()}>
                  {proposta.numero} - {proposta.cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleCriarObraFromProposta}
          disabled={!selectedPropostaId || isCriando}
          className="mt-6"
        >
          <FileText className="h-4 w-4 mr-2" />
          {isCriando ? "Criando..." : "Criar Obra"}
        </Button>
      </div>

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
              <TableHead className="w-[120px]">Ações</TableHead>
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
                    <ItemActions
                      onView={() => onView && onView(obra)}
                      onEdit={() => onEdit && onEdit(obra)}
                      onDelete={() => handleDeleteClick(obra)}
                      isDeleting={isDeleting}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Obra"
        itemName={obraToDelete?.nome}
        isLoading={isDeleting}
      />
    </div>
  );
}
