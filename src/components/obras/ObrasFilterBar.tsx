
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
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
}

export function ObrasFilterBar({ search, setSearch, filter, setFilter }: ObrasFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <div className="flex gap-2">
        <Input 
          placeholder="Buscar obra..." 
          className="w-full sm:w-auto" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filter} onValueChange={setFilter}>
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
