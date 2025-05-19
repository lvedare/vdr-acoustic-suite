
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, FileText, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Types for caixa transactions
interface Transacao {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  categoria: string;
  responsavel: string;
  formaPagamento: string;
  comprovante?: string;
}

interface ObraCaixaCardProps {
  obraId: number;
  nomeObra: string;
}

export const ObraCaixaCard = ({ obraId, nomeObra }: ObraCaixaCardProps) => {
  // Mock transaction data
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { 
      id: 1, 
      data: "2025-05-15", 
      descricao: "Compra de materiais", 
      valor: 1250.50, 
      tipo: "saida", 
      categoria: "Material",
      responsavel: "Carlos Silva",
      formaPagamento: "Dinheiro"
    },
    { 
      id: 2, 
      data: "2025-05-16", 
      descricao: "Adiantamento de cliente", 
      valor: 5000.00, 
      tipo: "entrada", 
      categoria: "Pagamento",
      responsavel: "Maria Santos",
      formaPagamento: "Transferência"
    },
    { 
      id: 3, 
      data: "2025-05-17", 
      descricao: "Pagamento de mão de obra", 
      valor: 2350.00, 
      tipo: "saida", 
      categoria: "Mão de obra",
      responsavel: "Carlos Silva",
      formaPagamento: "Dinheiro"
    },
  ]);
  
  const [novaTransacao, setNovaTransacao] = useState<Omit<Transacao, "id">>({
    data: new Date().toISOString().split('T')[0],
    descricao: "",
    valor: 0,
    tipo: "entrada",
    categoria: "",
    responsavel: "",
    formaPagamento: ""
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");
  
  // Filter transactions based on active tab
  const transacoesFiltradas = activeTab === "todas" 
    ? transacoes 
    : transacoes.filter(t => t.tipo === activeTab);
  
  // Calculate balance
  const saldoEntradas = transacoes
    .filter(t => t.tipo === "entrada")
    .reduce((sum, t) => sum + t.valor, 0);
    
  const saldoSaidas = transacoes
    .filter(t => t.tipo === "saida")
    .reduce((sum, t) => sum + t.valor, 0);
    
  const saldoTotal = saldoEntradas - saldoSaidas;
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };
  
  // Handle adding transaction
  const handleAddTransacao = () => {
    if (!novaTransacao.descricao || novaTransacao.valor <= 0 || !novaTransacao.categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const newTransacao: Transacao = {
      id: Math.max(...transacoes.map(t => t.id), 0) + 1,
      ...novaTransacao
    };
    
    setTransacoes([newTransacao, ...transacoes]);
    
    setNovaTransacao({
      data: new Date().toISOString().split('T')[0],
      descricao: "",
      valor: 0,
      tipo: "entrada",
      categoria: "",
      responsavel: "",
      formaPagamento: ""
    });
    
    setIsAddDialogOpen(false);
    toast.success(`${novaTransacao.tipo === "entrada" ? "Entrada" : "Saída"} adicionada com sucesso!`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Caixa da Obra</CardTitle>
          <CardDescription>Controle de entradas e saídas financeiras</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Nova Transação
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Entradas</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(saldoEntradas)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Saídas</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(saldoSaidas)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Saldo Atual</div>
              <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldoTotal)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="entrada">Entradas</TabsTrigger>
              <TabsTrigger value="saida">Saídas</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" />
              Exportar
            </Button>
          </div>
          
          <TabsContent value="todas" className="space-y-4">
            <TransacoesTable 
              transacoes={transacoesFiltradas}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="entrada" className="space-y-4">
            <TransacoesTable 
              transacoes={transacoesFiltradas}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="saida" className="space-y-4">
            <TransacoesTable 
              transacoes={transacoesFiltradas}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
        
        {/* Dialog para adicionar nova transação */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Adicionar nova movimentação financeira para obra {nomeObra}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Transação</Label>
                  <Select
                    value={novaTransacao.tipo}
                    onValueChange={(value) => setNovaTransacao({...novaTransacao, tipo: value as "entrada" | "saida"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novaTransacao.data}
                    onChange={(e) => setNovaTransacao({...novaTransacao, data: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  placeholder="Descrição da transação"
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao({...novaTransacao, descricao: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={novaTransacao.valor === 0 ? "" : novaTransacao.valor}
                    onChange={(e) => setNovaTransacao({...novaTransacao, valor: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={novaTransacao.categoria || "selecionar"}
                    onValueChange={(value) => setNovaTransacao({...novaTransacao, categoria: value === "selecionar" ? "" : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="selecionar">Selecione uma categoria</SelectItem>
                      {novaTransacao.tipo === "entrada" ? (
                        <>
                          <SelectItem value="Pagamento">Pagamento</SelectItem>
                          <SelectItem value="Adiantamento">Adiantamento</SelectItem>
                          <SelectItem value="Ajuste">Ajuste</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Material">Material</SelectItem>
                          <SelectItem value="Mão de obra">Mão de obra</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Ajuste">Ajuste</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    placeholder="Nome do responsável"
                    value={novaTransacao.responsavel}
                    onChange={(e) => setNovaTransacao({...novaTransacao, responsavel: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Select
                    value={novaTransacao.formaPagamento || "selecionar"}
                    onValueChange={(value) => setNovaTransacao({...novaTransacao, formaPagamento: value === "selecionar" ? "" : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="selecionar">Selecione</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="Pix">Pix</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTransacao}>
                Adicionar Transação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Component for transactions table
interface TransacoesTableProps {
  transacoes: Transacao[];
  formatCurrency: (value: number) => string;
  formatDate: (dateStr: string) => string;
}

const TransacoesTable = ({ transacoes, formatCurrency, formatDate }: TransacoesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transacoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          ) : (
            transacoes.map((transacao) => (
              <TableRow key={transacao.id}>
                <TableCell>{formatDate(transacao.data)}</TableCell>
                <TableCell>
                  <div className="font-medium">{transacao.descricao}</div>
                  <div className="text-sm text-muted-foreground">{transacao.formaPagamento}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transacao.categoria}</Badge>
                </TableCell>
                <TableCell>{transacao.responsavel}</TableCell>
                <TableCell className={`text-right font-medium ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {transacao.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transacao.valor)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
