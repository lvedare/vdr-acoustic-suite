
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building, Truck, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Dialog simples de confirmação de exclusão (reutilizável)
const ConfirmDeleteDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Excluir item",
  description = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Cadastros = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cadastros</h1>
      
      <Tabs defaultValue="colaboradores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="transportadoras">Transportadoras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colaboradores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Cadastro de Colaboradores
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar colaboradores.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unidades">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Cadastro de Unidades
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de unidades e filiais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar unidades e filiais.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transportadoras">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Cadastro de Transportadoras
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de transportadoras
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção será implementada em breve. Aqui você poderá cadastrar e gerenciar transportadoras.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cadastros;
