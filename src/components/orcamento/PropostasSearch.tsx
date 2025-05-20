
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface PropostasSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PropostasSearch = ({ searchTerm, onSearchChange }: PropostasSearchProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl">Gerenciamento de Propostas</CardTitle>
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar propostas..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PropostasSearch;
