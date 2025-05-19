
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NovoAtendimentoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const NovoAtendimentoDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: NovoAtendimentoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-vdr-blue hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Atendimento</DialogTitle>
          <DialogDescription>
            Registre um novo atendimento no sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium" htmlFor="cliente">
                Cliente
              </label>
              <Input id="cliente" placeholder="Nome do cliente" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="contato">
                Contato
              </label>
              <Input id="contato" placeholder="Telefone ou e-mail" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="assunto">
                Assunto
              </label>
              <Input id="assunto" placeholder="Assunto do atendimento" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="mensagem">
                Mensagem
              </label>
              <textarea 
                id="mensagem" 
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Detalhes do atendimento"
              ></textarea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-vdr-blue hover:bg-blue-800" onClick={() => onSubmit({})}>
            Registrar Atendimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAtendimentoDialog;
