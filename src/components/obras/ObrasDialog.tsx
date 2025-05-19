
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Obra, ObraStatus, obraStatusMap } from "@/types/obra";

interface ObrasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (obra: Obra) => void;
  obra: Obra | null;
}

export function ObrasDialog({ isOpen, onOpenChange, onSave, obra }: ObrasDialogProps) {
  const [formData, setFormData] = useState<Omit<Obra, "id"> & { id?: number }>({
    nome: "",
    endereco: "",
    cliente: "",
    status: "planejamento",
    dataInicio: new Date().toISOString().split("T")[0],
    dataPrevisao: new Date().toISOString().split("T")[0],
  });

  // Atualiza o formulário quando uma obra for selecionada para edição
  useEffect(() => {
    if (obra) {
      setFormData({
        id: obra.id,
        nome: obra.nome,
        endereco: obra.endereco,
        cliente: obra.cliente,
        status: obra.status,
        dataInicio: obra.dataInicio,
        dataPrevisao: obra.dataPrevisao,
        dataConclusao: obra.dataConclusao,
      });
    } else {
      setFormData({
        nome: "",
        endereco: "",
        cliente: "",
        status: "planejamento",
        dataInicio: new Date().toISOString().split("T")[0],
        dataPrevisao: new Date().toISOString().split("T")[0],
      });
    }
  }, [obra, isOpen]);

  // Manipula a alteração nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manipula a alteração no select de status
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  // Manipula o salvamento da obra
  const handleSave = () => {
    if (!formData.nome || !formData.endereco || !formData.cliente) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // Convert to proper Obra type
    const obraToSave: Obra = {
      id: formData.id || Math.floor(Math.random() * 10000),
      nome: formData.nome,
      endereco: formData.endereco,
      cliente: formData.cliente,
      status: formData.status as ObraStatus,
      dataInicio: formData.dataInicio,
      dataPrevisao: formData.dataPrevisao,
      dataConclusao: formData.dataConclusao,
    };

    onSave(obraToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{obra ? "Editar Obra" : "Nova Obra"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome" className="text-right">
              Nome
            </Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endereco" className="text-right">
              Endereço
            </Label>
            <Input
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cliente" className="text-right">
              Cliente
            </Label>
            <Input
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(obraStatusMap).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataInicio" className="text-right">
              Data de Início
            </Label>
            <Input
              id="dataInicio"
              name="dataInicio"
              type="date"
              value={formData.dataInicio}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataPrevisao" className="text-right">
              Previsão
            </Label>
            <Input
              id="dataPrevisao"
              name="dataPrevisao"
              type="date"
              value={formData.dataPrevisao}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {formData.status === "concluido" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataConclusao" className="text-right">
                Conclusão
              </Label>
              <Input
                id="dataConclusao"
                name="dataConclusao"
                type="date"
                value={formData.dataConclusao || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
