
import React from "react";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ObrasFilterBarProps {
  search?: string;
  setSearch?: (value: string) => void;
  filter?: string;
  setFilter?: (value: string) => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  statusFiltro?: string;
  setStatusFiltro?: (value: string) => void;
}

export function ObrasFilterBar({ 
  search, 
  setSearch, 
  filter, 
  setFilter,
  searchTerm,
  setSearchTerm,
  statusFiltro,
  setStatusFiltro
}: ObrasFilterBarProps) {
  // Handle both API patterns
  const effectiveSearch = search || searchTerm || "";
  const effectiveSetSearch = setSearch || setSearchTerm || (() => {});
  const effectiveFilter = filter || statusFiltro || "todos";
  const effectiveSetFilter = setFilter || setStatusFiltro || (() => {});

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <div className="flex gap-2">
        <Input 
          placeholder="Buscar obra..." 
          className="w-full sm:w-auto" 
          value={effectiveSearch}
          onChange={(e) => effectiveSetSearch(e.target.value)}
        />
        <Select value={effectiveFilter} onValueChange={effectiveSetFilter}>
          <SelectTrigger className="w-auto">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="planejamento">Planejamento</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="concluido">Concluídas</SelectItem>
              <SelectItem value="cancelado">Canceladas</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
