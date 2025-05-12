
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ObrasResumoCard } from "@/components/obras/ObrasResumoCard";
import { ObrasFilterBar } from "@/components/obras/ObrasFilterBar";
import { ObrasList } from "@/components/obras/ObrasList";
import { ObrasDialog } from "@/components/obras/ObrasDialog";
import { Obra, obraStatusMap } from "@/types/obra";

const Obras = () => {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [mockObras, setMockObras] = useState<Obra[]>([
    {
      id: 1,
      nome: "Edifício Residencial Parque das Flores",
      endereco: "Av. Principal, 1500, Centro",
      cliente: "Construtora Prima",
      status: "em_andamento",
      dataInicio: "2025-01-10",
      dataPrevisao: "2025-07-20",
    },
    {
      id: 2,
      nome: "Complexo Comercial Downtown",
      endereco: "Rua das Palmeiras, 500, Jardim",
      cliente: "Incorporadora Visão",
      status: "planejamento",
      dataInicio: "2025-04-15",
      dataPrevisao: "2025-12-30",
    },
    {
      id: 3,
      nome: "Resort Villa Mar",
      endereco: "Estrada da Praia, km 5",
      cliente: "Grupo Hoteleiro Solar",
      status: "concluido",
      dataInicio: "2024-06-10",
      dataPrevisao: "2025-02-28",
      dataConclusao: "2025-02-20",
    },
  ]);

  const filteredObras = mockObras.filter(obra => {
    if (filter !== "todos" && obra.status !== filter) return false;
    if (search && !obra.nome.toLowerCase().includes(search.toLowerCase()) && 
        !obra.cliente.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleSaveObra = (values: any) => {
    const newObra: Obra = {
      id: mockObras.length + 1,
      nome: values.nome,
      cliente: values.cliente,
      endereco: values.endereco,
      status: values.status,
      dataInicio: values.dataInicio.toISOString().split('T')[0],
      dataPrevisao: values.dataPrevisao.toISOString().split('T')[0],
    };
    
    setMockObras([...mockObras, newObra]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Obras</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Obra
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <ObrasResumoCard mockObras={mockObras} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Lista de Obras</CardTitle>
            <ObrasFilterBar 
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ObrasList 
            obras={filteredObras} 
            statusMap={obraStatusMap}
            formatarData={formatarData}
          />
        </CardContent>
      </Card>

      <ObrasDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveObra}
      />
    </div>
  );
};

export default Obras;
