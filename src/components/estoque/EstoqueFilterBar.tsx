
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface EstoqueFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filtroCategoria: string | null;
  setFiltroCategoria: (categoria: string | null) => void;
  filtroEstoque: string | null;
  setFiltroEstoque: (estoque: string | null) => void;
  categorias: string[];
  // For compatibility with Estoque.tsx
  categoria?: string;
  setCategoria?: (categoria: string | null) => void;
  status?: string | null;
  setStatus?: (status: string | null) => void;
}

export const EstoqueFilterBar = ({
  searchTerm,
  setSearchTerm,
  filtroCategoria,
  setFiltroCategoria,
  filtroEstoque,
  setFiltroEstoque,
  categorias,
  categoria,
  setCategoria,
  status,
  setStatus
}: EstoqueFilterBarProps) => {
  // If we're using the old prop names, map them to the new prop names
  const effectiveFiltroCategoria = filtroCategoria || categoria || null;
  const effectiveSetFiltroCategoria = setFiltroCategoria || setCategoria || (() => {});
  const effectiveFiltroEstoque = filtroEstoque || status || null;
  const effectiveSetFiltroEstoque = setFiltroEstoque || setStatus || (() => {});

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar materiais..."
          className="pl-8 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={effectiveFiltroCategoria || "todas"}
          onValueChange={(value) => effectiveSetFiltroCategoria(value === "todas" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{effectiveFiltroCategoria || "Todas as Categorias"}</span>
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
          value={effectiveFiltroEstoque || "todos"}
          onValueChange={(value) => effectiveSetFiltroEstoque(value === "todos" ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <div className="flex items-center gap-2">
              <span>{effectiveFiltroEstoque === "baixo" ? "Estoque Baixo" : effectiveFiltroEstoque === "normal" ? "Estoque Normal" : "Todos"}</span>
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
};
