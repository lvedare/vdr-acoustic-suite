
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "lucide-react";
import PropostasTab from './tabs/PropostasTab';
import ClientesTab from './tabs/ClientesTab';
import InsumosTab from './tabs/InsumosTab';
import ProdutosTab from './tabs/ProdutosTab';
import ProjetosTab from './tabs/ProjetosTab';
import ObrasTab from './tabs/ObrasTab';

const SupabaseTestPanel = () => {
  const [activeTest, setActiveTest] = useState('propostas');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Painel de Teste - Integração Supabase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTest} onValueChange={setActiveTest}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="propostas">Propostas</TabsTrigger>
              <TabsTrigger value="clientes">Clientes</TabsTrigger>
              <TabsTrigger value="insumos">Insumos</TabsTrigger>
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="projetos">Projetos</TabsTrigger>
              <TabsTrigger value="obras">Obras</TabsTrigger>
            </TabsList>

            <TabsContent value="propostas">
              <PropostasTab />
            </TabsContent>

            <TabsContent value="clientes">
              <ClientesTab />
            </TabsContent>

            <TabsContent value="insumos">
              <InsumosTab />
            </TabsContent>

            <TabsContent value="produtos">
              <ProdutosTab />
            </TabsContent>

            <TabsContent value="projetos">
              <ProjetosTab />
            </TabsContent>

            <TabsContent value="obras">
              <ObrasTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTestPanel;
