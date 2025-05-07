
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

// Tipos
interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  tipoCliente: "pf" | "pj";
  observacoes?: string;
  dataCadastro: string;
}

// Clientes iniciais para demonstração
const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: "Rayan Fássio Santos",
    email: "rayanfassio@gmail.com",
    telefone: "(62)98244-4078",
    empresa: "J TEM RAYAN FASSIO",
    cnpj: "11.222.333/0001-44",
    endereco: "Av. Salvador Di Bernardi, 270",
    cidade: "Goiânia",
    estado: "GO",
    tipoCliente: "pj",
    observacoes: "Cliente prefere acabamento em madeira natural.",
    dataCadastro: "2025-05-01"
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "maria@empresa.com",
    telefone: "(62)98765-4321",
    empresa: "Empresa ABC",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123",
    cidade: "Goiânia",
    estado: "GO",
    tipoCliente: "pj",
    observacoes: "Cliente exigente com prazos.",
    dataCadastro: "2025-04-15"
  },
  {
    id: 3,
    nome: "João Pereira",
    email: "joao@construcoes.com",
    telefone: "(62)91234-5678",
    empresa: "Construções XYZ",
    cnpj: "98.765.432/0001-10",
    endereco: "Av. Central, 500",
    cidade: "Aparecida de Goiânia",
    estado: "GO",
    tipoCliente: "pj",
    dataCadastro: "2025-03-22"
  }
];

// Cliente vazio para o formulário
const clienteVazio: Omit<Cliente, "id" | "dataCadastro"> = {
  nome: "",
  email: "",
  telefone: "",
  empresa: "",
  cnpj: "",
  endereco: "",
  cidade: "",
  estado: "",
  tipoCliente: "pj",
  observacoes: ""
};

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const [novoCliente, setNovoCliente] = useState<Omit<Cliente, "id" | "dataCadastro">>(clienteVazio);
  const navigate = useNavigate();

  // Carregar clientes do localStorage ou usar os iniciais
  useEffect(() => {
    const storedClientes = localStorage.getItem("clientes");
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
    } else {
      setClientes(clientesIniciais);
      localStorage.setItem("clientes", JSON.stringify(clientesIniciais));
    }
  }, []);

  // Filtrar clientes com base na busca
  const filteredClientes = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(searchLower) ||
      cliente.empresa?.toLowerCase().includes(searchLower) ||
      cliente.email.toLowerCase().includes(searchLower) ||
      cliente.telefone.includes(searchTerm)
    );
  });

  // Formatar data
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Abrir dialog para edição de cliente
  const handleEditCliente = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setNovoCliente({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      empresa: cliente.empresa || "",
      cnpj: cliente.cnpj || "",
      endereco: cliente.endereco || "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || "",
      tipoCliente: cliente.tipoCliente,
      observacoes: cliente.observacoes || ""
    });
    setIsDialogOpen(true);
  };

  // Abrir dialog para confirmar exclusão
  const handleDeleteConfirm = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setIsDeleteDialogOpen(true);
  };

  // Excluir cliente
  const handleDeleteCliente = () => {
    if (currentCliente) {
      const updatedClientes = clientes.filter(c => c.id !== currentCliente.id);
      setClientes(updatedClientes);
      localStorage.setItem("clientes", JSON.stringify(updatedClientes));
      setIsDeleteDialogOpen(false);
      toast.success(`Cliente ${currentCliente.nome} excluído com sucesso!`);
    }
  };

  // Adicionar ou Atualizar cliente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!novoCliente.nome || !novoCliente.email || !novoCliente.telefone) {
      toast.error("Por favor, preencha os campos obrigatórios: Nome, Email e Telefone");
      return;
    }
    
    if (currentCliente) {
      // Atualizar cliente existente
      const updatedClientes = clientes.map(c => {
        if (c.id === currentCliente.id) {
          return {
            ...c,
            ...novoCliente
          };
        }
        return c;
      });
      
      setClientes(updatedClientes);
      localStorage.setItem("clientes", JSON.stringify(updatedClientes));
      toast.success(`Cliente ${novoCliente.nome} atualizado com sucesso!`);
    } else {
      // Adicionar novo cliente
      const newCliente: Cliente = {
        ...novoCliente,
        id: Date.now(),
        dataCadastro: new Date().toISOString().split('T')[0]
      };
      
      const updatedClientes = [...clientes, newCliente];
      setClientes(updatedClientes);
      localStorage.setItem("clientes", JSON.stringify(updatedClientes));
      toast.success(`Cliente ${novoCliente.nome} adicionado com sucesso!`);
    }
    
    // Limpar formulário e fechar dialog
    setNovoCliente(clienteVazio);
    setCurrentCliente(null);
    setIsDialogOpen(false);
  };

  // Criar nova proposta para um cliente
  const handleNovaPropostaParaCliente = (cliente: Cliente) => {
    // Aqui redirecionaríamos para a criação de proposta com cliente pré-selecionado
    toast.info(`Criando nova proposta para ${cliente.nome}...`);
    
    // Como essa funcionalidade está em desenvolvimento, mostramos apenas um toast
    setTimeout(() => {
      toast("Funcionalidade em desenvolvimento", {
        description: "Esta funcionalidade será implementada em breve."
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setCurrentCliente(null);
              setNovoCliente(clienteVazio);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentCliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              <DialogDescription>
                {currentCliente 
                  ? "Atualize as informações do cliente abaixo." 
                  : "Preencha as informações do novo cliente abaixo."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome" 
                    value={novoCliente.nome}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input 
                    id="telefone" 
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, telefone: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Cliente</Label>
                  <div className="flex space-x-4 pt-2">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="tipoCliente" 
                        value="pj"
                        checked={novoCliente.tipoCliente === "pj"}
                        onChange={() => setNovoCliente(prev => ({ ...prev, tipoCliente: "pj" }))}
                      />
                      <span>Pessoa Jurídica</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="tipoCliente" 
                        value="pf"
                        checked={novoCliente.tipoCliente === "pf"}
                        onChange={() => setNovoCliente(prev => ({ ...prev, tipoCliente: "pf" }))}
                      />
                      <span>Pessoa Física</span>
                    </label>
                  </div>
                </div>
                
                {novoCliente.tipoCliente === "pj" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa / Nome Fantasia</Label>
                      <Input 
                        id="empresa" 
                        value={novoCliente.empresa}
                        onChange={(e) => setNovoCliente(prev => ({ ...prev, empresa: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">{novoCliente.tipoCliente === "pj" ? "CNPJ" : "CPF"}</Label>
                      <Input 
                        id="cnpj" 
                        value={novoCliente.cnpj}
                        onChange={(e) => setNovoCliente(prev => ({ ...prev, cnpj: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input 
                    id="endereco" 
                    value={novoCliente.endereco}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    value={novoCliente.cidade}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, cidade: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input 
                    id="estado" 
                    value={novoCliente.estado}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, estado: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input 
                    id="observacoes" 
                    value={novoCliente.observacoes}
                    onChange={(e) => setNovoCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="submit">
                  {currentCliente ? "Atualizar Cliente" : "Salvar Cliente"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Gerenciamento de Clientes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nome / Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="font-medium">{cliente.nome}</div>
                        <div className="text-sm text-muted-foreground">{cliente.empresa}</div>
                      </TableCell>
                      <TableCell>
                        <div>{cliente.email}</div>
                        <div className="text-sm text-muted-foreground">{cliente.telefone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cliente.tipoCliente === "pj" ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-green-100 text-green-800 border-green-300"}>
                          {cliente.tipoCliente === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(cliente.dataCadastro)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleNovaPropostaParaCliente(cliente)}
                            title="Nova Proposta"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditCliente(cliente)}
                            title="Editar Cliente"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteConfirm(cliente)}
                            title="Excluir Cliente"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente {currentCliente?.nome}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCliente}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clientes;
