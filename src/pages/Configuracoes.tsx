
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Bell, Shield, Globe, Database } from "lucide-react";

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="integracao">Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá configurar as preferências gerais do sistema.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Configure os usuários e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá gerenciar usuários e suas permissões.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure as notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá configurar as notificações do sistema.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá configurar opções de segurança e privacidade.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integracao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Integrações
              </CardTitle>
              <CardDescription>
                Integração com outros sistemas e APIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá configurar integrações com outros sistemas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
