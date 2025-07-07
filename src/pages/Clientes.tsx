
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { SafeDeleteDialog } from "@/components/common/SafeDeleteDialog";
import { supabase } from "@/integrations/supabase/client";

const Clientes = () => {
  const { clientes, isLoading, error, excluirCliente } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.empresa && cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatarEndereco = (cliente: any) => {
    const enderecoPartes = [
      cliente.endereco_rua,
      cliente.endereco_numero,
      cliente.endereco_bairro,
      cliente.endereco_cidade,
      cliente.endereco_estado
    ].filter(Boolean);
    
    return enderecoPartes.length > 0 ? enderecoPartes.join(', ') : 'Endereço não informado';
  };

  const handlePreExcluirCliente = (cliente: any) => {
    setClienteSelecionado(cliente);
    setIsDeleteDialogOpen(true);
  };

  const handleExcluirCliente = async () => {
    if (!clienteSelecionado) return;

    setIsDeleting(true);
    try {
      await excluirCliente(clienteSelecionado.id);
      setIsDeleteDialogOpen(false);
      setClienteSelecionado(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const checkClienteRelations = async () => {
    if (!clienteSelecionado) return [];

    try {
      const relations = [];

      // Verificar atendimentos
      const { data: atendimentos } = await supabase
        .from('atendimentos')
        .select('id, assunto')
        .eq('cliente_id', clienteSelecionado.id);

      if (atendimentos && atendimentos.length > 0) {
        relations.push({
          type: 'Atendimentos',
          count: atendimentos.length,
          items: atendimentos.map(a => a.assunto).slice(0, 3)
        });
      }

      // Verificar propostas
      const { data: propostas } = await supabase
        .from('propostas')
        .select('id, numero')
        .eq('cliente_id', clienteSelecionado.id);

      if (propostas && propostas.length > 0) {
        relations.push({
          type: 'Propostas/Orçamentos',
          count: propostas.length,
          items: propostas.map(p => p.numero).slice(0, 3)
        });
      }

      // Verificar obras
      const { data: obras } = await supabase
        .from('obras')
        .select('id, nome')
        .eq('cliente_id', clienteSelecionado.id);

      if (obras && obras.length > 0) {
        relations.push({
          type: 'Obras',
          count: obras.length,
          items: obras.map(o => o.nome).slice(0, 3)
        });
      }

      // Verificar projetos
      const { data: projetos } = await supabase
        .from('projetos')
        .select('id, nome')
        .eq('cliente_id', clienteSelecionado.id);

      if (projetos && projetos.length > 0) {
        relations.push({
          type: 'Projetos',
          count: projetos.length,
          items: projetos.map(p => p.nome).slice(0, 3)
        });
      }

      return relations;
    } catch (error) {
      console.error('Erro ao verificar relacionamentos:', error);
      return [];
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar clientes</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar clientes por nome, empresa ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando clientes...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{cliente.empresa || '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {cliente.email && (
                              <div className="text-sm">{cliente.email}</div>
                            )}
                            {cliente.telefone && (
                              <div className="text-sm text-gray-600">{cliente.telefone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs truncate" title={formatarEndereco(cliente)}>
                            {formatarEndereco(cliente)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handlePreExcluirCliente(cliente)}
                            >
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

      <SafeDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleExcluirCliente}
        title="Excluir Cliente"
        itemName={clienteSelecionado?.nome || ''}
        isLoading={isDeleting}
        onCheckRelations={checkClienteRelations}
      />
    </div>
  );
};

export default Clientes;
