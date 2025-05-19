import React, { useState, useEffect } from "react";
import { FileText, Plus, FileDown, Search, Trash, Eye, Edit, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

// Tipos para o Sistema de Orçamento
import { 
  ClienteSimplificado, 
  ItemProposta, 
  CustoProposta, 
  Proposta,
  formatCurrency
} from "@/types/orcamento";

import { gerarNumeroProposta, converterAtendimentoParaProposta } from "@/utils/propostaUtils";

// Dados de exemplo
const clientesExemplo: ClienteSimplificado[] = [
  {
    id: 1,
    nome: "Rayan Fássio Santos",
    email: "rayanfassio@gmail.com",
    telefone: "(62)98244-4078",
    empresa: "J TEM RAYAN FASSIO",
    cnpj: "11"
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "maria@empresa.com",
    telefone: "(62)98765-4321",
    empresa: "Empresa ABC",
    cnpj: "12.345.678/0001-90"
  },
  {
    id: 3,
    nome: "João Pereira",
    email: "joao@construcoes.com",
    telefone: "(62)91234-5678",
    empresa: "Construções XYZ",
    cnpj: "98.765.432/0001-10"
  }
];

// Propostas iniciais de exemplo
const propostasIniciais: Proposta[] = [
  {
    id: 1,
    numero: "VDR27.3.20241425.0RO",
    data: "2025-05-07",
    cliente: clientesExemplo[0],
    status: "enviada",
    itens: [
      {
        id: 1,
        codigo: "PA148",
        descricao: "PORTA ACÚSTICA, COMPOSIÇÃO DE MADEIRA, DIMENSÃO 80X210 CM, ESPESSURA DE PAREDE 11 X 15 CM",
        unidade: "PÇ",
        quantidade: 1,
        valorUnitario: 6820.05,
        valorTotal: 6820.05
      }
    ],
    custos: [
      { id: 1, descricao: "Material acústico", valor: 2500 },
      { id: 2, descricao: "Mão de obra", valor: 1800 },
      { id: 3, descricao: "Ferragens", valor: 700 },
      { id: 4, descricao: "Transporte", valor: 300 }
    ],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 6820.05,
    formaPagamento: "50% DE ENTRADA E 50% NO FINAL",
    prazoEntrega: "15 DIAS",
    prazoObra: "10 DIAS",
    validade: "05 DIAS"
  },
  {
    id: 2,
    numero: "VDR27.3.20241426.0RO",
    data: "2025-05-01",
    cliente: clientesExemplo[1],
    status: "aprovada",
    itens: [
      {
        id: 1,
        codigo: "PA150",
        descricao: "REVESTIMENTO ACÚSTICO PARA PAREDE, ESPUMA DE ALTA DENSIDADE, 50MM",
        unidade: "M²",
        quantidade: 25,
        valorUnitario: 320.00,
        valorTotal: 8000.00
      },
      {
        id: 2,
        codigo: "PA151",
        descricao: "INSTALAÇÃO DE REVESTIMENTO ACÚSTICO",
        unidade: "M²",
        quantidade: 25,
        valorUnitario: 80.00,
        valorTotal: 2000.00
      }
    ],
    custos: [
      { id: 1, descricao: "Material acústico", valor: 6500 },
      { id: 2, descricao: "Mão de obra", valor: 2500 },
      { id: 3, descricao: "Transporte", valor: 500 }
    ],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 10000.00,
    formaPagamento: "40% DE ENTRADA, 30% NA ENTREGA DOS MATERIAIS E 30% NA FINALIZAÇÃO",
    prazoEntrega: "20 DIAS",
    prazoObra: "15 DIAS",
    validade: "07 DIAS"
  },
  {
    id: 3,
    numero: "VDR27.3.20241427.0RO",
    data: "2025-04-25",
    cliente: clientesExemplo[2],
    status: "rejeitada",
    itens: [
      {
        id: 1,
        codigo: "PA160",
        descricao: "TRATAMENTO ACÚSTICO PARA SALA DE REUNIÕES",
        unidade: "M²",
        quantidade: 35,
        valorUnitario: 450.00,
        valorTotal: 15750.00
      }
    ],
    custos: [
      { id: 1, descricao: "Material acústico premium", valor: 10000 },
      { id: 2, descricao: "Mão de obra especializada", valor: 4000 },
      { id: 3, descricao: "Logística e transporte", valor: 800 },
    ],
    observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
    valorTotal: 15750.00,
    formaPagamento: "30% DE ENTRADA, 40% NA ENTREGA DOS MATERIAIS E 30% NA FINALIZAÇÃO",
    prazoEntrega: "25 DIAS",
    prazoObra: "20 DIAS",
    validade: "10 DIAS"
  }
];

// Dados de exemplo para atendimentos
const atendimentosExemplo = [
  {
    id: 1,
    cliente: "João Silva",
    contato: "(11) 98765-4321",
    assunto: "Orçamento para tratamento acústico",
    data: "07/05/2025",
    hora: "09:30",
    canal: "WhatsApp",
    status: "Novo",
    mensagem: "Olá, gostaria de um orçamento para tratamento acústico em meu home studio."
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    contato: "(11) 91234-5678",
    assunto: "Dúvida sobre material",
    data: "07/05/2025",
    hora: "10:15",
    canal: "Email",
    status: "Em andamento",
    mensagem: "Bom dia, gostaria de saber qual o melhor material para isolamento acústico em uma sala pequena."
  },
  {
    id: 3,
    cliente: "Empresa ABC",
    contato: "(11) 3123-4567",
    assunto: "Visita técnica",
    data: "07/05/2025",
    hora: "11:00",
    canal: "Telefone",
    status: "Agendado",
    mensagem: "Preciso de uma visita técnica para avaliar o isolamento acústico de salas de reunião."
  }
];

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermAtendimento, setSearchTermAtendimento] = useState("");
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [selectedAtendimento, setSelectedAtendimento] = useState<any | null>(null);
  const navigate = useNavigate();

  // Recuperar propostas do localStorage ou usar o exemplo
  useEffect(() => {
    const savedPropostas = localStorage.getItem("propostas");
    if (savedPropostas) {
      setPropostas(JSON.parse(savedPropostas));
    } else {
      setPropostas(propostasIniciais);
      localStorage.setItem("propostas", JSON.stringify(propostasIniciais));
    }
  }, []);

  // Filtrar propostas com base no termo de pesquisa
  const filteredPropostas = propostas.filter(proposta => {
    return (
      proposta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filtrar atendimentos com base no termo de pesquisa
  const filteredAtendimentos = atendimentosExemplo.filter(atendimento => {
    return (
      atendimento.cliente.toLowerCase().includes(searchTermAtendimento.toLowerCase()) ||
      atendimento.assunto.toLowerCase().includes(searchTermAtendimento.toLowerCase()) ||
      atendimento.mensagem.toLowerCase().includes(searchTermAtendimento.toLowerCase())
    );
  });

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada":
        return "bg-green-100 text-green-800 border-green-300";
      case "enviada":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "rejeitada":
        return "bg-red-100 text-red-800 border-red-300";
      case "expirada":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Status color for atendimentos
  const getAtendimentoStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-blue-100 text-blue-800";
      case "Em andamento":
        return "bg-amber-100 text-amber-800";
      case "Agendado":
        return "bg-purple-100 text-purple-800";
      case "Convertido":
        return "bg-emerald-100 text-emerald-800";
      case "Crítico":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para formatar datas
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para simular download de PDF
  const handleDownloadPDF = (proposta: Proposta) => {
    toast.success(`PDF da proposta ${proposta.numero} sendo gerado...`, {
      description: "O download começará em instantes.",
    });
    
    // Normalmente aqui iríamos gerar um PDF real, mas para fins de demonstração:
    setTimeout(() => {
      toast.success(`PDF da proposta ${proposta.numero} gerado com sucesso!`);
    }, 2000);
  };

  // Função para lidar com a exclusão de proposta
  const handleDelete = (id: number) => {
    const updatedPropostas = propostas.filter(proposta => proposta.id !== id);
    setPropostas(updatedPropostas);
    localStorage.setItem("propostas", JSON.stringify(updatedPropostas));
    
    toast.success("Proposta excluída com sucesso!");
  };

  // Função para mudar o status
  const handleChangeStatus = (id: number, newStatus: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada") => {
    const updatedPropostas = propostas.map(proposta => {
      if (proposta.id === id) {
        return { ...proposta, status: newStatus };
      }
      return proposta;
    });
    
    setPropostas(updatedPropostas);
    localStorage.setItem("propostas", JSON.stringify(updatedPropostas));
    
    toast.success(`Status alterado para ${newStatus.toUpperCase()}`);
  };
  
  // Função para criar nova proposta (redirecionando para a página de criação)
  const handleNewProposal = () => {
    toast.info("Redirecionando para a criação de proposta...");
    navigate("/novo-orcamento");
  };

  // Função para converter um atendimento em orçamento
  const handleCriarPropostaFromAtendimento = (atendimento: any) => {
    // Convert service record to proposal
    const novaProposta = converterAtendimentoParaProposta(atendimento);
    
    // Add to propostas array and save to localStorage
    const novasPropostas = [...propostas, novaProposta];
    setPropostas(novasPropostas);
    localStorage.setItem("propostas", JSON.stringify(novasPropostas));
    
    // Show success message
    toast.success(`Proposta criada a partir do atendimento com sucesso!`);
    
    // Navigate to view the proposal
    navigate(`/orcamentos/${novaProposta.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button onClick={handleNewProposal}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Gerenciamento de Propostas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar propostas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas">
            <TabsList className="mb-4">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
              <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
              <TabsTrigger value="atendimentos">
                <MessageSquare className="mr-2 h-4 w-4" />
                Atendimentos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="todas">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropostas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma proposta encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPropostas.map((proposta) => (
                        <TableRow key={proposta.id}>
                          <TableCell className="font-medium">{proposta.numero}</TableCell>
                          <TableCell>{proposta.cliente.nome}</TableCell>
                          <TableCell>{formatDate(proposta.data)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(proposta.status)}
                            >
                              {proposta.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(proposta.valorTotal)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleDownloadPDF(proposta)}>
                                <FileDown className="h-4 w-4" />
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[650px]">
                                  <DialogHeader>
                                    <DialogTitle>Detalhes da Proposta</DialogTitle>
                                    <DialogDescription>
                                      Proposta {proposta.numero} - {formatDate(proposta.data)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
                                    <div className="space-y-2">
                                      <h3 className="font-medium">Informa��ões do Cliente</h3>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="font-medium">Nome:</span> {proposta.cliente.nome}
                                        </div>
                                        <div>
                                          <span className="font-medium">Empresa:</span> {proposta.cliente.empresa || 'N/A'}
                                        </div>
                                        <div>
                                          <span className="font-medium">E-mail:</span> {proposta.cliente.email}
                                        </div>
                                        <div>
                                          <span className="font-medium">Telefone:</span> {proposta.cliente.telefone}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h3 className="font-medium">Itens da Proposta</h3>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead className="w-[80px]">Código</TableHead>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead>Qtd</TableHead>
                                            <TableHead className="text-right">Valor Unit.</TableHead>
                                            <TableHead className="text-right">Valor Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {proposta.itens.map((item) => (
                                            <TableRow key={item.id}>
                                              <TableCell>{item.codigo}</TableCell>
                                              <TableCell className="max-w-[250px] truncate" title={item.descricao}>
                                                {item.descricao}
                                              </TableCell>
                                              <TableCell>{item.quantidade}</TableCell>
                                              <TableCell className="text-right">
                                                {formatCurrency(item.valorUnitario)}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                {formatCurrency(item.valorTotal)}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h3 className="font-medium">Informações Comerciais</h3>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="font-medium">Forma de Pagamento:</span> {proposta.formaPagamento}
                                        </div>
                                        <div>
                                          <span className="font-medium">Prazo de Entrega:</span> {proposta.prazoEntrega}
                                        </div>
                                        <div>
                                          <span className="font-medium">Prazo de Obra:</span> {proposta.prazoObra}
                                        </div>
                                        <div>
                                          <span className="font-medium">Validade:</span> {proposta.validade}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h3 className="font-medium">Observações</h3>
                                      <p className="text-sm whitespace-pre-line">{proposta.observacoes}</p>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter className="flex justify-between items-center">
                                    <span className="text-xl font-medium">
                                      Total: {formatCurrency(proposta.valorTotal)}
                                    </span>
                                    <Button onClick={() => handleDownloadPDF(proposta)}>
                                      <FileDown className="mr-2 h-4 w-4" />
                                      Download PDF
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Alterar Status</DialogTitle>
                                    <DialogDescription>
                                      Selecione o novo status para a proposta {proposta.numero}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="grid grid-cols-2 gap-2 py-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        handleChangeStatus(proposta.id, "enviada");
                                        document.querySelector("dialog")?.close();
                                      }}
                                      className={`justify-start ${proposta.status === 'enviada' ? 'border-blue-500' : ''}`}
                                    >
                                      <Badge variant="outline" className={getStatusColor("enviada")}>ENVIADA</Badge>
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        handleChangeStatus(proposta.id, "aprovada");
                                        document.querySelector("dialog")?.close();
                                      }}
                                      className={`justify-start ${proposta.status === 'aprovada' ? 'border-green-500' : ''}`}
                                    >
                                      <Badge variant="outline" className={getStatusColor("aprovada")}>APROVADA</Badge>
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        handleChangeStatus(proposta.id, "rejeitada");
                                        document.querySelector("dialog")?.close();
                                      }}
                                      className={`justify-start ${proposta.status === 'rejeitada' ? 'border-red-500' : ''}`}
                                    >
                                      <Badge variant="outline" className={getStatusColor("rejeitada")}>REJEITADA</Badge>
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        handleChangeStatus(proposta.id, "expirada");
                                        document.querySelector("dialog")?.close();
                                      }}
                                      className={`justify-start ${proposta.status === 'expirada' ? 'border-yellow-500' : ''}`}
                                    >
                                      <Badge variant="outline" className={getStatusColor("expirada")}>EXPIRADA</Badge>
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirmar exclusão</DialogTitle>
                                    <DialogDescription>
                                      Tem certeza que deseja excluir a proposta {proposta.numero}?
                                      Esta ação não pode ser desfeita.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <DialogFooter>
                                    <Button
                                      variant="destructive" 
                                      onClick={() => {
                                        handleDelete(proposta.id);
                                        document.querySelector("dialog")?.close();
                                      }}
                                    >
                                      Excluir
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Tabelas para as outras abas seriam similares mas filtradas pelo status */}
            <TabsContent value="enviadas">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropostas.filter(p => p.status === 'enviada').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma proposta enviada encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPropostas
                        .filter(p => p.status === 'enviada')
                        .map((proposta) => (
                          <TableRow key={proposta.id}>
                            <TableCell className="font-medium">{proposta.numero}</TableCell>
                            <TableCell>{proposta.cliente.nome}</TableCell>
                            <TableCell>{formatDate(proposta.data)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(proposta.status)}
                              >
                                {proposta.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(proposta.valorTotal)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleDownloadPDF(proposta)}>
                                  <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="aprovadas">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropostas.filter(p => p.status === 'aprovada').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma proposta aprovada encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPropostas
                        .filter(p => p.status === 'aprovada')
                        .map((proposta) => (
                          <TableRow key={proposta.id}>
                            <TableCell className="font-medium">{proposta.numero}</TableCell>
                            <TableCell>{proposta.cliente.nome}</TableCell>
                            <TableCell>{formatDate(proposta.data)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(proposta.status)}
                              >
                                {proposta.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(proposta.valorTotal)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleDownloadPDF(proposta)}>
                                  <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="rejeitadas">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropostas.filter(p => p.status === 'rejeitada').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhuma proposta rejeitada encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPropostas
                        .filter(p => p.status === 'rejeitada')
                        .map((proposta) => (
                          <TableRow key={proposta.id}>
                            <TableCell className="font-medium">{proposta.numero}</TableCell>
                            <TableCell>{proposta.cliente.nome}</TableCell>
                            <TableCell>{formatDate(proposta.data)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(proposta.status)}
                              >
                                {proposta.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(proposta.valorTotal)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleDownloadPDF(proposta)}>
                                  <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* New tab for "Atendimentos" */}
            <TabsContent value="atendimentos" className="mt-4">
              <div className="space-y-4">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar atendimentos..."
                    className="pl-8"
                    value={searchTermAtendimento}
                    onChange={(e) => setSearchTermAtendimento(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Lista de atendimentos */}
                  <div className="rounded-md border">
                    <div className="flex flex-col divide-y">
                      {filteredAtendimentos.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          Nenhum atendimento encontrado.
                        </div>
                      ) : (
                        filteredAtendimentos.map((atendimento) => (
                          <div
                            key={atendimento.id}
                            className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                              selectedAtendimento?.id === atendimento.id
                                ? "bg-muted/50"
                                : ""
                            }`}
                            onClick={() => setSelectedAtendimento(atendimento)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{atendimento.cliente}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{atendimento.data}</span>
                                <span>{atendimento.hora}</span>
                              </div>
                            </div>
                            <div className="mt-1 text-sm">{atendimento.assunto}</div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{atendimento.canal}</Badge>
                                <Badge
                                  className={getAtendimentoStatusColor(atendimento.status)}
                                  variant="secondary"
                                >
                                  {atendimento.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Detalhes do atendimento selecionado */}
                  <div className="rounded-md border">
                    {selectedAtendimento ? (
                      <div className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            Detalhes do Atendimento
                          </h3>
                          <Badge
                            className={getAtendimentoStatusColor(selectedAtendimento.status)}
                            variant="secondary"
                          >
                            {selectedAtendimento.status}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col space-y-3">
                            <div>
                              <div className="text-sm text-muted-foreground">Cliente</div>
                              <div className="font-medium">{selectedAtendimento.cliente}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Contato</div>
                              <div>{selectedAtendimento.contato}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Assunto</div>
                              <div>{selectedAtendimento.assunto}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Data e Hora</div>
                              <div>{selectedAtendimento.data} às {selectedAtendimento.hora}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Canal</div>
                              <Badge variant="outline">{selectedAtendimento.canal}</Badge>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Mensagem</div>
                            <div className="rounded-md bg-muted p-3 text-sm">
                              {selectedAtendimento.mensagem}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button 
                            className="bg-vdr-blue hover:bg-blue-800"
                            onClick={() => handleCriarPropostaFromAtendimento(selectedAtendimento)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Proposta
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
                        Selecione um atendimento para ver os detalhes.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orcamentos;
