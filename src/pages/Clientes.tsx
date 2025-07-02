
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clienteService } from "@/services/supabaseService";
import { toast } from "sonner";
import { ClienteSimplificado } from "@/types/orcamento";

const Clientes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ClienteSimplificado | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cnpj: "",
    endereco_rua: "",
    endereco_numero: "",
    endereco_bairro: "",
    endereco_cidade: "",
    endereco_estado: "",
    endereco_cep: "",
    inscricao_estadual: ""
  });

  const queryClient = useQueryClient();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: clienteService.listarTodos
  });

  const criarClienteMutation = useMutation({
    mutationFn: clienteService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success("Cliente criado com sucesso!");
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao criar cliente:", error);
      toast.error("Erro ao criar cliente");
    },
  });

  const resetForm = () => {
    setNovoCliente({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      cnpj: "",
      endereco_rua: "",
      endereco_numero: "",
      endereco_bairro: "",
      endereco_cidade: "",
      endereco_estado: "",
      endereco_cep: "",
      inscricao_estadual: ""
    });
    setClienteEditando(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliente.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    criarClienteMutation.mutate(novoCliente);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.empresa && cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {clienteEditando ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={novoCliente.nome}
                    onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={novoCliente.empresa}
                    onChange={(e) => setNovoCliente({...novoCliente, empresa: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ/CPF</Label>
                  <Input
                    id="cnpj"
                    value={novoCliente.cnpj}
                    onChange={(e) => setNovoCliente({...novoCliente, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                  <Input
                    id="inscricao_estadual"
                    value={novoCliente.inscricao_estadual}
                    onChange={(e) => setNovoCliente({...novoCliente, inscricao_estadual: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Endereço</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Input
                      placeholder="Rua"
                      value={novoCliente.endereco_rua}
                      onChange={(e) => setNovoCliente({...novoCliente, endereco_rua: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Número"
                      value={novoCliente.endereco_numero}
                      onChange={(e) => setNovoCliente({...novoCliente, endereco_numero: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Bairro"
                      value={novoCliente.endereco_bairro}
                      onChange={(e) => setNovoCliente({...novoCliente, endereco_bairro: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Cidade"
                      value={novoCliente.endereco_cidade}
                      onChange={(e) => setNovoCliente({...novoCliente, endereco_cidade: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Estado"
                      value={novoCliente.endereco_estado}
                      onChange={(e) => setNovoCliente({...novoCliente, endereco_estado: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Input
                    placeholder="CEP"
                    value={novoCliente.endereco_cep}
                    onChange={(e) => setNovoCliente({...novoCliente, endereco_cep: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarClienteMutation.isPending}>
                  {criarClienteMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando clientes...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{cliente.empresa || "-"}</TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
