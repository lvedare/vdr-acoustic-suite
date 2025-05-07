
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type AccessRequestStatus = "pending" | "approved" | "rejected";

interface AccessRequest {
  id: number;
  fullName: string;
  email: string;
  role: string;
  justification?: string;
  status: AccessRequestStatus;
  createdAt: string;
}

const AccessRequests = () => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<AccessRequest | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Em uma aplicação real, buscaríamos os dados do backend
    const storedRequests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    setAccessRequests(storedRequests);
  }, []);

  const handleApprove = (request: AccessRequest) => {
    setCurrentRequest(request);
    setPasswordDialogOpen(true);
  };

  const handleReject = (requestId: number) => {
    // Atualizar status da solicitação para rejeitado
    const updatedRequests = accessRequests.map((req) =>
      req.id === requestId ? { ...req, status: "rejected" as AccessRequestStatus } : req
    );
    
    setAccessRequests(updatedRequests);
    localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
    toast.success("Solicitação rejeitada com sucesso");
  };

  const confirmApproval = () => {
    if (!currentRequest) return;
    
    // Em uma aplicação real, enviaríamos uma solicitação para o backend
    // para criar o usuário com a senha gerada
    
    // Atualizar a lista de solicitações
    const updatedRequests = accessRequests.map((req) =>
      req.id === currentRequest.id ? { ...req, status: "approved" as AccessRequestStatus } : req
    );
    
    // Simular criação de usuário
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      id: Date.now(),
      name: currentRequest.fullName,
      email: currentRequest.email,
      password: password, // Em produção, isso seria feito no backend com hash
      role: currentRequest.role,
      active: true,
    });
    
    localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
    localStorage.setItem("users", JSON.stringify(users));
    
    setAccessRequests(updatedRequests);
    setPasswordDialogOpen(false);
    setPassword("");
    setCurrentRequest(null);
    
    toast.success(`Acesso aprovado para ${currentRequest.fullName}`);
  };

  // Função para mapear o status para um componente Badge com cores apropriadas
  const getStatusBadge = (status: AccessRequestStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  // Função para formatar o cargo
  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      comercial: "Comercial",
      producao: "Produção",
      engenharia: "Engenharia",
      instalacao: "Instalação",
      financeiro: "Financeiro",
      administrador: "Administrador",
    };
    
    return roleMap[role] || role;
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Acesso</CardTitle>
          <CardDescription>
            Gerencie as solicitações de novos usuários para o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accessRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Não há solicitações de acesso pendentes.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.fullName}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{formatRole(request.role)}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleApprove(request)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                            onClick={() => handleReject(request.id)}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Dialog para definir senha do novo usuário */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Definir Senha para o Usuário</DialogTitle>
                <DialogDescription>
                  {currentRequest && (
                    <>
                      Defina uma senha para {currentRequest.fullName} ({currentRequest.email}).
                      Em um ambiente real, você poderia optar por enviar um e-mail para o usuário
                      criar sua própria senha.
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-4"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmApproval} disabled={!password}>
                  Confirmar Aprovação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRequests;
