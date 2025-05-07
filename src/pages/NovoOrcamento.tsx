
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Save, Trash, ChevronLeft, Search, Package } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Tipos
interface ClienteSimplificado {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cnpj?: string;
}

interface ItemProposta {
  id: number;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface CustoProposta {
  id: number;
  descricao: string;
  valor: number;
}

interface Proposta {
  id: number;
  numero: string;
  data: string;
  cliente: ClienteSimplificado;
  status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada";
  itens: ItemProposta[];
  custos: CustoProposta[];
  observacoes: string;
  valorTotal: number;
  formaPagamento: string;
  prazoEntrega: string;
  prazoObra: string;
  validade: string;
}

interface ProdutoAcabado {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  valorBase: number;
  quantidadeEstoque: number;
  dataCadastro: string;
}

// Dados iniciais
const clientesIniciais: ClienteSimplificado[] = [
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
  }
];

// Opções de unidades
const unidadesOpcoes = ["PÇ", "M²", "M", "UN", "CJ", "KG"];

// Modelo de proposta padrão
const propostaVazia: Proposta = {
  id: 0,
  numero: "",
  data: new Date().toISOString().split('T')[0],
  cliente: {
    id: 0,
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cnpj: ""
  },
  status: "rascunho",
  itens: [],
  custos: [],
  observacoes: "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.",
  valorTotal: 0,
  formaPagamento: "50% DE ENTRADA E 50% NO FINAL",
  prazoEntrega: "15 DIAS",
  prazoObra: "10 DIAS",
  validade: "05 DIAS"
};

// Observações padrão
const obsDefault = "1 - Todos os serviços adicionais a serem realizados fora desta Carta / Proposta implicarão na realização de novos orçamentos para que em seguida possam ser aprovados e executados.\n2 - Em nossos custos estão inclusas todas as despesas para completa execução da obra como: frete dos materiais até o local da obra, carga e descarga, almoços, deslocamento, alimentação e hospedagem da equipe de instaladores.\n3 - Garantia da obra 12 meses.";

const NovoOrcamento = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteSimplificado[]>(clientesIniciais);
  const [proposta, setProposta] = useState<Proposta>({
    ...propostaVazia,
    id: Date.now(),
    numero: `VDR27.3.${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.${Math.floor(Math.random() * 1000)}RO`
  });
  
  const [novoItem, setNovoItem] = useState<Omit<ItemProposta, "id" | "valorTotal">>({
    codigo: "",
    descricao: "",
    unidade: "PÇ",
    quantidade: 1,
    valorUnitario: 0
  });
  
  const [novoCusto, setNovoCusto] = useState<Omit<CustoProposta, "id">>({
    descricao: "",
    valor: 0
  });

  const [produtosAcabados, setProdutosAcabados] = useState<ProdutoAcabado[]>([]);
  const [filtroProduto, setFiltroProduto] = useState("");
  const [dialogProdutosAberto, setDialogProdutosAberto] = useState(false);

  // Carregar clientes do localStorage, se houver
  useEffect(() => {
    const savedClientes = localStorage.getItem("clientes");
    if (savedClientes) {
      setClientes(JSON.parse(savedClientes));
    }

    // Carregar produtos acabados
    const savedProdutos = localStorage.getItem("produtosAcabados");
    if (savedProdutos) {
      setProdutosAcabados(JSON.parse(savedProdutos));
    }
  }, []);
  
  // Calcular o valor total toda vez que os itens ou custos mudarem
  useEffect(() => {
    const totalItens = proposta.itens.reduce((acc, item) => acc + item.valorTotal, 0);
    setProposta(prev => ({
      ...prev,
      valorTotal: totalItens
    }));
  }, [proposta.itens]);
  
  // Gerar um novo número de proposta
  const gerarNumeroProposta = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000);
    return `VDR27.3.${year}${month}${day}.${random}RO`;
  };
  
  // Formatar valores para moeda brasileira
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  // Handler para selecionar cliente
  const handleClienteChange = (clienteId: number) => {
    const clienteSelecionado = clientes.find(c => c.id === clienteId);
    if (clienteSelecionado) {
      setProposta(prev => ({
        ...prev,
        cliente: clienteSelecionado
      }));
    }
  };
  
  // Handler para adicionar um novo item
  const handleAdicionarItem = () => {
    if (!novoItem.codigo || !novoItem.descricao || novoItem.quantidade <= 0 || novoItem.valorUnitario <= 0) {
      toast.error("Preencha todos os campos do item corretamente");
      return;
    }
    
    const valorTotal = novoItem.quantidade * novoItem.valorUnitario;
    
    setProposta(prev => ({
      ...prev,
      itens: [
        ...prev.itens,
        {
          id: Date.now(),
          ...novoItem,
          valorTotal
        }
      ]
    }));
    
    setNovoItem({
      codigo: "",
      descricao: "",
      unidade: "PÇ",
      quantidade: 1,
      valorUnitario: 0
    });
    
    toast.success("Item adicionado com sucesso!");
  };

  // Handler para adicionar produto da lista de produtos acabados
  const handleAdicionarProdutoAcabado = (produto: ProdutoAcabado) => {
    setNovoItem({
      codigo: produto.codigo,
      descricao: produto.nome,
      unidade: produto.unidadeMedida,
      quantidade: 1,
      valorUnitario: produto.valorBase
    });

    setDialogProdutosAberto(false);
    toast.success("Produto selecionado, ajuste a quantidade se necessário");
  };
  
  // Handler para adicionar um novo custo
  const handleAdicionarCusto = () => {
    if (!novoCusto.descricao || novoCusto.valor <= 0) {
      toast.error("Preencha todos os campos do custo corretamente");
      return;
    }
    
    setProposta(prev => ({
      ...prev,
      custos: [
        ...prev.custos,
        {
          id: Date.now(),
          ...novoCusto
        }
      ]
    }));
    
    setNovoCusto({
      descricao: "",
      valor: 0
    });
    
    toast.success("Custo adicionado com sucesso!");
  };
  
  // Handler para remover um item
  const handleRemoverItem = (id: number) => {
    setProposta(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== id)
    }));
    
    toast.success("Item removido com sucesso!");
  };
  
  // Handler para remover um custo
  const handleRemoverCusto = (id: number) => {
    setProposta(prev => ({
      ...prev,
      custos: prev.custos.filter(custo => custo.id !== id)
    }));
    
    toast.success("Custo removido com sucesso!");
  };
  
  // Handler para salvar a proposta
  const handleSalvarProposta = () => {
    // Validar se há itens na proposta
    if (proposta.itens.length === 0) {
      toast.error("Adicione pelo menos um item à proposta");
      return;
    }
    
    // Validar se cliente foi selecionado
    if (!proposta.cliente.id) {
      toast.error("Selecione um cliente para a proposta");
      return;
    }
    
    // Recuperar propostas existentes
    const propostasExistentes = JSON.parse(localStorage.getItem("propostas") || "[]");
    
    // Adicionar nova proposta
    const novasPropostas = [...propostasExistentes, proposta];
    
    // Salvar no localStorage
    localStorage.setItem("propostas", JSON.stringify(novasPropostas));
    
    toast.success("Proposta salva com sucesso!");
    
    // Redirecionar para a página de listagem de propostas
    navigate("/orcamentos");
  };

  // Filtrar produtos para o diálogo de seleção
  const produtosFiltrados = produtosAcabados.filter(produto => {
    const termoBusca = filtroProduto.toLowerCase();
    return (
      produto.nome.toLowerCase().includes(termoBusca) ||
      produto.codigo.toLowerCase().includes(termoBusca) ||
      produto.descricao.toLowerCase().includes(termoBusca) ||
      produto.categoria.toLowerCase().includes(termoBusca)
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/orcamentos")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Nova Proposta</h1>
        </div>
        <Button onClick={handleSalvarProposta}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Proposta
        </Button>
      </div>
      
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informações Gerais</TabsTrigger>
          <TabsTrigger value="itens">Itens e Valores</TabsTrigger>
          <TabsTrigger value="custos">Custos Internos</TabsTrigger>
          <TabsTrigger value="condicoes">Condições Comerciais</TabsTrigger>
        </TabsList>
        
        {/* Tab: Informações Gerais */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número da Proposta</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="numero" 
                      value={proposta.numero} 
                      onChange={(e) => setProposta(prev => ({ ...prev, numero: e.target.value }))} 
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setProposta(prev => ({ ...prev, numero: gerarNumeroProposta() }))}
                    >
                      Gerar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data">Data da Proposta</Label>
                  <Input 
                    id="data" 
                    type="date" 
                    value={proposta.data} 
                    onChange={(e) => setProposta(prev => ({ ...prev, data: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  onValueChange={(value) => handleClienteChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome} {cliente.empresa && `(${cliente.empresa})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {proposta.cliente.id > 0 && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Nome:</span> {proposta.cliente.nome}
                      </div>
                      <div>
                        <span className="font-medium">Empresa:</span> {proposta.cliente.empresa || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {proposta.cliente.email}
                      </div>
                      <div>
                        <span className="font-medium">Telefone:</span> {proposta.cliente.telefone}
                      </div>
                      <div>
                        <span className="font-medium">CNPJ/CPF:</span> {proposta.cliente.cnpj || 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Itens e Valores */}
        <TabsContent value="itens">
          <Card>
            <CardHeader>
              <CardTitle>Itens da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input 
                    id="codigo" 
                    value={novoItem.codigo}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, codigo: e.target.value }))}
                  />
                </div>
                
                <div className="col-span-4">
                  <Label htmlFor="descricao">Descrição</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="descricao" 
                      value={novoItem.descricao}
                      onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                      className="flex-1"
                    />
                    <Dialog open={dialogProdutosAberto} onOpenChange={setDialogProdutosAberto}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Package className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Selecionar Produto Acabado</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="relative mb-4">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar produto por nome, código ou categoria..."
                              className="pl-8"
                              value={filtroProduto}
                              onChange={(e) => setFiltroProduto(e.target.value)}
                            />
                          </div>
                          
                          <div className="rounded-md border max-h-[400px] overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Código</TableHead>
                                  <TableHead>Produto</TableHead>
                                  <TableHead>Categoria</TableHead>
                                  <TableHead>Un.</TableHead>
                                  <TableHead>Valor</TableHead>
                                  <TableHead className="w-[100px]"></TableHead>
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
                                        <div>
                                          <div>{produto.nome}</div>
                                          {produto.descricao && (
                                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                                              {produto.descricao}
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell>{produto.categoria}</TableCell>
                                      <TableCell>{produto.unidadeMedida}</TableCell>
                                      <TableCell>{formatCurrency(produto.valorBase)}</TableCell>
                                      <TableCell>
                                        <Button
                                          size="sm"
                                          onClick={() => handleAdicionarProdutoAcabado(produto)}
                                        >
                                          <Plus className="h-4 w-4 mr-1" /> Selecionar
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="unidade">Un.</Label>
                  <Select
                    value={novoItem.unidade}
                    onValueChange={(value) => setNovoItem(prev => ({ ...prev, unidade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Un" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidadesOpcoes.map((unidade) => (
                        <SelectItem key={unidade} value={unidade}>
                          {unidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1">
                  <Label htmlFor="quantidade">Qtd.</Label>
                  <Input 
                    id="quantidade" 
                    type="number"
                    min="1"
                    value={novoItem.quantidade.toString()}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="valorUnitario">Valor Unit. (R$)</Label>
                  <Input 
                    id="valorUnitario" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoItem.valorUnitario.toString()}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="col-span-2">
                  <Button className="w-full" onClick={handleAdicionarItem}>
                    <Plus className="mr-1 h-4 w-4" /> Adicionar Item
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead className="w-[300px]">Descrição</TableHead>
                      <TableHead>Un.</TableHead>
                      <TableHead>Qtd.</TableHead>
                      <TableHead>Valor Unit.</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposta.itens.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          Nenhum item adicionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      proposta.itens.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.codigo}</TableCell>
                          <TableCell className="max-w-[300px] truncate" title={item.descricao}>
                            {item.descricao}
                          </TableCell>
                          <TableCell>{item.unidade}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>{formatCurrency(item.valorUnitario)}</TableCell>
                          <TableCell>{formatCurrency(item.valorTotal)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleRemoverItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end space-x-4">
                <div className="text-xl font-medium">
                  Total: {formatCurrency(proposta.valorTotal)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Custos Internos */}
        <TabsContent value="custos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Custos Internos (Não aparecem na proposta)</CardTitle>
              <div className="text-sm text-muted-foreground">
                Estes custos são apenas para controle interno e não serão exibidos no PDF da proposta.
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-8">
                  <Label htmlFor="custodescricao">Descrição do Custo</Label>
                  <Input 
                    id="custodescricao" 
                    value={novoCusto.descricao}
                    onChange={(e) => setNovoCusto(prev => ({ ...prev, descricao: e.target.value }))}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="custovalor">Valor (R$)</Label>
                  <Input 
                    id="custovalor" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoCusto.valor.toString()}
                    onChange={(e) => setNovoCusto(prev => ({ ...prev, valor: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="col-span-2">
                  <Button className="w-full" onClick={handleAdicionarCusto}>
                    <Plus className="mr-1 h-4 w-4" /> Adicionar Custo
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[70%]">Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposta.custos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          Nenhum custo adicionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      proposta.custos.map((custo) => (
                        <TableRow key={custo.id}>
                          <TableCell>{custo.descricao}</TableCell>
                          <TableCell>{formatCurrency(custo.valor)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleRemoverCusto(custo.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end space-x-4">
                <div className="text-lg font-medium">
                  Total de Custos: {formatCurrency(proposta.custos.reduce((sum, item) => sum + item.valor, 0))}
                </div>
              </div>
              
              <div>
                <div className="bg-yellow-100 p-3 rounded-md text-sm border border-yellow-300">
                  <p className="font-medium text-yellow-800">
                    Análise da Lucratividade
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Valor Venda:</span> {formatCurrency(proposta.valorTotal)}
                    </div>
                    <div>
                      <span className="font-medium">Total Custos:</span> {formatCurrency(proposta.custos.reduce((sum, item) => sum + item.valor, 0))}
                    </div>
                    <div>
                      <span className="font-medium">Lucro Bruto:</span> {formatCurrency(proposta.valorTotal - proposta.custos.reduce((sum, item) => sum + item.valor, 0))}
                    </div>
                    <div>
                      <span className="font-medium">Margem (%):</span> {
                        proposta.valorTotal === 0 ? '0%' :
                        `${((proposta.valorTotal - proposta.custos.reduce((sum, item) => sum + item.valor, 0)) / proposta.valorTotal * 100).toFixed(2)}%`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Condições Comerciais */}
        <TabsContent value="condicoes">
          <Card>
            <CardHeader>
              <CardTitle>Condições Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Input 
                    id="formaPagamento" 
                    value={proposta.formaPagamento} 
                    onChange={(e) => setProposta(prev => ({ ...prev, formaPagamento: e.target.value }))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validade">Validade da Proposta</Label>
                  <Input 
                    id="validade" 
                    value={proposta.validade}
                    onChange={(e) => setProposta(prev => ({ ...prev, validade: e.target.value }))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prazoEntrega">Prazo de Entrega do Material</Label>
                  <Input 
                    id="prazoEntrega" 
                    value={proposta.prazoEntrega}
                    onChange={(e) => setProposta(prev => ({ ...prev, prazoEntrega: e.target.value }))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prazoObra">Prazo de Execução da Obra</Label>
                  <Input 
                    id="prazoObra" 
                    value={proposta.prazoObra}
                    onChange={(e) => setProposta(prev => ({ ...prev, prazoObra: e.target.value }))} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações da Proposta</Label>
                <Textarea 
                  id="observacoes" 
                  value={proposta.observacoes} 
                  onChange={(e) => setProposta(prev => ({ ...prev, observacoes: e.target.value }))} 
                  rows={6}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setProposta(prev => ({ ...prev, observacoes: obsDefault }))}
                >
                  Restaurar Padrão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/orcamentos")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button onClick={handleSalvarProposta}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Proposta
        </Button>
      </div>
    </div>
  );
};

export default NovoOrcamento;
