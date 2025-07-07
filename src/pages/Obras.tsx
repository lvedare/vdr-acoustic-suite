
import React, { useState, useEffect } from "react";
import { ObrasResumoCard } from "@/components/obras/ObrasResumoCard";
import { ObrasFilterBar } from "@/components/obras/ObrasFilterBar";
import ObrasList from "@/components/obras/ObrasList";
import { ObrasDialog } from "@/components/obras/ObrasDialog";
import { ObraCaixaCard } from "@/components/obras/ObraCaixaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useObras } from "@/hooks/useObras";

const Obras = () => {
  const { obras } = useObras();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedObra, setSelectedObra] = useState<any | null>(null);
  const [obraDetalhada, setObraDetalhada] = useState<any | null>(null);
  
  // Contador para status
  const statusCount = {
    total: obras.length,
    planejamento: obras.filter(obra => obra.status === "planejamento").length,
    em_andamento: obras.filter(obra => obra.status === "em_andamento").length,
    concluido: obras.filter(obra => obra.status === "concluido").length,
    cancelado: obras.filter(obra => obra.status === "cancelado").length
  };

  // Função para adicionar nova obra
  const handleAddObra = () => {
    setSelectedObra(null);
    setIsDialogOpen(true);
  };

  // Função para ver detalhes da obra
  const handleViewObra = (obra: any) => {
    setObraDetalhada(obra);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Obras</h1>
        <Button onClick={handleAddObra}>
          <Plus className="mr-1 h-4 w-4" /> Nova Obra
        </Button>
      </div>

      {/* Cards de Resumo */}
      <ObrasResumoCard statusCount={statusCount} />

      {/* Filtros */}
      <ObrasFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
      />

      {!obraDetalhada ? (
        /* Lista de Obras - agora sem props */
        <ObrasList />
      ) : (
        /* Detalhes da Obra */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setObraDetalhada(null)}>
              Voltar para lista
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <div className="flex items-center mb-6 space-x-4">
                <Building className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">{obraDetalhada.nome}</h2>
                  <p className="text-muted-foreground">{obraDetalhada.endereco}</p>
                </div>
              </div>
              
              <Tabs defaultValue="informacoes">
                <TabsList className="grid grid-cols-3 w-[400px]">
                  <TabsTrigger value="informacoes">Informações</TabsTrigger>
                  <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
                  <TabsTrigger value="caixa">Caixa</TabsTrigger>
                </TabsList>
                
                <TabsContent value="informacoes" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium">{obraDetalhada.cliente?.nome || 'Sem cliente'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${obraDetalhada.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' : 
                          obraDetalhada.status === 'planejamento' ? 'bg-amber-100 text-amber-800' :
                          obraDetalhada.status === 'concluido' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {obraDetalhada.status.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Data de Início</p>
                      <p className="font-medium">{obraDetalhada.data_inicio ? new Date(obraDetalhada.data_inicio).toLocaleDateString('pt-BR') : 'Não definida'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Previsão de Término</p>
                      <p className="font-medium">{obraDetalhada.data_previsao ? new Date(obraDetalhada.data_previsao).toLocaleDateString('pt-BR') : 'Não definida'}</p>
                    </div>
                    {obraDetalhada.data_conclusao && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Data de Conclusão</p>
                        <p className="font-medium">{new Date(obraDetalhada.data_conclusao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" onClick={() => setSelectedObra(obraDetalhada)}>
                      Editar Obra
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="cronograma" className="space-y-4 mt-4">
                  <div className="p-6 text-center border rounded-lg bg-slate-50">
                    <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Cronograma</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Funcionalidade de cronograma será implementada em breve.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="caixa" className="space-y-4 mt-4">
                  <ObraCaixaCard obraId={obraDetalhada.id} nomeObra={obraDetalhada.nome} />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="md:col-span-4">
              {/* Cards de status da obra específica */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Status da Obra</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Progresso Geral</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Orçamento</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Responsáveis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gerente</span>
                      <span className="text-sm">Carlos Pereira</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Arquiteto</span>
                      <span className="text-sm">Ana Oliveira</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engenheiro</span>
                      <span className="text-sm">Marcos Santos</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Próximas Atividades</h3>
                  <div className="space-y-3">
                    <div className="border-l-2 border-blue-500 pl-3">
                      <div className="text-sm font-medium">Instalação de Janelas</div>
                      <div className="text-xs text-muted-foreground">22/05/2025</div>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-3">
                      <div className="text-sm font-medium">Pintura Interna</div>
                      <div className="text-xs text-muted-foreground">25/05/2025</div>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-3">
                      <div className="text-sm font-medium">Instalação Elétrica</div>
                      <div className="text-xs text-muted-foreground">30/05/2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para Adicionar/Editar Obra */}
      <ObrasDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        obra={selectedObra}
      />
    </div>
  );
};

export default Obras;
