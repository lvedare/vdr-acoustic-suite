
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  Hammer,
  HomeIcon,
  ListChecks,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  User2,
  Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  children,
  to,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn("vdr-sidebar-item", isActive && "active")}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
};

export function AppSidebar() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  // Don't show sidebar on login page
  if (isLoginPage) return null;

  return (
    <Sidebar
      className="border-r bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-vdr-red p-1">
            <span className="text-lg font-bold text-white">VDR</span>
          </div>
          <span className="text-lg font-semibold text-white">System</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <div className="space-y-1">
          <SidebarItem to="/" icon={HomeIcon}>
            Início
          </SidebarItem>
          <SidebarItem to="/atendimento" icon={MessageSquare}>
            CRM / Atendimento
          </SidebarItem>
          <SidebarItem to="/orcamentos" icon={FileText}>
            Orçamentos
          </SidebarItem>
          <SidebarItem to="/clientes" icon={User2}>
            Clientes
          </SidebarItem>
        </div>

        <Separator className="my-4 bg-sidebar-border" />
        
        <div className="space-y-1">
          <SidebarItem to="/producao" icon={Hammer}>
            Produção
          </SidebarItem>
          <SidebarItem to="/projetos" icon={ClipboardList}>
            Projetos
          </SidebarItem>
          <SidebarItem to="/estoque" icon={Package}>
            Estoque
          </SidebarItem>
          <SidebarItem to="/obras" icon={Building2}>
            Obras
          </SidebarItem>
        </div>

        <Separator className="my-4 bg-sidebar-border" />
        
        <div className="space-y-1">
          <SidebarItem to="/financeiro" icon={Wallet}>
            Financeiro
          </SidebarItem>
          <SidebarItem to="/relatorios" icon={BarChart3}>
            Relatórios
          </SidebarItem>
          <SidebarItem to="/cadastros" icon={ListChecks}>
            Cadastros
          </SidebarItem>
          <SidebarItem to="/configuracoes" icon={Settings}>
            Configurações
          </SidebarItem>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-4 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-vdr-blue text-white">
              VD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-sidebar-foreground/80">Logado como</span>
            <span className="text-sm font-medium">Admin</span>
          </div>
          <Link to="/logout" className="ml-auto text-sidebar-foreground/80 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
