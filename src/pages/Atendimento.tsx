
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, List, Kanban } from "lucide-react";
import { AtendimentoContent } from "@/components/atendimento/AtendimentoContent";
import NovoAtendimentoDialog from "@/components/atendimento/NovoAtendimentoDialog";
import { useAtendimentos } from "@/hooks/useAtendimentos";
import { toast } from "sonner";

const Atendimento = () => {
  const [view, setView] = useState<'lista' | 'kanban'>('lista');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [canalFilter, setCanalFilter] = useState("all");
  const [isNovoAtendimentoOpen, setIsNovoAtendimentoOpen] = useState(false);

  const { criarAtendimento } = useAtendimentos();

  const handleNovoAtendimento = async (novoAtendimento: any) => {
    try {
      await criarAtendimento(novoAtendimento);
      toast.success("Atendimento criado com sucesso!");
      setIsNovoAtendimentoOpen(false);
    } catch (error) {
      console.error("Erro ao criar atendimento:", error);
      toast.error("Erro ao criar atendimento");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atendimento</h1>
          <p className="text-muted-foreground">
            Gerencie todos os atendimentos e contatos com clientes
          </p>
        </div>
        <Button onClick={() => setIsNovoAtendimentoOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      {/* Filtros e Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-center flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar atendimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Novo">Novo</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Resolvido">Resolvido</SelectItem>
              <SelectItem value="Fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={canalFilter} onValueChange={setCanalFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Telefone">Telefone</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Controles de Visualização */}
        <div className="flex gap-2">
          <Button
            variant={view === 'lista' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('lista')}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            <Kanban className="h-4 w-4 mr-2" />
            Kanban
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <AtendimentoContent
        view={view}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        canalFilter={canalFilter}
      />

      {/* Dialog Novo Atendimento */}
      <NovoAtendimentoDialog
        isOpen={isNovoAtendimentoOpen}
        onOpenChange={setIsNovoAtendimentoOpen}
        onSubmit={handleNovoAtendimento}
      />
    </div>
  );
};

export default Atendimento;
