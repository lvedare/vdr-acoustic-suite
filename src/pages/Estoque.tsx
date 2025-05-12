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
  const [materiais, setMateriais] = useState(materiaisMock);
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
  
  // Calculate total value in stock
  const calcularValorTotalEstoque = (): number => {
    return materiais.reduce((total, material) => {
      return total + (material.quantidadeEstoque * material.valorUnitario);
    }, 0);
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materiais.reduce((acc, material) => acc + material.quantidadeEstoque, 0)}
              <span className="text-sm font-normal text-muted-foreground ml-2">itens</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(calcularValorTotalEstoque())}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Itens com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              {contarItensBaixoEstoque()}
            </div>
            {contarItensBaixoEstoque() > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-800">
                Atenção
              </Badge>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              12
              <span className="text-sm font-normal text-muted-foreground ml-2">esta semana</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead className="text-right">Qtde.</TableHead>
                      <TableHead className="hidden lg:table-cell">Estoque Mín.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Valor Un.</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materiaisFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Nenhum material encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      materiaisFiltrados.map((material) => {
                        const { badge, texto } = getEstoqueStatus(material);
                        return (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.codigo}</TableCell>
                            <TableCell>
                              <div>
                                {material.nome}
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                  {material.descricao.length > 30
                                    ? `${material.descricao.substring(0, 30)}...`
                                    : material.descricao}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{material.categoria}</TableCell>
                            <TableCell className="text-right">
                              {material.quantidadeEstoque} {material.unidade}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{material.estoqueMinimo}</TableCell>
                            <TableCell>
                              <Badge className={badge} variant="secondary">
                                {texto}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{formatarMoeda(material.valorUnitario)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="Registrar Movimentação"
                                >
                                  <PackagePlus className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="Editar Material"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="rounded-full bg-amber-100 p-2">
                      <AlertCircle className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800">Atenção para Estoque Baixo</h3>
                      <p className="text-sm text-amber-700">
                        {contarItensBaixoEstoque()} itens estão abaixo do estoque mínimo recomendado.
                        {contarItensBaixoEstoque() > 0 && 
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-amber-800 font-semibold"
                            onClick={() => navigate("/financeiro")}
                          >
                            É recomendável fazer uma nova compra.
                          </Button>
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="movimentacoes">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
              <CardDescription>Entradas e saídas de materiais do estoque</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-60">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Histórico de movimentações será implementado em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Estoque</CardTitle>
              <CardDescription>Análise e estatísticas do estoque</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-60">
              <div className="text-center">
                <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Relatórios de estoque serão implementados em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estoque;
