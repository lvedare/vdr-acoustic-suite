
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjetosResumoCard } from "@/components/projetos/ProjetosResumoCard";
import { ProjetosFilterBar } from "@/components/projetos/ProjetosFilterBar";
import { ProjetosList } from "@/components/projetos/ProjetosList";
import { Projeto, projetoStatusMap } from "@/types/projeto";

const Projetos = () => {
  const [filter, setFilter] = React.useState("todos");
  const [search, setSearch] = React.useState("");

  const mockProjetos: Projeto[] = [
    {
      id: 1,
      nome: "Projeto Residencial Vila Nova",
      cliente: "João Silva",
      status: "em_andamento",
      tipo: "residencial",
      dataInicio: "2025-02-15",
      dataPrevisao: "2025-05-20",
    },
    {
      id: 2,
      nome: "Edifício Comercial Centro",
      cliente: "Construtora ABC",
      status: "concluido",
      tipo: "comercial",
      dataInicio: "2024-10-05",
      dataPrevisao: "2025-03-10",
      dataConclusao: "2025-03-08",
    },
    {
      id: 3,
      nome: "Reforma Apartamento 302",
      cliente: "Maria Oliveira",
      status: "planejamento",
      tipo: "reforma",
      dataInicio: "2025-06-01",
      dataPrevisao: "2025-07-30",
    },
  ];

  const filteredProjetos = mockProjetos.filter(projeto => {
    if (filter !== "todos" && projeto.status !== filter) return false;
    if (search && !projeto.nome.toLowerCase().includes(search.toLowerCase()) && 
        !projeto.cliente.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <ProjetosResumoCard mockProjetos={mockProjetos} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Lista de Projetos</CardTitle>
            <ProjetosFilterBar 
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ProjetosList 
            projetos={filteredProjetos} 
            statusMap={projetoStatusMap}
            formatarData={formatarData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Projetos;
