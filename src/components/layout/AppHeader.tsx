
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageTitle {
  [key: string]: string;
}

const pageTitles: PageTitle = {
  "/": "Dashboard",
  "/atendimento": "CRM / Atendimento",
  "/orcamentos": "Orçamentos",
  "/clientes": "Clientes",
  "/producao": "Produção",
  "/projetos": "Projetos",
  "/estoque": "Estoque",
  "/obras": "Obras",
  "/financeiro": "Financeiro",
  "/relatorios": "Relatórios",
  "/cadastros": "Cadastros",
  "/configuracoes": "Configurações",
  "/login": "Login",
};

export function AppHeader() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  // Don't show header on login page
  if (isLoginPage) return null;

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pageTitle = pageTitles[location.pathname] || "VDR System";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      <div className="ml-4 flex flex-1 items-center gap-4">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-vdr-red"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                <div className="font-medium">Nova proposta aprovada</div>
                <div className="text-sm text-muted-foreground">Cliente: Empresa ABC</div>
                <div className="text-xs text-muted-foreground">Há 10 minutos</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                <div className="font-medium">Ordem de produção finalizada</div>
                <div className="text-sm text-muted-foreground">OP #1234 - Painéis</div>
                <div className="text-xs text-muted-foreground">Há 30 minutos</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                <div className="font-medium">Estoque baixo</div>
                <div className="text-sm text-muted-foreground">Item: Lã de Rocha 50mm</div>
                <div className="text-xs text-muted-foreground">Há 2 horas</div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
