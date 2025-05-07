
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema de validação para o formulário de solicitação de acesso
const accessRequestSchema = z.object({
  fullName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  role: z.string().min(1, { message: "Selecione um cargo" }),
  justification: z.string().optional(),
});

type AccessRequestFormValues = z.infer<typeof accessRequestSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("administrador");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form para solicitação de acesso
  const form = useForm<AccessRequestFormValues>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "comercial",
      justification: "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call with a timeout
    setTimeout(() => {
      // In a real app, you would make an API call here
      if (email && password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", role);
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        toast.error("Por favor, preencha todos os campos");
      }
      setIsLoading(false);
    }, 1000);
  };

  const onAccessRequest = (data: AccessRequestFormValues) => {
    // Em uma aplicação real, enviaríamos esta solicitação para o backend
    console.log("Solicitação de acesso:", data);
    
    // Armazenar solicitação localmente (para simulação)
    const accessRequests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    accessRequests.push({
      ...data,
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("accessRequests", JSON.stringify(accessRequests));
    
    toast.success("Solicitação enviada com sucesso! Aguarde a aprovação.");
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-vdr-blue to-blue-900 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="rounded-md bg-vdr-red p-2">
            <span className="text-2xl font-bold text-white">VDR</span>
          </div>
          <span className="text-2xl font-semibold text-white">System</span>
        </div>
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o VDR System
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="producao">Produção</SelectItem>
                    <SelectItem value="engenharia">Engenharia</SelectItem>
                    <SelectItem value="instalacao">Instalação</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                className="w-full bg-vdr-blue hover:bg-blue-800"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Entrar"}
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                  >
                    Solicitar Acesso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Solicitar Acesso ao Sistema</DialogTitle>
                    <DialogDescription>
                      Preencha o formulário abaixo para solicitar acesso ao VDR System.
                      Sua solicitação será analisada pela equipe administrativa.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAccessRequest)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail Corporativo</FormLabel>
                            <FormControl>
                              <Input placeholder="seuemail@empresa.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo Desejado</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um cargo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="comercial">Comercial</SelectItem>
                                <SelectItem value="producao">Produção</SelectItem>
                                <SelectItem value="engenharia">Engenharia</SelectItem>
                                <SelectItem value="instalacao">Instalação</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="justification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Justificativa ou Observações (opcional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva brevemente por que você precisa de acesso..." 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Enviar Solicitação</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
