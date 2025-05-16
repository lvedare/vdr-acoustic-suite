
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Insumo, InsumoVazio, categoriasInsumo } from '@/types/insumo';
import { toast } from "@/components/ui/sonner";

// Dados mockados para insumos
const insumosMock: Insumo[] = [
  {
    id: 1,
    codigo: "INS-001",
    nome: "Madeira MDF 15mm",
    descricao: "Chapa de MDF 15mm branco, dimensões 2,75x1,85m",
    categoria: "Madeira",
    unidadeMedida: "UN",
    valorCusto: 185.00,
    quantidadeEstoque: 15,
    fornecedor: "MadeMadeiras",
    dataCadastro: "2025-01-10",
    podeSerRevendido: true
  },
  {
    id: 2,
    codigo: "INS-002",
    nome: "Tecido Acústico Cinza",
    descricao: "Tecido acústico, cor cinza, rolo de 1,5m de largura",
    categoria: "Tecido",
    unidadeMedida: "M",
    valorCusto: 45.90,
    quantidadeEstoque: 50,
    fornecedor: "Têxtil Acústicos",
    dataCadastro: "2025-01-15",
    podeSerRevendido: true
  },
  {
    id: 3,
    codigo: "INS-003",
    nome: "Perfil Metálico 30mm",
    descricao: "Perfil metálico galvanizado 30mm, barra 3m",
    categoria: "Metal",
    unidadeMedida: "UN",
    valorCusto: 32.50,
    quantidadeEstoque: 40,
    fornecedor: "MetalPro",
    dataCadastro: "2025-01-20",
    podeSerRevendido: false
  },
  {
    id: 4,
    codigo: "INS-004",
    nome: "Cola Acústica",
    descricao: "Cola especial para fixação de materiais acústicos, tubo 400g",
    categoria: "Químico",
    unidadeMedida: "UN",
    valorCusto: 28.75,
    quantidadeEstoque: 25,
    fornecedor: "Química Industrial",
    dataCadastro: "2025-01-25",
    podeSerRevendido: true
  },
  {
    id: 5,
    codigo: "INS-005",
    nome: "Parafuso 4,5x40mm",
    descricao: "Parafuso autoatarrachante phillips 4,5x40mm, caixa com 100 unidades",
    categoria: "Fixação",
    unidadeMedida: "CJ",
    valorCusto: 18.90,
    quantidadeEstoque: 30,
    fornecedor: "FixaTudo",
    dataCadastro: "2025-02-01",
    podeSerRevendido: false
  },
  {
    id: 6,
    codigo: "INS-006",
    nome: "Lã de Rocha 50mm",
    descricao: "Lã de rocha 50mm, placa 1000x600mm, densidade 32kg/m³",
    categoria: "Outro",
    unidadeMedida: "UN",
    valorCusto: 24.50,
    quantidadeEstoque: 60,
    fornecedor: "Isolamentos Térmicos",
    dataCadastro: "2025-02-05",
    podeSerRevendido: true
  }
];

interface InsumosContextProps {
  insumos: Insumo[];
  setInsumos: React.Dispatch<React.SetStateAction<Insumo[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filtroCategoria: string | null;
  setFiltroCategoria: React.Dispatch<React.SetStateAction<string | null>>;
  filtroRevenda: string | null;
  setFiltroRevenda: React.Dispatch<React.SetStateAction<string | null>>;
  insumoAtual: Insumo | null;
  setInsumoAtual: React.Dispatch<React.SetStateAction<Insumo | null>>;
  isInsumoDialogOpen: boolean;
  setIsInsumoDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInsumoDetailOpen: boolean;
  setIsInsumoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  novoInsumo: InsumoVazio;
  setNovoInsumo: React.Dispatch<React.SetStateAction<InsumoVazio>>;
  insumoVazio: InsumoVazio;
  insumosFiltrados: Insumo[];
  formatarData: (data: string) => string;
  handleSalvarInsumo: () => void;
  handleEditarInsumo: (insumo: Insumo) => void;
  handleExcluirInsumo: () => void;
  handlePreExcluirInsumo: (insumo: Insumo) => void;
  handleVerDetalhesInsumo: (insumo: Insumo) => void;
}

const InsumosContext = createContext<InsumosContextProps | undefined>(undefined);

export const InsumosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insumos, setInsumos] = useState<Insumo[]>(insumosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroRevenda, setFiltroRevenda] = useState<string | null>(null);
  const [isInsumoDialogOpen, setIsInsumoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInsumoDetailOpen, setIsInsumoDetailOpen] = useState(false);
  const [insumoAtual, setInsumoAtual] = useState<Insumo | null>(null);

  // Insumo vazio para novo cadastro
  const insumoVazio: InsumoVazio = {
    codigo: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidadeMedida: "UN",
    valorCusto: 0,
    quantidadeEstoque: 0,
    dataCadastro: new Date().toISOString().split('T')[0],
    podeSerRevendido: false
  };

  const [novoInsumo, setNovoInsumo] = useState<InsumoVazio>(insumoVazio);

  // Filtragem de insumos
  const insumosFiltrados = insumos.filter(insumo => {
    const matchesSearch = 
      insumo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !filtroCategoria || insumo.categoria === filtroCategoria;
    
    const matchesRevenda = !filtroRevenda || 
      (filtroRevenda === "sim" && insumo.podeSerRevendido) ||
      (filtroRevenda === "nao" && !insumo.podeSerRevendido);
    
    return matchesSearch && matchesCategoria && matchesRevenda;
  });

  // Formatação de data
  const formatarData = (data: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };
  
  // Salvar novo insumo ou editar existente
  const handleSalvarInsumo = () => {
    if (!novoInsumo.codigo || !novoInsumo.nome || !novoInsumo.categoria) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    if (insumoAtual) {
      // Atualizar insumo existente
      const insumosAtualizados = insumos.map(i => 
        i.id === insumoAtual.id ? { ...i, ...novoInsumo } : i
      );
      setInsumos(insumosAtualizados);
      toast.success("Insumo atualizado com sucesso!");
    } else {
      // Adicionar novo insumo
      const novoInsumoCompleto: Insumo = {
        id: Date.now(),
        ...novoInsumo
      };
      
      setInsumos([...insumos, novoInsumoCompleto]);
      toast.success("Insumo adicionado com sucesso!");
    }
    
    // Fechar dialog e resetar estado
    setIsInsumoDialogOpen(false);
    setInsumoAtual(null);
    setNovoInsumo(insumoVazio);
  };
  
  // Editar insumo
  const handleEditarInsumo = (insumo: Insumo) => {
    setInsumoAtual(insumo);
    setNovoInsumo({
      codigo: insumo.codigo,
      nome: insumo.nome,
      descricao: insumo.descricao,
      categoria: insumo.categoria,
      unidadeMedida: insumo.unidadeMedida,
      valorCusto: insumo.valorCusto,
      quantidadeEstoque: insumo.quantidadeEstoque,
      fornecedor: insumo.fornecedor,
      dataCadastro: insumo.dataCadastro,
      podeSerRevendido: insumo.podeSerRevendido
    });
    setIsInsumoDialogOpen(true);
  };
  
  // Preparar para excluir insumo
  const handlePreExcluirInsumo = (insumo: Insumo) => {
    setInsumoAtual(insumo);
    setIsDeleteDialogOpen(true);
  };
  
  // Excluir insumo
  const handleExcluirInsumo = () => {
    if (!insumoAtual) return;
    
    // Excluir insumo
    const insumosAtualizados = insumos.filter(i => i.id !== insumoAtual.id);
    setInsumos(insumosAtualizados);
    toast.success("Insumo excluído com sucesso!");
    
    setIsDeleteDialogOpen(false);
    setInsumoAtual(null);
  };

  // Ver detalhes do insumo
  const handleVerDetalhesInsumo = (insumo: Insumo) => {
    setInsumoAtual(insumo);
    setIsInsumoDetailOpen(true);
  };

  const value = {
    insumos,
    setInsumos,
    searchTerm,
    setSearchTerm,
    filtroCategoria,
    setFiltroCategoria,
    filtroRevenda,
    setFiltroRevenda,
    insumoAtual,
    setInsumoAtual,
    isInsumoDialogOpen,
    setIsInsumoDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isInsumoDetailOpen,
    setIsInsumoDetailOpen,
    novoInsumo,
    setNovoInsumo,
    insumoVazio,
    insumosFiltrados,
    formatarData,
    handleSalvarInsumo,
    handleEditarInsumo,
    handleExcluirInsumo,
    handlePreExcluirInsumo,
    handleVerDetalhesInsumo
  };

  return (
    <InsumosContext.Provider value={value}>
      {children}
    </InsumosContext.Provider>
  );
};

export const useInsumos = () => {
  const context = useContext(InsumosContext);
  if (context === undefined) {
    throw new Error("useInsumos must be used within a InsumosProvider");
  }
  return context;
};
