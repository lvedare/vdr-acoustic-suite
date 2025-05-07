
import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Settings, FileText, User2, Building2, Package, ClipboardList, Wallet, BarChart3, ListChecks } from "lucide-react";

const moduleIcons: { [key: string]: React.ElementType } = {
  "/producao": Hammer,
  "/projetos": ClipboardList,
  "/estoque": Package,
  "/obras": Building2,
  "/orcamentos": FileText,
  "/clientes": User2,
  "/financeiro": Wallet,
  "/relatorios": BarChart3,
  "/cadastros": ListChecks,
  "/configuracoes": Settings,
};

const moduleDescriptions: { [key: string]: string } = {
  "/producao": "Gerencie ordens de produção, cronograma, alocação de recursos e acompanhamento de status.",
  "/projetos": "Armazene e organize desenhos técnicos, documentos e observações da engenharia por projeto.",
  "/estoque": "Controle de insumos e produtos acabados, entradas e saídas, integração com produção e compras.",
  "/obras": "Gerenciamento de cronograma de execução, checklists de instalação e registro de visitas.",
  "/orcamentos": "Criação e gerenciamento de orçamentos, propostas, histórico de propostas por cliente.",
  "/clientes": "Cadastro e gerenciamento de informações de clientes, preferências técnicas e observações.",
  "/financeiro": "Controle de contas a pagar e receber, relatórios financeiros e fluxo de caixa.",
  "/relatorios": "Relatórios de vendas, produção, financeiro, obras e desempenho por cliente.",
  "/cadastros": "Gerencie cadastros de produtos, fornecedores, colaboradores e outros dados mestre do sistema.",
  "/configuracoes": "Configure as preferências do sistema, permissões de usuários e integração com outros sistemas.",
};

const PlaceholderPage = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Get the module name from path
  const moduleName = path.substring(1);
  const formattedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  
  const Icon = moduleIcons[path] || Settings;
  const description = moduleDescriptions[path] || "Módulo em desenvolvimento.";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{formattedName}</h1>
      
      <Card className="border-2 border-dashed border-muted">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Módulo em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground">
            {description}
          </p>
          <p className="mt-4 text-muted-foreground">
            Este módulo está atualmente em desenvolvimento e será implementado em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
