
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface ProdutoFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filtroCategoria: string | null;
  setFiltroCategoria: (value: string | null) => void;
  filtroEstoque: string | null;
  setFiltroEstoque: (value: string | null) => void;
  categorias: string[];
}

export function ProdutoFilterBar({
  searchTerm,
  setSearchTerm,
  filtroCategoria,
  setFiltroCategoria,
  filtroEstoque,
  setFiltroEstoque,
  categorias
}: ProdutoFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          className="pl-8 w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={filtroCategoria || "todas"}
          onValueChange={(value) => setFiltroCategoria(value === "todas" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filtroCategoria || "Todas as Categorias"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Categorias</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filtroEstoque || "todos"}
          onValueChange={(value) => setFiltroEstoque(value === "todos" ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <div className="flex items-center gap-2">
              <span>{filtroEstoque === "baixo" ? "Estoque Baixo" : filtroEstoque === "normal" ? "Estoque Normal" : "Todos"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="baixo">Estoque Baixo</SelectItem>
            <SelectItem value="normal">Estoque Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
