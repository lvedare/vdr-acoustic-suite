
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface AtendimentoSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const AtendimentoSearchBar = ({ searchTerm, onSearchChange }: AtendimentoSearchBarProps) => {
  return (
    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente, assunto ou conteúdo..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtrar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Todos</DropdownMenuItem>
          <DropdownMenuItem>Novos</DropdownMenuItem>
          <DropdownMenuItem>Em andamento</DropdownMenuItem>
          <DropdownMenuItem>Agendados</DropdownMenuItem>
          <DropdownMenuItem>Convertidos</DropdownMenuItem>
          <DropdownMenuItem>Críticos</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline">
        <ArrowUpDown className="mr-2 h-4 w-4" /> Ordenar
      </Button>
    </div>
  );
};

export default AtendimentoSearchBar;
