
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Package, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useProdutosAcabados } from "@/hooks/useProdutosAcabados";
import { useOrdemProducao } from "@/hooks/useOrdemProducao";
import { SafeDeleteDialog } from "@/components/common/SafeDeleteDialog";

interface ProducaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ordem?: any;
  onSave?: (ordem: any) => void;
  mode?: "create" | "edit" | "view";
}

export const ProducaoDialog = ({ 
  isOpen, 
  onOpenChange, 
  ordem, 
  onSave,
  mode = "create" 
}: ProducaoDialogProps) => {
  const { produtos } = useProdutosAcabados();
  const { excluirOrdem, verificarRelacionamentos, isExcluindo } = useOrdemProducao();
  
  const [numero, setNumero] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [status, setStatus] = useState("pendente");
  const [dataPedido, setDataPedido] = useState<Date>(new Date());
  const [dataPrevisao, setDataPrevisao] = useState<Date | undefined>();
  const [observacoes, setObservacoes] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (ordem && mode !== "create") {
      setNumero(ordem.numero || "");
      setProdutoId(ordem.produto_id || "");
      setQuantidade(ordem.quantidade || 1);
      setStatus(ordem.status || "pendente");
      setDataPedido(ordem.data_pedido ? new Date(ordem.data_pedido) : new Date());
      setDataPrevisao(ordem.data_previsao ? new Date(ordem.data_previsao) : undefined);
      setObservacoes(ordem.observacoes || "");
    } else {
      // Reset form for create mode
      setNumero("");
      setProdutoId("");
      setQuantidade(1);
      setStatus("pendente");
      setDataPedido(new Date());
      setDataPrevisao(undefined);
      setObservacoes("");
    }
  }, [ordem, mode]);

  const handleSave = () => {
    const ordemData = {
      numero,
      produto_id: produtoId,
      quantidade,
      status,
      data_pedido: dataPedido.toISOString().split('T')[0],
      data_previsao: dataPrevisao?.toISOString().split('T')[0],
      observacoes
    };

    if (onSave) {
      onSave(ordemData);
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (ordem) {
      excluirOrdem(ordem.id);
      setIsDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };

  const isReadOnly = mode === "view";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {mode === "create" ? "Nova Ordem de Produção" : 
               mode === "edit" ? "Editar Ordem de Produção" : 
               "Visualizar Ordem de Produção"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="OP-001"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus} disabled={isReadOnly}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Produto</Label>
              <Select value={produtoId} onValueChange={setProdutoId} disabled={isReadOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id.toString()}>
                      {produto.codigo} - {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                disabled={isReadOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Pedido</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataPedido && "text-muted-foreground"
                      )}
                      disabled={isReadOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataPedido ? format(dataPedido, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataPedido}
                      onSelect={(date) => date && setDataPedido(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Previsão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataPrevisao && "text-muted-foreground"
                      )}
                      disabled={isReadOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataPrevisao ? format(dataPrevisao, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataPrevisao}
                      onSelect={setDataPrevisao}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre a ordem de produção..."
                disabled={isReadOnly}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {mode === "edit" && ordem && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isExcluindo}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {isReadOnly ? "Fechar" : "Cancelar"}
              </Button>
              {!isReadOnly && (
                <Button onClick={handleSave}>
                  {mode === "create" ? "Criar" : "Salvar"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SafeDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Ordem de Produção"
        itemName={ordem?.numero || ''}
        isLoading={isExcluindo}
        onCheckRelations={() => verificarRelacionamentos(ordem?.id || '')}
      />
    </>
  );
};
