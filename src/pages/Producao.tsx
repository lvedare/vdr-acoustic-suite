
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  CheckCircle2, 
  Clipboard, 
  Clock, 
  Filter, 
  Hammer, 
  ListTodo, 
  Package, 
  PackageCheck, 
  Plus, 
  Search, 
  Timer, 
  Users, 
  Eye, 
  Pencil 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Interfaces
interface OrdemProducao {
  id: number;
  numero: string;
  dataCriacao: string;
  dataPrevisao: string;
  descricao: string;
  cliente: string;
  propostaId: string;
  status: "pendente" | "em_producao" | "aguardando_material" | "concluida" | "cancelada";
  prioridade: "baixa" | "normal" | "alta" | "urgente";
  progresso: number;
  responsavel: string;
  observacoes: string;
  itens: ItemProducao[];
}

interface ItemProducao {
  id: number;
  descricao: string;
  quantidade: number;
  unidade: string;
  status: "pendente" | "em_producao" | "concluido";
  materiaisNecessarios: MaterialNecessario[];
}

interface MaterialNecessario {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  disponivel: boolean;
}

interface EtapaProducao {
  id: number;
  ordemId: number;
  nome: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  status: "pendente" | "em_andamento" | "concluida" | "pausada";
  responsavel?: string;
  progresso: number;
}

// Dados mockados
const ordensProducaoMock: OrdemProducao[] = [
  {
    id: 1,
    numero: "OP2025050001",
    dataCriacao: "2025-05-01",
    dataPrevisao: "2025-05-15",
    descricao: "Painéis acústicos - Escritório ABC",
    cliente: "Empresa ABC",
    propostaId: "VDR27.3.2025050101.123RO",
    status: "em_producao",
    prioridade: "normal",
    progresso: 35,
    responsavel: "João Silva",
    observacoes: "Produção de 15 painéis acústicos conforme projeto aprovado.",
    itens: [
      {
        id: 1,
        descricao: "Painel Acústico 60x60cm",
        quantidade: 10,
        unidade: "pç",
        status: "em_producao",
        materiaisNecessarios: [
          { id: 1, nome: "Lã de Rocha 50mm", quantidade: 3.6, unidade: "m²", disponivel: true },
          { id: 2, nome: "MDF Perfurado 15mm", quantidade: 3.6, unidade: "m²", disponivel: true },
          { id: 3, nome: "Tecido Acústico", quantidade: 4, unidade: "m²", disponivel: true }
        ]
      },
      {
        id: 2,
        descricao: "Painel Bass Trap 60x120cm",
        quantidade: 5,
        unidade: "pç",
        status: "pendente",
        materiaisNecessarios: [
          { id: 4, nome: "Lã de Rocha 100mm", quantidade: 3.6, unidade: "m²", disponivel: true },
          { id: 5, nome: "MDF 15mm", quantidade: 3.6, unidade: "m²", disponivel: true },
          { id: 6, nome: "Tecido Acústico", quantidade: 4, unidade: "m²", disponivel: true }
        ]
      }
    ]
  },
  {
    id: 2,
    numero: "OP2025050002",
    dataCriacao: "2025-05-03",
    dataPrevisao: "2025-05-20",
    descricao: "Difusores acústicos - Studio XYZ",
    cliente: "Studio XYZ",
    propostaId: "VDR27.3.2025050501.145RO",
    status: "aguardando_material",
    prioridade: "alta",
    progresso: 10,
    responsavel: "Ana Costa",
    observacoes: "Cliente solicitou entrega antecipada se possível.",
    itens: [
      {
        id: 3,
        descricao: "Difusor Quadrático 60x60cm",
        quantidade: 8,
        unidade: "pç",
        status: "pendente",
        materiaisNecessarios: [
          { id: 7, nome: "MDF 25mm", quantidade: 2.9, unidade: "m²", disponivel: false },
          { id: 8, nome: "Pintura Acrílica", quantidade: 1, unidade: "lt", disponivel: true }
        ]
      }
    ]
  },
  {
    id: 3,
    numero: "OP2025040015",
    dataCriacao: "2025-04-15",
    dataPrevisao: "2025-04-30",
    descricao: "Baffles acústicos - Restaurante",
    cliente: "Restaurante Boa Mesa",
    propostaId: "VDR27.3.2025041501.092RO",
    status: "concluida",
    prioridade: "normal",
    progresso: 100,
    responsavel: "Pedro Almeida",
    observacoes: "Concluído dentro do prazo. Cliente satisfeito.",
    itens: [
      {
        id: 4,
        descricao: "Baffle Acústico 30x120cm",
        quantidade: 15,
        unidade: "pç",
        status: "concluido",
        materiaisNecessarios: [
          { id: 9, nome: "Espuma Acústica 50mm", quantidade: 5.4, unidade: "m²", disponivel: true },
          { id: 10, nome: "Tecido Acústico", quantidade: 6, unidade: "m²", disponivel: true }
        ]
      }
    ]
  },
  {
    id: 4,
    numero: "OP2025050003",
    dataCriacao: "2025-05-05",
    dataPrevisao: "2025-05-25",
    descricao: "Portas Acústicas - Clínica",
    cliente: "Clínica Saúde Total",
    propostaId: "VDR27.3.2025042001.108RO",
    status: "pendente",
    prioridade: "urgente",
    progresso: 0,
    responsavel: "João Silva",
    observacoes: "Garantir que as portas tenham redução sonora mínima de 35dB conforme especificação.",
    itens: [
      {
        id: 5,
        descricao: "Porta Acústica 35dB 80x210cm",
        quantidade: 4,
        unidade: "pç",
        status: "pendente",
        materiaisNecessarios: [
          { id: 11, nome: "MDF 18mm", quantidade: 6.8, unidade: "m²", disponivel: true },
          { id: 12, nome: "Lã de Rocha 50mm", quantidade: 6.8, unidade: "m²", disponivel: true },
          { id: 13, nome: "Borracha de Vedação", quantidade: 20, unidade: "m", disponivel: false },
          { id: 14, nome: "Ferragens Especiais", quantidade: 4, unidade: "kit", disponivel: false }
        ]
      }
    ]
  }
];

const etapasProducaoMock: EtapaProducao[] = [
  { id: 1, ordemId: 1, nome: "Corte de Material", status: "concluida", responsavel: "Carlos Ferreira", progresso: 100, dataInicio: "2025-05-02", dataFim: "2025-05-04" },
  { id: 2, ordemId: 1, nome: "Montagem Estrutura", status: "em_andamento", responsavel: "Marcos Silva", progresso: 60, dataInicio: "2025-05-05" },
  { id: 3, ordemId: 1, nome: "Aplicação de Tecido", status: "pendente", progresso: 0 },
  { id: 4, ordemId: 1, nome: "Acabamento", status: "pendente", progresso: 0 },
  { id: 5, ordemId: 2, nome: "Corte de Material", status: "pendente", progresso: 0 },
  { id: 6, ordemId: 3, nome: "Corte de Material", status: "concluida", responsavel: "Carlos Ferreira", progresso: 100, dataInicio: "2025-04-16", dataFim: "2025-04-18" },
  { id: 7, ordemId: 3, nome: "Montagem", status: "concluida", responsavel: "Ana Costa", progresso: 100, dataInicio: "2025-04-19", dataFim: "2025-04-25" },
  { id: 8, ordemId: 3, nome: "Acabamento", status: "concluida", responsavel: "Pedro Almeida", progresso: 100, dataInicio: "2025-04-26", dataFim: "2025-04-29" },
];

const Producao = () => {
  const [ordensProducao, setOrdensProducao] = useState<OrdemProducao[]>(ordensProducaoMock);
  const [etapasProducao, setEtapasProducao] = useState<EtapaProducao[]>(etapasProducaoMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [filtroPrioridade, setFiltroPrioridade] = useState<string | null>(null);
  const [isNovaOrdemDialogOpen, setIsNovaOrdemDialogOpen] = useState(false);
  const [isDetalhesDialogOpen, setIsDetalhesDialogOpen] = useState(false);
  const [ordemAtual, setOrdemAtual] = useState<OrdemProducao | null>(null);
  const [tabDetalhes, setTabDetalhes] = useState("itens");
  const navigate = useNavigate();

  // Nova ordem de produção (modelo vazio)
  const ordemVazia: Omit<OrdemProducao, "id"> = {
    numero: `OP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(ordensProducao.length + 1).padStart(4, '0')}`,
    dataCriacao: new Date().toISOString().split('T')[0],
    dataPrevisao: "",
    descricao: "",
    cliente: "",
    propostaId: "",
    status: "pendente",
    prioridade: "normal",
    progresso: 0,
    responsavel: "",
    observacoes: "",
    itens: []
  };

  const [novaOrdem, setNovaOrdem] = useState<Omit<OrdemProducao, "id">>(ordemVazia);
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    quantidade: 1,
    unidade: "pç",
    status: "pendente",
    materiaisNecessarios: [] as Omit<MaterialNecessario, "id">[]
  });
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    quantidade: 0,
    unidade: "m²",
    disponivel: true
  });
  
  // Filtrar ordens
  const ordensFiltradas = ordensProducao.filter(ordem => {
    const matchesSearch = 
      ordem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filtroStatus || ordem.status === filtroStatus;
    const matchesPrioridade = !filtroPrioridade || ordem.prioridade === filtroPrioridade;
    
    return matchesSearch && matchesStatus && matchesPrioridade;
  });

  // Formatar data
  const formatarData = (data: string): string => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Obter cores de status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pendente":
        return "bg-blue-100 text-blue-800";
      case "em_producao":
      case "em_andamento":
        return "bg-amber-100 text-amber-800";
      case "aguardando_material":
      case "pausada":
        return "bg-purple-100 text-purple-800";
      case "concluida":
      case "concluido":
        return "bg-emerald-100 text-emerald-800";
      case "cancelada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obter texto do status
  const getStatusText = (status: string): string => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "em_producao":
        return "Em Produção";
      case "em_andamento":
        return "Em Andamento";
      case "aguardando_material":
        return "Aguardando Material";
      case "concluida":
        return "Concluída";
      case "concluido":
        return "Concluído";
      case "cancelada":
        return "Cancelada";
      case "pausada":
        return "Pausada";
      default:
        return status;
    }
  };

  // Obter cores de prioridade
  const getPrioridadeColor = (prioridade: string): string => {
    switch (prioridade) {
      case "baixa":
        return "bg-gray-100 text-gray-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "alta":
        return "bg-amber-100 text-amber-800";
      case "urgente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Criar nova ordem de produção
  const handleCriarOrdem = () => {
    if (!novaOrdem.descricao || !novaOrdem.cliente || !novaOrdem.dataPrevisao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    if (novaOrdem.itens.length === 0) {
      toast.error("Adicione pelo menos um item à ordem de produção");
      return;
    }
    
    const novaOrdemId = Date.now();
    
    const ordemCriada: OrdemProducao = {
      id: novaOrdemId,
      ...novaOrdem
    };
    
    setOrdensProducao([...ordensProducao, ordemCriada]);
    toast.success("Ordem de produção criada com sucesso!");
    
    // Criar etapas padrão para a ordem
    const novasEtapas: EtapaProducao[] = [
      { 
        id: etapasProducao.length + 1, 
        ordemId: novaOrdemId, 
        nome: "Corte de Material", 
        status: "pendente", 
        progresso: 0 
      },
      { 
        id: etapasProducao.length + 2, 
        ordemId: novaOrdemId, 
        nome: "Montagem", 
        status: "pendente", 
        progresso: 0 
      },
      { 
        id: etapasProducao.length + 3, 
        ordemId: novaOrdemId, 
        nome: "Acabamento", 
        status: "pendente", 
        progresso: 0 
      }
    ];
    
    setEtapasProducao([...etapasProducao, ...novasEtapas]);
    
    // Fechar diálogo e resetar estado
    setIsNovaOrdemDialogOpen(false);
    setNovaOrdem(ordemVazia);
  };
  
  // Adicionar item à ordem
  const handleAdicionarItem = () => {
    if (!novoItem.descricao || novoItem.quantidade <= 0) {
      toast.error("Preencha a descrição e quantidade do item");
      return;
    }
    
    const itemId = Date.now();
    const novoItemCompleto: ItemProducao = {
      id: itemId,
      descricao: novoItem.descricao,
      quantidade: novoItem.quantidade,
      unidade: novoItem.unidade,
      status: "pendente",
      materiaisNecessarios: novoItem.materiaisNecessarios.map((m, index) => ({
        ...m,
        id: Date.now() + index + 1
      }))
    };
    
    setNovaOrdem({
      ...novaOrdem,
      itens: [...novaOrdem.itens, novoItemCompleto]
    });
    
    setNovoItem({
      descricao: "",
      quantidade: 1,
      unidade: "pç",
      status: "pendente",
      materiaisNecessarios: []
    });
    
    toast.success("Item adicionado à ordem");
  };
  
  // Adicionar material ao item
  const handleAdicionarMaterial = () => {
    if (!novoMaterial.nome || novoMaterial.quantidade <= 0) {
      toast.error("Preencha o nome e quantidade do material");
      return;
    }
    
    setNovoItem({
      ...novoItem,
      materiaisNecessarios: [
        ...novoItem.materiaisNecessarios,
        {
          nome: novoMaterial.nome,
          quantidade: novoMaterial.quantidade,
          unidade: novoMaterial.unidade,
          disponivel: novoMaterial.disponivel
        }
      ]
    });
    
    setNovoMaterial({
      nome: "",
      quantidade: 0,
      unidade: "m²",
      disponivel: true
    });
  };
  
  // Atualizar status do item
  const handleAtualizarStatusItem = (ordemId: number, itemId: number, novoStatus: "pendente" | "em_producao" | "concluido") => {
    const ordensAtualizadas = ordensProducao.map(ordem => {
      if (ordem.id === ordemId) {
        const itensAtualizados = ordem.itens.map(item => 
          item.id === itemId ? { ...item, status: novoStatus } : item
        );
        
        // Verificar progresso geral
        const totalItens = itensAtualizados.length;
        const itensConcluidos = itensAtualizados.filter(i => i.status === "concluido").length;
        const itensEmProducao = itensAtualizados.filter(i => i.status === "em_producao").length;
        
        const novoProgresso = Math.round((itensConcluidos / totalItens) * 100);
        
        // Determinar novo status da ordem
        let novoStatusOrdem = ordem.status;
        
        if (itensConcluidos === totalItens) {
          novoStatusOrdem = "concluida";
        } else if (itensEmProducao > 0) {
          novoStatusOrdem = "em_producao";
        }
        
        return {
          ...ordem,
          itens: itensAtualizados,
          progresso: novoProgresso,
          status: novoStatusOrdem
        };
      }
      return ordem;
    });
    
    setOrdensProducao(ordensAtualizadas);
    
    if (ordemAtual && ordemAtual.id === ordemId) {
      const ordemAtualizada = ordensAtualizadas.find(o => o.id === ordemId);
      if (ordemAtualizada) {
        setOrdemAtual(ordemAtualizada);
      }
    }
    
    toast.success(`Status do item atualizado para: ${getStatusText(novoStatus)}`);
  };
  
  // Atualizar status da etapa
  const handleAtualizarEtapa = (etapaId: number, novoStatus: "pendente" | "em_andamento" | "concluida" | "pausada", progresso: number) => {
    const dataAtual = new Date().toISOString().split('T')[0];
    
    const etapasAtualizadas = etapasProducao.map(etapa => {
      if (etapa.id === etapaId) {
        let etapaAtualizada: EtapaProducao = {
          ...etapa,
          status: novoStatus,
          progresso
        };
        
        // Adicionar data de início se estiver começando
        if (novoStatus === "em_andamento" && !etapa.dataInicio) {
          etapaAtualizada.dataInicio = dataAtual;
        }
        
        // Adicionar data de conclusão se estiver finalizando
        if (novoStatus === "concluida" && !etapa.dataFim) {
          etapaAtualizada.dataFim = dataAtual;
        }
        
        // Adicionar responsável se não houver
        if ((novoStatus === "em_andamento" || novoStatus === "concluida") && !etapa.responsavel) {
          const responsavelPadrao = "Usuário Atual";
          etapaAtualizada.responsavel = responsavelPadrao;
        }
        
        return etapaAtualizada;
      }
      return etapa;
    });
    
    setEtapasProducao(etapasAtualizadas);
    
    // Atualizar progresso da ordem baseado nas etapas
    if (ordemAtual) {
      const etapasDaOrdem = etapasAtualizadas.filter(e => e.ordemId === ordemAtual.id);
      
      if (etapasDaOrdem.length > 0) {
        const progressoTotal = etapasDaOrdem.reduce((acc, curr) => acc + curr.progresso, 0);
        const progressoMedio = Math.round(progressoTotal / etapasDaOrdem.length);
        
        const todasConcluidas = etapasDaOrdem.every(e => e.status === "concluida");
        const algumaEmAndamento = etapasDaOrdem.some(e => e.status === "em_andamento");
        
        let novoStatus = ordemAtual.status;
        if (todasConcluidas) {
          novoStatus = "concluida";
        } else if (algumaEmAndamento) {
          novoStatus = "em_producao";
        }
        
        const ordensAtualizadas = ordensProducao.map(ordem =>
          ordem.id === ordemAtual.id ? { ...ordem, progresso: progressoMedio, status: novoStatus } : ordem
        );
        
        setOrdensProducao(ordensAtualizadas);
        setOrdemAtual({...ordemAtual, progresso: progressoMedio, status: novoStatus});
      }
    }
    
    toast.success(`Etapa atualizada para: ${getStatusText(novoStatus)}`);
  };
  
  // Abrir dialog de detalhes
  const handleVerDetalhes = (ordem: OrdemProducao) => {
    setOrdemAtual(ordem);
    setIsDetalhesDialogOpen(true);
    setTabDetalhes("itens");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produção</h1>
        <Dialog open={isNovaOrdemDialogOpen} onOpenChange={setIsNovaOrdemDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ordem de Produção
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Nova Ordem de Produção</DialogTitle>
              <DialogDescription>
                Crie uma nova ordem de produção com os detalhes necessários.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero" 
                    value={novaOrdem.numero}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataCriacao">Data de Criação</Label>
                  <Input 
                    id="dataCriacao" 
                    type="date"
                    value={novaOrdem.dataCriacao}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input 
                  id="descricao" 
                  value={novaOrdem.descricao}
                  onChange={(e) => setNovaOrdem({...novaOrdem, descricao: e.target.value})}
                  required
                  placeholder="Ex: Painéis acústicos para escritório"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select
                    value={novaOrdem.cliente}
                    onValueChange={(value) => setNovaOrdem({...novaOrdem, cliente: value})}
                  >
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Empresa ABC">Empresa ABC</SelectItem>
                      <SelectItem value="Studio XYZ">Studio XYZ</SelectItem>
                      <SelectItem value="Restaurante Boa Mesa">Restaurante Boa Mesa</SelectItem>
                      <SelectItem value="Clínica Saúde Total">Clínica Saúde Total</SelectItem>
                      <SelectItem value="Condomínio Green Park">Condomínio Green Park</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propostaId">Proposta Relacionada</Label>
                  <Input 
                    id="propostaId" 
                    value={novaOrdem.propostaId}
                    onChange={(e) => setNovaOrdem({...novaOrdem, propostaId: e.target.value})}
                    placeholder="Ex: VDR27.3.20250501.123RO"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataPrevisao">Previsão de Entrega *</Label>
                  <Input 
                    id="dataPrevisao" 
                    type="date"
                    value={novaOrdem.dataPrevisao}
                    onChange={(e) => setNovaOrdem({...novaOrdem, dataPrevisao: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={novaOrdem.prioridade}
                    onValueChange={(value: "baixa" | "normal" | "alta" | "urgente") => 
                      setNovaOrdem({...novaOrdem, prioridade: value})
                    }
                  >
                    <SelectTrigger id="prioridade">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Select
                    value={novaOrdem.responsavel}
                    onValueChange={(value) => setNovaOrdem({...novaOrdem, responsavel: value})}
                  >
                    <SelectTrigger id="responsavel">
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="João Silva">João Silva</SelectItem>
                      <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                      <SelectItem value="Pedro Almeida">Pedro Almeida</SelectItem>
                      <SelectItem value="Carlos Ferreira">Carlos Ferreira</SelectItem>
                      <SelectItem value="Marcos Silva">Marcos Silva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea 
                  id="observacoes" 
                  value={novaOrdem.observacoes}
                  onChange={(e) => setNovaOrdem({...novaOrdem, observacoes: e.target.value})}
                  placeholder="Instruções especiais, requisitos ou detalhes..."
                  className="h-20"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Itens para Produção</h3>
                  <Badge variant="outline">
                    {novaOrdem.itens.length} {novaOrdem.itens.length === 1 ? "item" : "itens"}
                  </Badge>
                </div>
                
                {novaOrdem.itens.length > 0 && (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Quantidade</TableHead>
                          <TableHead>Materiais Necessários</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {novaOrdem.itens.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.descricao}</TableCell>
                            <TableCell className="text-right">{item.quantidade} {item.unidade}</TableCell>
                            <TableCell>
                              {item.materiaisNecessarios.length > 0 ? (
                                <ul className="text-xs">
                                  {item.materiaisNecessarios.map((material, index) => (
                                    <li key={index}>
                                      {material.nome}: {material.quantidade} {material.unidade}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-xs text-muted-foreground">Nenhum material especificado</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Adicionar Item</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="item-descricao">Descrição</Label>
                        <Input 
                          id="item-descricao" 
                          value={novoItem.descricao}
                          onChange={(e) => setNovoItem({...novoItem, descricao: e.target.value})}
                          placeholder="Ex: Painel Acústico 60x60cm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="item-quantidade">Quantidade</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="item-quantidade" 
                            type="number"
                            value={novoItem.quantidade}
                            onChange={(e) => setNovoItem({...novoItem, quantidade: Number(e.target.value)})}
                          />
                          <Select
                            value={novoItem.unidade}
                            onValueChange={(value) => setNovoItem({...novoItem, unidade: value})}
                          >
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pç">pç</SelectItem>
                              <SelectItem value="m²">m²</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="un">un</SelectItem>
                              <SelectItem value="kit">kit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border rounded-md p-3">
                      <Label>Materiais Necessários</Label>
                      
                      {novoItem.materiaisNecessarios.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {novoItem.materiaisNecessarios.map((material, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                              <div>{material.nome}</div>
                              <div>{material.quantidade} {material.unidade}</div>
                              <Badge variant="outline" className={material.disponivel ? "bg-emerald-100" : "bg-amber-100"}>
                                {material.disponivel ? "Disponível" : "Indisponível"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-2">
                          <Input 
                            placeholder="Nome do material" 
                            value={novoMaterial.nome}
                            onChange={(e) => setNovoMaterial({...novoMaterial, nome: e.target.value})}
                            size={1}
                          />
                        </div>
                        <div>
                          <Input 
                            type="number" 
                            placeholder="Qtde" 
                            value={novoMaterial.quantidade || ""}
                            onChange={(e) => setNovoMaterial({...novoMaterial, quantidade: Number(e.target.value)})}
                            size={1}
                          />
                        </div>
                        <div>
                          <Select
                            value={novoMaterial.unidade}
                            onValueChange={(value) => setNovoMaterial({...novoMaterial, unidade: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m²">m²</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="un">un</SelectItem>
                              <SelectItem value="pç">pç</SelectItem>
                              <SelectItem value="lt">lt</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="kit">kit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <Checkbox 
                              id="disponibilidade" 
                              checked={novoMaterial.disponivel}
                              onCheckedChange={(checked) => 
                                setNovoMaterial({...novoMaterial, disponivel: checked === true})
                              }
                            />
                            <label 
                              htmlFor="disponibilidade" 
                              className="text-xs text-muted-foreground cursor-pointer"
                            >
                              Disponível
                            </label>
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={handleAdicionarMaterial}
                              className="ml-auto"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={handleAdicionarItem}
                      className="w-full"
                    >
                      Adicionar Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsNovaOrdemDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCriarOrdem}>
                Criar Ordem de Produção
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ordens</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold">
              {ordensProducao.length}
              <span className="text-xs font-normal text-muted-foreground ml-2">ordens</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Produção</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold text-amber-600">
              {ordensProducao.filter(o => o.status === "em_producao").length}
              <span className="text-xs font-normal text-muted-foreground ml-2">ordens</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando Material</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold text-purple-600">
              {ordensProducao.filter(o => o.status === "aguardando_material").length}
              <span className="text-xs font-normal text-muted-foreground ml-2">ordens</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold text-emerald-600">
              {ordensProducao.filter(o => o.status === "concluida").length}
              <span className="text-xs font-normal text-muted-foreground ml-2">ordens</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ordens por número, descrição ou cliente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filtroStatus || ""}
          onValueChange={(value) => setFiltroStatus(value === "" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filtroStatus ? getStatusText(filtroStatus) : "Todos os Status"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_producao">Em Produção</SelectItem>
            <SelectItem value="aguardando_material">Aguardando Material</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filtroPrioridade || ""}
          onValueChange={(value) => setFiltroPrioridade(value === "" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filtroPrioridade ? filtroPrioridade.charAt(0).toUpperCase() + filtroPrioridade.slice(1) : "Todas as Prioridades"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as Prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden md:table-cell">Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Previsão</TableHead>
              <TableHead className="hidden lg:table-cell">Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead className="hidden md:table-cell">Progresso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordensFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Nenhuma ordem de produção encontrada.
                </TableCell>
              </TableRow>
            ) : (
              ordensFiltradas.map((ordem) => (
                <TableRow key={ordem.id}>
                  <TableCell className="font-medium">{ordem.numero}</TableCell>
                  <TableCell>
                    <div className="font-medium">{ordem.descricao}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{ordem.cliente}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{ordem.cliente}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatarData(ordem.dataPrevisao)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{ordem.responsavel || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ordem.status)} variant="secondary">
                      {getStatusText(ordem.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPrioridadeColor(ordem.prioridade)} variant="secondary">
                      {ordem.prioridade.charAt(0).toUpperCase() + ordem.prioridade.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={ordem.progresso} className="h-2" />
                      <span className="text-xs whitespace-nowrap">{ordem.progresso}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleVerDetalhes(ordem)}
                        title="Ver Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Editar Ordem"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog de Detalhes da Ordem */}
      <Dialog open={isDetalhesDialogOpen} onOpenChange={setIsDetalhesDialogOpen}>
        <DialogContent className="sm:max-w-[900px] sm:max-h-[80vh] overflow-y-auto">
          {ordemAtual && (
            <>
              <DialogHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <DialogTitle className="text-xl">
                      Ordem de Produção {ordemAtual.numero}
                    </DialogTitle>
                    <DialogDescription>
                      {ordemAtual.descricao}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(ordemAtual.status)} variant="secondary">
                      {getStatusText(ordemAtual.status)}
                    </Badge>
                    <Badge className={getPrioridadeColor(ordemAtual.prioridade)} variant="secondary">
                      {ordemAtual.prioridade.charAt(0).toUpperCase() + ordemAtual.prioridade.slice(1)}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col p-3 border rounded-md">
                  <div className="text-xs text-muted-foreground">Cliente</div>
                  <div className="font-medium">{ordemAtual.cliente}</div>
                </div>
                <div className="flex flex-col p-3 border rounded-md">
                  <div className="text-xs text-muted-foreground">Data Prevista</div>
                  <div className="font-medium">{formatarData(ordemAtual.dataPrevisao)}</div>
                </div>
                <div className="flex flex-col p-3 border rounded-md">
                  <div className="text-xs text-muted-foreground">Responsável</div>
                  <div className="font-medium">{ordemAtual.responsavel || "-"}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Progresso Total</div>
                <div className="text-sm font-medium">{ordemAtual.progresso}%</div>
              </div>
              <Progress value={ordemAtual.progresso} className="h-2 mb-4" />
              
              <Tabs value={tabDetalhes} onValueChange={setTabDetalhes} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="itens">Itens</TabsTrigger>
                  <TabsTrigger value="etapas">Etapas</TabsTrigger>
                  <TabsTrigger value="materiais">Materiais</TabsTrigger>
                </TabsList>
                
                <TabsContent value="itens" className="space-y-4 mt-2">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-center">Quantidade</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordemAtual.itens.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-16 text-center">
                              Nenhum item encontrado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          ordemAtual.itens.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="font-medium">{item.descricao}</div>
                                {item.materiaisNecessarios.length > 0 && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Materiais: {item.materiaisNecessarios.map(m => m.nome).join(", ")}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-center">{item.quantidade} {item.unidade}</TableCell>
                              <TableCell className="text-center">
                                <Badge className={getStatusColor(item.status)} variant="secondary">
                                  {getStatusText(item.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Select
                                  value={item.status}
                                  onValueChange={(value: "pendente" | "em_producao" | "concluido") => 
                                    handleAtualizarStatusItem(ordemAtual.id, item.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue placeholder="Alterar Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="em_producao">Em Produção</SelectItem>
                                    <SelectItem value="concluido">Concluído</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {ordemAtual.observacoes && (
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Observações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{ordemAtual.observacoes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="etapas" className="mt-2">
                  <div className="space-y-4">
                    {etapasProducao
                      .filter(e => e.ordemId === ordemAtual.id)
                      .length === 0 ? (
                      <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
                        <p>Nenhuma etapa definida para esta ordem.</p>
                      </div>
                    ) : (
                      etapasProducao
                        .filter(e => e.ordemId === ordemAtual.id)
                        .map(etapa => (
                          <Card key={etapa.id} className={`overflow-hidden ${
                            etapa.status === "concluida" 
                              ? "border-emerald-200 bg-emerald-50" 
                              : etapa.status === "em_andamento" 
                              ? "border-amber-200 bg-amber-50" 
                              : ""
                          }`}>
                            <CardHeader className="py-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                  {etapa.status === "concluida" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                  {etapa.nome}
                                </CardTitle>
                                <Badge className={getStatusColor(etapa.status)} variant="secondary">
                                  {getStatusText(etapa.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="text-sm text-muted-foreground">Responsável</div>
                                  <p className="text-sm">{etapa.responsavel || "-"}</p>
                                  
                                  {etapa.descricao && (
                                    <>
                                      <div className="text-sm text-muted-foreground">Descrição</div>
                                      <p className="text-sm">{etapa.descricao}</p>
                                    </>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm text-muted-foreground">Data Início</div>
                                      <div className="text-sm">{etapa.dataInicio ? formatarData(etapa.dataInicio) : "-"}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-muted-foreground">Data Conclusão</div>
                                      <div className="text-sm">{etapa.dataFim ? formatarData(etapa.dataFim) : "-"}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Progresso: {etapa.progresso}%</span>
                                </div>
                                <Progress value={etapa.progresso} className="h-2 mt-2" />
                                
                                <div className="flex justify-end mt-3 gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleAtualizarEtapa(etapa.id, "concluida", 100)}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Concluído
                                  </Button>
                                  
                                  <Select
                                    value={etapa.status}
                                    onValueChange={(value: "pendente" | "em_andamento" | "concluida" | "pausada") => 
                                      handleAtualizarEtapa(
                                        etapa.id, 
                                        value, 
                                        value === "concluida" ? 100 : etapa.progresso
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pendente">Pendente</SelectItem>
                                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                      <SelectItem value="pausada">Pausada</SelectItem>
                                      <SelectItem value="concluida">Concluída</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <Select
                                    value={etapa.progresso.toString()}
                                    onValueChange={(value) => 
                                      handleAtualizarEtapa(
                                        etapa.id, 
                                        Number(value) === 100 ? "concluida" : etapa.status, 
                                        Number(value)
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <SelectValue placeholder="Progresso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="0">0%</SelectItem>
                                      <SelectItem value="25">25%</SelectItem>
                                      <SelectItem value="50">50%</SelectItem>
                                      <SelectItem value="75">75%</SelectItem>
                                      <SelectItem value="100">100%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const novaEtapa: EtapaProducao = {
                          id: etapasProducao.length + 1,
                          ordemId: ordemAtual.id,
                          nome: "Nova Etapa",
                          status: "pendente",
                          progresso: 0
                        };
                        
                        setEtapasProducao([...etapasProducao, novaEtapa]);
                        toast.success("Nova etapa adicionada.");
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Nova Etapa
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="materiais" className="space-y-4 mt-2">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        Lista de Materiais Necessários
                      </CardTitle>
                      <CardDescription>
                        Relação de todos os materiais para esta ordem
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Material</TableHead>
                              <TableHead className="text-center">Quantidade</TableHead>
                              <TableHead className="text-center">Situação</TableHead>
                              <TableHead className="text-center">Item relacionado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ordemAtual.itens.flatMap(item => 
                              item.materiaisNecessarios.map(material => (
                                <TableRow key={material.id}>
                                  <TableCell>{material.nome}</TableCell>
                                  <TableCell className="text-center">
                                    {material.quantidade} {material.unidade}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge 
                                      className={material.disponivel ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"} 
                                      variant="secondary"
                                    >
                                      {material.disponivel ? "Disponível" : "Indisponível"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">{item.descricao}</TableCell>
                                </TableRow>
                              ))
                            )}
                            
                            {ordemAtual.itens.flatMap(item => item.materiaisNecessarios).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                                  Nenhum material registrado para esta ordem.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {ordemAtual.itens.some(item => 
                        item.materiaisNecessarios.some(material => !material.disponivel)
                      ) && (
                        <Card className="mt-4 border-amber-200 bg-amber-50">
                          <CardContent className="p-3 flex items-start gap-3">
                            <div className="rounded-full bg-amber-200 p-1 mt-1">
                              <AlertTriangle className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <h4 className="font-medium text-amber-800">Materiais em Falta</h4>
                              <p className="text-sm text-amber-700 mt-1">
                                Alguns materiais necessários não estão disponíveis no estoque. 
                                Verifique a lista e providencie a compra ou entrada destes itens.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-center">
                    <Button variant="outline">
                      <PackageCheck className="mr-2 h-4 w-4" />
                      Verificar Estoque Automaticamente
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-4 gap-2">
                <Button variant="outline" onClick={() => setIsDetalhesDialogOpen(false)}>
                  Fechar
                </Button>
                <Button 
                  onClick={() => {
                    const ordemAtualizada = ordensProducao.find(o => o.id === ordemAtual.id);
                    if (ordemAtualizada) {
                      // Implementação da geração da ficha de produção
                      toast.success("Ficha de produção gerada com sucesso!");
                    }
                  }}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Gerar Ficha de Produção
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Producao;
