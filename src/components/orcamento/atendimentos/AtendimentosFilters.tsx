
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AtendimentosFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  canalFilter: string;
  onCanalFilterChange: (value: string) => void;
}

export const AtendimentosFilters: React.FC<AtendimentosFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  canalFilter,
  onCanalFilterChange,
}) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Input
          placeholder="Buscar por cliente ou assunto..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <Select value={canalFilter} onValueChange={onCanalFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por canal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os canais</SelectItem>
          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
          <SelectItem value="Telefone">Telefone</SelectItem>
          <SelectItem value="Email">Email</SelectItem>
          <SelectItem value="Presencial">Presencial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
