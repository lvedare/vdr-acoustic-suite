import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { 
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart,
  Calendar,
  FileText,
  Filter,
  Package2,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Truck
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Material } from "@/types/estoque";

// Import the components we just created
import { EstoqueSummaryCards } from "@/components/estoque/EstoqueSummaryCards";
import { EstoqueFilterBar } from "@/components/estoque/EstoqueFilterBar";
import { EstoqueMateriaisTable } from "@/components/estoque/EstoqueMateriaisTable";
import { EstoqueBaixoAlert } from "@/components/estoque/EstoqueBaixoAlert";
import { MovimentacoesPlaceholder, RelatoriosPlaceholder } from "@/components/estoque/EstoquePlaceholders";

// Sample data for materials
const materiaisMock = [
  {
    id: 1,
    codigo: "LA-ROCHA-50",
    nome: "Lã de Rocha 50mm",
    descricao: "Placa de lã de rocha com densidade 32kg/m³ e espessura 50mm",
    categoria: "Isolantes",
    unidade: "m²",
    quantidadeEstoque: 120,
    estoqueMinimo: 100,
    valorUnitario: 28.5,
    fornecedor: "Rockfibras",
    localizacao: "Prateleira A1"
  },
  {
    id: 2,
    codigo: "PERF-MET-F530",
    nome: "Perfil Metálico F530",
    descricao: "Perfil metálico galvanizado tipo F530 para fixação de forros",
    categoria: "Estruturas",
    unidade: "m",
    quantidadeEstoque: 350,
    estoqueMinimo: 500,
    valorUnitario: 8.75,
    fornecedor: "Knauf",
    localizacao: "Prateleira B2"
  },
  {
    id: 3,
    codigo: "PAINEL-ACUST-60",
    nome: "Painel Acústico 60mm",
    descricao: "Painel absorvedor acústico com acabamento em tecido, espessura 60mm",
    categoria: "Absorvedores",
    unidade: "pç",
    quantidadeEstoque: 45,
    estoqueMinimo: 30,
    valorUnitario: 145.9,
    fornecedor: "AcusticSound",
    localizacao: "Prateleira C1"
  }
];

const Estoque = () => {
  const [materiais, setMateriais] = useState<Material[]>(materiaisMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroEstoque, setFiltroEstoque] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter materials based on search and filter
  const materiaisFiltrados = materiais.filter(material => {
    const matchesSearch = 
      material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !filtroCategoria || material.categoria === filtroCategoria;
    
    const matchesEstoque = !filtroEstoque || 
      (filtroEstoque === "baixo" && material.quantidadeEstoque < material.estoqueMinimo) ||
      (filtroEstoque === "normal" && material.quantidadeEstoque >= material.estoqueMinimo);
    
    return matchesSearch && matchesCategoria && matchesEstoque;
  });
  
  // Unique categories for filter
  const categorias = Array.from(new Set(materiais.map(m => m.categoria)));
  
  // Format currency
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };
  
  // Check stock status
  const getEstoqueStatus = (material: { quantidadeEstoque: number, estoqueMinimo: number }) => {
    if (material.quantidadeEstoque <= 0) {
      return { 
        status: "esgotado", 
        badge: "bg-red-100 text-red-800",
        texto: "Esgotado" 
      };
    } else if (material.quantidadeEstoque < material.estoqueMinimo) {
      return { 
        status: "baixo", 
        badge: "bg-amber-100 text-amber-800",
        texto: "Baixo" 
      };
    } else {
      return { 
        status: "normal", 
        badge: "bg-emerald-100 text-emerald-800",
        texto: "Normal" 
      };
    }
  };
  
  // Count items with low stock
  const contarItensBaixoEstoque = (): number => {
    return materiais.filter(m => m.quantidadeEstoque < m.estoqueMinimo).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Controle de Estoque</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Movimentação
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Material
          </Button>
        </div>
      </div>
      
      {/* Summary Cards Component */}
      <EstoqueSummaryCards 
        materiais={materiais} 
        formatarMoeda={formatarMoeda} 
      />
      
      <Tabs defaultValue="inventario" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventario">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Materiais em Estoque</CardTitle>
                
                {/* Filter Bar Component */}
                <EstoqueFilterBar 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filtroCategoria={filtroCategoria}
                  setFiltroCategoria={setFiltroCategoria}
                  filtroEstoque={filtroEstoque}
                  setFiltroEstoque={setFiltroEstoque}
                  categorias={categorias}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Materials Table Component */}
              <EstoqueMateriaisTable 
                materiaisFiltrados={materiaisFiltrados}
                getEstoqueStatus={getEstoqueStatus}
                formatarMoeda={formatarMoeda}
              />
              
              {/* Low Stock Alert Component */}
              <EstoqueBaixoAlert contarItensBaixoEstoque={contarItensBaixoEstoque} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="movimentacoes">
          <MovimentacoesPlaceholder />
        </TabsContent>
        
        <TabsContent value="relatorios">
          <RelatoriosPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estoque;
