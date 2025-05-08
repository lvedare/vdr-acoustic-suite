
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  FileText, 
  Filter, 
  PackageSearch, 
  Plus, 
  Search, 
  Truck, 
  Users2, 
  Pencil,
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  PackageCheck,
  Factory
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Interfaces
interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  contato: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  categoria: string[];
  observacoes?: string;
}

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: "ativo" | "inativo" | "afastado" | "ferias";
  observacoes?: string;
}

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  valorBase: number;
  estoque?: number;
  observacoes?: string;
}

// Dados mockados
const fornecedoresMock: Fornecedor[] = [
  {
    id: 1,
    nome: "Rockfibras Brasil",
    cnpj: "12.345.678/0001-90",
    email: "contato@rockfibras.com.br",
    telefone: "(11) 98765-4321",
    contato: "Roberto Silva",
    endereco: "Av. Industrial, 1500",
    cidade: "São Paulo",
    estado: "SP",
    cep: "04578-000",
    categoria: ["Isolantes", "Absorvedores"],
    observacoes: "Fornecedor principal de lã de rocha."
  },
  {
    id: 2,
    nome: "Acustic Materiais",
    cnpj: "23.456.789/0001-12",
    email: "vendas@acustic.com.br",
    telefone: "(11) 91234-5678",
    contato: "Ana Costa",
    endereco: "Rua dos Materiais, 230",
    cidade: "Guarulhos",
    estado: "SP",
    cep: "07090-000",
    categoria: ["Absorvedores", "Estruturas"],
    observacoes: "Fornecedor de materiais para absorção acústica."
  },
  {
    id: 3,
    nome: "Perfis Express",
    cnpj: "34.567.890/0001-23",
    email: "comercial@perfisexpress.com.br",
    telefone: "(21) 93333-4444",
    contato: "Marcos Rodrigues",
    endereco: "Rodovia BR-101, km 45",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "21000-000",
    categoria: ["Estruturas", "Fixações"],
    observacoes: "Especialista em perfis metálicos."
  },
  {
    id: 4,
    nome: "AcousticDoor",
    cnpj: "45.678.901/0001-34",
    email: "vendas@acousticdoor.com.br",
    telefone: "(31) 94444-5555",
    contato: "Paula Mendes",
    endereco: "Av. das Indústrias, 780",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30110-000",
    categoria: ["Portas e Janelas"],
    observacoes: "Fornecedor de portas acústicas de alta performance."
  },
  {
    id: 5,
    nome: "TechAcoustics",
    cnpj: "56.789.012/0001-45",
    email: "contato@techacoustics.com.br",
    telefone: "(11) 95555-6666",
    contato: "Ricardo Oliveira",
    endereco: "Rua Inovação, 450",
    cidade: "Campinas",
    estado: "SP",
    cep: "13083-000",
    categoria: ["Absorvedores", "Difusores"],
    observacoes: "Produtos acústicos de alta tecnologia."
  }
];

const colaboradoresMock: Colaborador[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@vdr.com",
    telefone: "(11) 99876-5432",
    cargo: "Gerente de Produção",
    departamento: "Produção",
    dataAdmissao: "2020-03-15",
    status: "ativo"
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    email: "maria.oliveira@vdr.com",
    telefone: "(11) 98765-4321",
    cargo: "Engenheira Acústica",
    departamento: "Projetos",
    dataAdmissao: "2021-06-10",
    status: "ativo"
  },
  {
    id: 3,
    nome: "Pedro Almeida",
    email: "pedro.almeida@vdr.com",
    telefone: "(11) 97654-3210",
    cargo: "Técnico de Instalação",
    departamento: "Obras",
    dataAdmissao: "2022-01-20",
    status: "ativo"
  },
  {
    id: 4,
    nome: "Ana Costa",
    email: "ana.costa@vdr.com",
    telefone: "(11) 96543-2109",
    cargo: "Vendedora",
    departamento: "Comercial",
    dataAdmissao: "2021-09-05",
    status: "ferias"
  },
  {
    id: 5,
    nome: "Carlos Santos",
    email: "carlos.santos@vdr.com",
    telefone: "(11) 95432-1098",
    cargo: "Coordenador de Projetos",
    departamento: "Projetos",
    dataAdmissao: "2019-12-01",
    status: "ativo"
  },
  {
    id: 6,
    nome: "Márcia Lima",
    email: "marcia.lima@vdr.com",
    telefone: "(11) 94321-0987",
    cargo: "Auxiliar Administrativo",
    departamento: "Administrativo",
    dataAdmissao: "2022-07-15",
    status: "ativo"
  }
];

const produtosMock: Produto[] = [
  {
    id: 1,
    codigo: "PA-60-STD",
    nome: "Painel Acústico Standard",
    descricao: "Painel absorvedor acústico 60x60cm com tecido",
    categoria: "Painéis Absorvedores",
    unidadeMedida: "pç",
    valorBase: 189.90
  },
  {
    id: 2,
    codigo: "PA-120-STD",
    nome: "Painel Acústico Standard 120",
    descricao: "Painel absorvedor acústico 60x120cm com tecido",
    categoria: "Painéis Absorvedores",
    unidadeMedida: "pç",
    valorBase: 349.90
  },
  {
    id: 3,
    codigo: "BT-60-STD",
    nome: "Bass Trap Standard",
    descricao: "Bass trap triangular com 60cm de altura",
    categoria: "Bass Traps",
    unidadeMedida: "pç",
    valorBase: 259.90
  },
  {
    id: 4,
    codigo: "DIF-QRS-60",
    nome: "Difusor QRD Standard 60",
    descricao: "Difusor acústico tipo QRD 60x60cm",
    categoria: "Difusores",
    unidadeMedida: "pç",
    valorBase: 289.90
  },
  {
    id: 5,
    codigo: "PA-ACUS-35dB",
    nome: "Porta Acústica 35dB",
    descricao: "Porta acústica com redução de 35dB",
    categoria: "Portas e Janelas",
    unidadeMedida: "pç",
    valorBase: 1990.00
  },
  {
    id: 6,
    codigo: "ISO-PISO-10",
    nome: "Isolador de Piso 10mm",
    descricao: "Manta isoladora para piso flutuante",
    categoria: "Isolamento",
    unidadeMedida: "m²",
    valorBase: 48.90
  },
  {
    id: 7,
    codigo: "BAF-120-50",
    nome: "Baffle Suspenso 120x50cm",
    descricao: "Baffle acústico para teto com 5cm de espessura",
    categoria: "Baffles",
    unidadeMedida: "pç",
    valorBase: 179.90
  }
];

const Cadastros = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(fornecedoresMock);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(colaboradoresMock);
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock);
  
  const [novoFornecedor, setNovoFornecedor] = useState<Omit<Fornecedor, "id">>({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    contato: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    categoria: [],
    observacoes: ""
  });
  
  const [novoColaborador, setNovoColaborador] = useState<Omit<Colaborador, "id">>({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    departamento: "",
    dataAdmissao: new Date().toISOString().split('T')[0],
    status: "ativo",
    observacoes: ""
  });
  
  const [novoProduto, setNovoProduto] = useState<Omit<Produto, "id">>({
    codigo: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidadeMedida: "pç",
    valorBase: 0,
    observacoes: ""
  });
  
  const [isNovoFornecedorDialogOpen, setIsNovoFornecedorDialogOpen] = useState(false);
  const [isNovoColaboradorDialogOpen, setIsNovoColaboradorDialogOpen] = useState(false);
  const [isNovoProdutoDialogOpen, setIsNovoProdutoDialogOpen] = useState(false);
  
  const [searchTerms, setSearchTerms] = useState({
    fornecedor: "",
    colaborador: "",
    produto: ""
  });
  
  const [filtros, setFiltros] = useState({
    categoriaFornecedor: "",
    departamento: "",
    categoriaProduto: ""
  });
  
  // Handlers para fornecedores
  const categoriasFornecedor = Array.from(
    new Set(fornecedores.flatMap(f => f.categoria))
  ).sort();
  
  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    const matchesSearch = 
      fornecedor.nome.toLowerCase().includes(searchTerms.fornecedor.toLowerCase()) ||
      fornecedor.cnpj.includes(searchTerms.fornecedor) ||
      fornecedor.contato.toLowerCase().includes(searchTerms.fornecedor.toLowerCase());
    
    const matchesCategoria = !filtros.categoriaFornecedor || 
      fornecedor.categoria.includes(filtros.categoriaFornecedor);
    
    return matchesSearch && matchesCategoria;
  });
  
  const handleSalvarFornecedor = () => {
    if (!novoFornecedor.nome || !novoFornecedor.cnpj) {
      toast.error("Preencha pelo menos o Nome e CNPJ");
      return;
    }
    
    const novoId = fornecedores.length > 0 
      ? Math.max(...fornecedores.map(f => f.id)) + 1 
      : 1;
    
    const fornecedorCriado: Fornecedor = {
      id: novoId,
      ...novoFornecedor
    };
    
    setFornecedores([...fornecedores, fornecedorCriado]);
    setIsNovoFornecedorDialogOpen(false);
    setNovoFornecedor({
      nome: "",
      cnpj: "",
      email: "",
      telefone: "",
      contato: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      categoria: [],
      observacoes: ""
    });
    
    toast.success("Fornecedor adicionado com sucesso!");
  };
  
  const toggleCategoriaFornecedor = (categoria: string) => {
    if (novoFornecedor.categoria.includes(categoria)) {
      setNovoFornecedor({
        ...novoFornecedor,
        categoria: novoFornecedor.categoria.filter(c => c !== categoria)
      });
    } else {
      setNovoFornecedor({
        ...novoFornecedor,
        categoria: [...novoFornecedor.categoria, categoria]
      });
    }
  };
  
  // Handlers para colaboradores
  const departamentos = Array.from(
    new Set(colaboradores.map(c => c.departamento))
  ).sort();
  
  const colaboradoresFiltrados = colaboradores.filter(colaborador => {
    const matchesSearch = 
      colaborador.nome.toLowerCase().includes(searchTerms.colaborador.toLowerCase()) ||
      colaborador.email.toLowerCase().includes(searchTerms.colaborador.toLowerCase()) ||
      colaborador.cargo.toLowerCase().includes(searchTerms.colaborador.toLowerCase());
    
    const matchesDepartamento = !filtros.departamento || 
      colaborador.departamento === filtros.departamento;
    
    return matchesSearch && matchesDepartamento;
  });
  
  const handleSalvarColaborador = () => {
    if (!novoColaborador.nome || !novoColaborador.email) {
      toast.error("Preencha pelo menos o Nome e Email");
      return;
    }
    
    const novoId = colaboradores.length > 0 
      ? Math.max(...colaboradores.map(c => c.id)) + 1 
      : 1;
    
    const colaboradorCriado: Colaborador = {
      id: novoId,
      ...novoColaborador
    };
    
    setColaboradores([...colaboradores, colaboradorCriado]);
    setIsNovoColaboradorDialogOpen(false);
    setNovoColaborador({
      nome: "",
      email: "",
      telefone: "",
      cargo: "",
      departamento: "",
      dataAdmissao: new Date().toISOString().split('T')[0],
      status: "ativo",
      observacoes: ""
    });
    
    toast.success("Colaborador adicionado com sucesso!");
  };
  
  // Handlers para produtos
  const categoriasProduto = Array.from(
    new Set(produtos.map(p => p.categoria))
  ).sort();
  
  const produtosFiltrados = produtos.filter(produto => {
    const matchesSearch = 
      produto.nome.toLowerCase().includes(searchTerms.produto.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerms.produto.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerms.produto.toLowerCase());
    
    const matchesCategoria = !filtros.categoriaProduto || 
      produto.categoria === filtros.categoriaProduto;
    
    return matchesSearch && matchesCategoria;
  });
  
  const handleSalvarProduto = () => {
    if (!novoProduto.codigo || !novoProduto.nome || !novoProduto.categoria) {
      toast.error("Preencha os campos obrigatórios: Código, Nome e Categoria");
      return;
    }
    
    const novoId = produtos.length > 0 
      ? Math.max(...produtos.map(p => p.id)) + 1 
      : 1;
    
    const produtoCriado: Produto = {
      id: novoId,
      ...novoProduto
    };
    
    setProdutos([...produtos, produtoCriado]);
    setIsNovoProdutoDialogOpen(false);
    setNovoProduto({
      codigo: "",
      nome: "",
      descricao: "",
      categoria: "",
      unidadeMedida: "pç",
      valorBase: 0,
      observacoes: ""
    });
    
    toast.success("Produto adicionado com sucesso!");
  };
  
  // Formatar valor para moeda
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };
  
  // Formatar data
  const formatarData = (data: string): string => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };
  
  // Obter cor para status do colaborador
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ativo":
        return "bg-emerald-100 text-emerald-800";
      case "inativo":
        return "bg-gray-100 text-gray-800";
      case "afastado":
        return "bg-amber-100 text-amber-800";
      case "ferias":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastros</h1>
      </div>
      
      <Tabs defaultValue="fornecedores" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="fornecedores">
            <Truck className="mr-2 h-4 w-4" />
            Fornecedores
          </TabsTrigger>
          <TabsTrigger value="colaboradores">
            <Users2 className="mr-2 h-4 w-4" />
            Colaboradores
          </TabsTrigger>
          <TabsTrigger value="produtos">
            <PackageSearch className="mr-2 h-4 w-4" />
            Produtos
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Fornecedores */}
        <TabsContent value="fornecedores" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar fornecedores por nome, CNPJ ou contato..."
                className="pl-8"
                value={searchTerms.fornecedor}
                onChange={(e) => setSearchTerms({...searchTerms, fornecedor: e.target.value})}
              />
            </div>
            <Select
              value={filtros.categoriaFornecedor}
              onValueChange={(value) => setFiltros({...filtros, categoriaFornecedor: value})}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{filtros.categoriaFornecedor || "Todas Categorias"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas Categorias</SelectItem>
                {categoriasFornecedor.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isNovoFornecedorDialogOpen} onOpenChange={setIsNovoFornecedorDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Novo Fornecedor</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo fornecedor no sistema
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da Empresa *</Label>
                      <Input 
                        id="nome" 
                        value={novoFornecedor.nome}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, nome: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input 
                        id="cnpj" 
                        value={novoFornecedor.cnpj}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, cnpj: e.target.value})}
                        placeholder="XX.XXX.XXX/0001-XX"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={novoFornecedor.email}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input 
                        id="telefone" 
                        value={novoFornecedor.telefone}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, telefone: e.target.value})}
                        placeholder="(XX) XXXXX-XXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contato">Nome do Contato</Label>
                      <Input 
                        id="contato" 
                        value={novoFornecedor.contato}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, contato: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input 
                        id="endereco" 
                        value={novoFornecedor.endereco}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, endereco: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input 
                        id="cidade" 
                        value={novoFornecedor.cidade}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, cidade: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={novoFornecedor.estado}
                        onValueChange={(value) => setNovoFornecedor({...novoFornecedor, estado: value})}
                      >
                        <SelectTrigger id="estado">
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">AC</SelectItem>
                          <SelectItem value="AL">AL</SelectItem>
                          <SelectItem value="AP">AP</SelectItem>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                          <SelectItem value="DF">DF</SelectItem>
                          <SelectItem value="ES">ES</SelectItem>
                          <SelectItem value="GO">GO</SelectItem>
                          <SelectItem value="MA">MA</SelectItem>
                          <SelectItem value="MT">MT</SelectItem>
                          <SelectItem value="MS">MS</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="PA">PA</SelectItem>
                          <SelectItem value="PB">PB</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                          <SelectItem value="PE">PE</SelectItem>
                          <SelectItem value="PI">PI</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="RN">RN</SelectItem>
                          <SelectItem value="RS">RS</SelectItem>
                          <SelectItem value="RO">RO</SelectItem>
                          <SelectItem value="RR">RR</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="SE">SE</SelectItem>
                          <SelectItem value="TO">TO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input 
                        id="cep" 
                        value={novoFornecedor.cep}
                        onChange={(e) => setNovoFornecedor({...novoFornecedor, cep: e.target.value})}
                        placeholder="XXXXX-XXX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categorias de Produtos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Isolantes", "Absorvedores", "Estruturas", "Fixações", "Vedantes", "Portas e Janelas", "Difusores"].map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`cat-${cat}`} 
                            checked={novoFornecedor.categoria.includes(cat)}
                            onChange={() => toggleCategoriaFornecedor(cat)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`cat-${cat}`} className="text-sm">{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea 
                      id="observacoes" 
                      value={novoFornecedor.observacoes}
                      onChange={(e) => setNovoFornecedor({...novoFornecedor, observacoes: e.target.value})}
                      className="h-20"
                    />
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsNovoFornecedorDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvarFornecedor}>
                    Salvar Fornecedor
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Cidade/UF</TableHead>
                  <TableHead>Categorias</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum fornecedor encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  fornecedoresFiltrados.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <div className="font-medium">{fornecedor.nome}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{fornecedor.cnpj}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{fornecedor.cnpj}</TableCell>
                      <TableCell>{fornecedor.contato}</TableCell>
                      <TableCell className="hidden md:table-cell">{fornecedor.telefone}</TableCell>
                      <TableCell className="hidden lg:table-cell">{fornecedor.cidade}/{fornecedor.estado}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {fornecedor.categoria.map(cat => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Tab: Colaboradores */}
        <TabsContent value="colaboradores" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar colaboradores por nome, cargo ou e-mail..."
                className="pl-8"
                value={searchTerms.colaborador}
                onChange={(e) => setSearchTerms({...searchTerms, colaborador: e.target.value})}
              />
            </div>
            <Select
              value={filtros.departamento}
              onValueChange={(value) => setFiltros({...filtros, departamento: value})}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{filtros.departamento || "Todos Departamentos"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos Departamentos</SelectItem>
                {departamentos.map(depto => (
                  <SelectItem key={depto} value={depto}>
                    {depto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isNovoColaboradorDialogOpen} onOpenChange={setIsNovoColaboradorDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Novo Colaborador</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo colaborador no sistema
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="col-nome">Nome Completo *</Label>
                    <Input 
                      id="col-nome" 
                      value={novoColaborador.nome}
                      onChange={(e) => setNovoColaborador({...novoColaborador, nome: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="col-email">E-mail *</Label>
                      <Input 
                        id="col-email" 
                        type="email"
                        value={novoColaborador.email}
                        onChange={(e) => setNovoColaborador({...novoColaborador, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="col-telefone">Telefone</Label>
                      <Input 
                        id="col-telefone" 
                        value={novoColaborador.telefone}
                        onChange={(e) => setNovoColaborador({...novoColaborador, telefone: e.target.value})}
                        placeholder="(XX) XXXXX-XXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="col-cargo">Cargo</Label>
                      <Input 
                        id="col-cargo" 
                        value={novoColaborador.cargo}
                        onChange={(e) => setNovoColaborador({...novoColaborador, cargo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="col-departamento">Departamento</Label>
                      <Select
                        value={novoColaborador.departamento}
                        onValueChange={(value) => setNovoColaborador({...novoColaborador, departamento: value})}
                      >
                        <SelectTrigger id="col-departamento">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrativo">Administrativo</SelectItem>
                          <SelectItem value="Produção">Produção</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Projetos">Projetos</SelectItem>
                          <SelectItem value="Obras">Obras</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="col-data">Data de Admissão</Label>
                      <Input 
                        id="col-data" 
                        type="date"
                        value={novoColaborador.dataAdmissao}
                        onChange={(e) => setNovoColaborador({...novoColaborador, dataAdmissao: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="col-status">Status</Label>
                      <Select
                        value={novoColaborador.status}
                        onValueChange={(value: "ativo" | "inativo" | "afastado" | "ferias") => 
                          setNovoColaborador({...novoColaborador, status: value})
                        }
                      >
                        <SelectTrigger id="col-status">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="afastado">Afastado</SelectItem>
                          <SelectItem value="ferias">Férias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="col-observacoes">Observações</Label>
                    <Textarea 
                      id="col-observacoes" 
                      value={novoColaborador.observacoes}
                      onChange={(e) => setNovoColaborador({...novoColaborador, observacoes: e.target.value})}
                      className="h-20"
                    />
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsNovoColaboradorDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvarColaborador}>
                    Salvar Colaborador
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">E-mail</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden lg:table-cell">Departamento</TableHead>
                  <TableHead className="hidden lg:table-cell">Admissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colaboradoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum colaborador encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  colaboradoresFiltrados.map((colaborador) => (
                    <TableRow key={colaborador.id}>
                      <TableCell>
                        <div className="font-medium">{colaborador.nome}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{colaborador.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{colaborador.email}</TableCell>
                      <TableCell>{colaborador.cargo}</TableCell>
                      <TableCell className="hidden lg:table-cell">{colaborador.departamento}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatarData(colaborador.dataAdmissao)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(colaborador.status)} variant="secondary">
                          {colaborador.status.charAt(0).toUpperCase() + colaborador.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Total de Colaboradores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{colaboradores.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Departamento Maior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold">Produção</div>
                <div className="text-sm text-muted-foreground">3 colaboradores</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Férias Atuais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">colaborador em férias</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold">{colaboradores.filter(c => c.status === "ativo").length}</div>
                <div className="text-sm text-muted-foreground">colaboradores ativos</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab: Produtos */}
        <TabsContent value="produtos" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos por nome, código ou descrição..."
                className="pl-8"
                value={searchTerms.produto}
                onChange={(e) => setSearchTerms({...searchTerms, produto: e.target.value})}
              />
            </div>
            <Select
              value={filtros.categoriaProduto}
              onValueChange={(value) => setFiltros({...filtros, categoriaProduto: value})}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{filtros.categoriaProduto || "Todas Categorias"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas Categorias</SelectItem>
                {categoriasProduto.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isNovoProdutoDialogOpen} onOpenChange={setIsNovoProdutoDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Novo Produto</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo produto no sistema
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prod-codigo">Código *</Label>
                      <Input 
                        id="prod-codigo" 
                        value={novoProduto.codigo}
                        onChange={(e) => setNovoProduto({...novoProduto, codigo: e.target.value})}
                        required
                        placeholder="Ex: PA-60-STD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prod-categoria">Categoria *</Label>
                      <Select
                        value={novoProduto.categoria}
                        onValueChange={(value) => setNovoProduto({...novoProduto, categoria: value})}
                      >
                        <SelectTrigger id="prod-categoria">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Painéis Absorvedores">Painéis Absorvedores</SelectItem>
                          <SelectItem value="Bass Traps">Bass Traps</SelectItem>
                          <SelectItem value="Difusores">Difusores</SelectItem>
                          <SelectItem value="Portas e Janelas">Portas e Janelas</SelectItem>
                          <SelectItem value="Isolamento">Isolamento</SelectItem>
                          <SelectItem value="Baffles">Baffles</SelectItem>
                          <SelectItem value="Acessórios">Acessórios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prod-nome">Nome do Produto *</Label>
                    <Input 
                      id="prod-nome" 
                      value={novoProduto.nome}
                      onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prod-descricao">Descrição</Label>
                    <Textarea 
                      id="prod-descricao" 
                      value={novoProduto.descricao}
                      onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}
                      className="h-20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prod-unidade">Unidade de Medida</Label>
                      <Select
                        value={novoProduto.unidadeMedida}
                        onValueChange={(value) => setNovoProduto({...novoProduto, unidadeMedida: value})}
                      >
                        <SelectTrigger id="prod-unidade">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pç">pç (peça)</SelectItem>
                          <SelectItem value="m²">m² (metro quadrado)</SelectItem>
                          <SelectItem value="m">m (metro)</SelectItem>
                          <SelectItem value="un">un (unidade)</SelectItem>
                          <SelectItem value="kit">kit</SelectItem>
                          <SelectItem value="cx">cx (caixa)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prod-valor">Valor Base (R$)</Label>
                      <Input 
                        id="prod-valor" 
                        type="number"
                        step="0.01"
                        value={novoProduto.valorBase || ""}
                        onChange={(e) => setNovoProduto({...novoProduto, valorBase: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prod-observacoes">Observações</Label>
                    <Textarea 
                      id="prod-observacoes" 
                      value={novoProduto.observacoes}
                      onChange={(e) => setNovoProduto({...novoProduto, observacoes: e.target.value})}
                      className="h-20"
                    />
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsNovoProdutoDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvarProduto}>
                    Salvar Produto
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Un.</TableHead>
                  <TableHead className="text-right">Valor Base</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
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
                      <TableCell>
                        <div>{produto.nome}</div>
                        <div className="text-xs text-muted-foreground">{produto.descricao}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{produto.categoria}</TableCell>
                      <TableCell>{produto.unidadeMedida}</TableCell>
                      <TableCell className="text-right">{formatarMoeda(produto.valorBase)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <PackageCheck className="mr-2 h-4 w-4" />
                  Total de Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{produtos.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Catálogo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-base flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="mr-1 h-4 w-4" />
                    Online
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Factory className="mr-2 h-4 w-4" />
                  Categoria Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">Painéis Absorvedores</div>
                <div className="text-sm text-muted-foreground">2 produtos</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cadastros;
