
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
  Truck,
  Database
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
import { useProdutos, ProdutosProvider } from "@/contexts/ProdutosContext";
import { useInsumos, InsumosProvider } from "@/contexts/InsumosContext";
import { ProdutoAcabado } from "@/types/orcamento";
import { formatCurrency } from "@/types/orcamento";
import { Insumo } from "@/types/insumo";

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

interface QuantidadeEstoqueProps {
  item: {id: number, nome: string, codigo: string, quantidadeEstoque: number};
  tipo: 'produto' | 'insumo';
  onAtualizarEstoque: (id: number, novaQuantidade: number, tipo: 'produto' | 'insumo') => void;
}

const QuantidadeEstoqueDialog: React.FC<QuantidadeEstoqueProps> = ({ item, tipo, onAtualizarEstoque }) => {
  const [quantidade, setQuantidade] = useState<number>(item.quantidadeEstoque);
  const [open, setOpen] = useState(false);
  
  const handleSalvar = () => {
    onAtualizarEstoque(item.id, quantidade, tipo);
    setOpen(false);
    toast.success(`Estoque de ${tipo === 'produto' ? 'produto' : 'insumo'} atualizado com sucesso!`);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {item.quantidadeEstoque}
          <Pencil className="ml-1 h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar quantidade em estoque</DialogTitle>
          <DialogDescription>
            {item.codigo} - {item.nome}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade em estoque</Label>
            <Input
              id="quantidade"
              type="number"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EstoqueContent = () => {
  const [materiais, setMateriais] = useState<Material[]>(materiaisMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroEstoque, setFiltroEstoque] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("inventario");
  const [activeInventarioTab, setActiveInventarioTab] = useState("materiais");
  const navigate = useNavigate();
  
  const { produtos, setProdutos } = useProdutos();
  const { insumos, setInsumos } = useInsumos();

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
  
  // Filter produtos and insumos
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const insumosFiltrados = insumos.filter(insumo => 
    insumo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insumo.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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

  // Atualizar quantidade em estoque
  const atualizarQuantidadeEstoque = (id: number, novaQuantidade: number, tipo: 'produto' | 'insumo') => {
    if (tipo === 'produto') {
      const produtosAtualizados = produtos.map(p => 
        p.id === id ? { ...p, quantidadeEstoque: novaQuantidade } : p
      );
      setProdutos(produtosAtualizados);
    } else {
      const insumosAtualizados = insumos.map(i => 
        i.id === id ? { ...i, quantidadeEstoque: novaQuantidade } : i
      );
      setInsumos(insumosAtualizados);
    }
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventario">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Controle de Estoque</CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full max-w-[300px]"
                    />
                  </div>
                </div>
                
                <Tabs value={activeInventarioTab} onValueChange={setActiveInventarioTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="materiais">
                      <Package2 className="h-4 w-4 mr-2" />
                      Materiais
                    </TabsTrigger>
                    <TabsTrigger value="produtos">
                      <Database className="h-4 w-4 mr-2" />
                      Produtos Acabados
                    </TabsTrigger>
                    <TabsTrigger value="insumos">
                      <PackagePlus className="h-4 w-4 mr-2" />
                      Insumos
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="materiais" className="mt-0">
                {/* Materials Table Component */}
                <EstoqueMateriaisTable 
                  materiaisFiltrados={materiaisFiltrados}
                  getEstoqueStatus={getEstoqueStatus}
                  formatarMoeda={formatarMoeda}
                />
              </TabsContent>
              
              <TabsContent value="produtos" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Categoria</TableHead>
                        <TableHead>Unid.</TableHead>
                        <TableHead className="text-right">Valor Base</TableHead>
                        <TableHead className="text-center">Quantidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosFiltrados.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Nenhum produto encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        produtosFiltrados.map((produto) => (
                          <TableRow key={produto.id}>
                            <TableCell className="font-medium">{produto.codigo}</TableCell>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary" className="font-normal">
                                {produto.categoria}
                              </Badge>
                            </TableCell>
                            <TableCell>{produto.unidadeMedida}</TableCell>
                            <TableCell className="text-right">{formatCurrency(produto.valorBase)}</TableCell>
                            <TableCell className="text-center">
                              <QuantidadeEstoqueDialog 
                                item={produto}
                                tipo="produto"
                                onAtualizarEstoque={atualizarQuantidadeEstoque}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="insumos" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Categoria</TableHead>
                        <TableHead>Unid.</TableHead>
                        <TableHead className="text-right">Valor Custo</TableHead>
                        <TableHead className="text-center">Quantidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insumosFiltrados.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Nenhum insumo encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        insumosFiltrados.map((insumo) => (
                          <TableRow key={insumo.id}>
                            <TableCell className="font-medium">{insumo.codigo}</TableCell>
                            <TableCell>{insumo.nome}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary" className="font-normal">
                                {insumo.categoria}
                              </Badge>
                            </TableCell>
                            <TableCell>{insumo.unidadeMedida}</TableCell>
                            <TableCell className="text-right">{formatCurrency(insumo.valorCusto)}</TableCell>
                            <TableCell className="text-center">
                              <QuantidadeEstoqueDialog 
                                item={insumo}
                                tipo="insumo"
                                onAtualizarEstoque={atualizarQuantidadeEstoque}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
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

const Estoque = () => {
  // Wrapping the EstoqueContent with both ProdutosProvider and InsumosProvider
  return (
    <InsumosProvider>
      <ProdutosProvider>
        <EstoqueContent />
      </ProdutosProvider>
    </InsumosProvider>
  );
};

export default Estoque;
