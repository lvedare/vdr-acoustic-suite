
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { CustoProposta, NovoCustoInput, Proposta, formatCurrency } from "@/types/orcamento";

interface CustoInternoProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
}

const CustoInterno = ({ proposta, setProposta }: CustoInternoProps) => {
  const [novoCusto, setNovoCusto] = useState<NovoCustoInput>({
    descricao: "",
    valor: 0
  });

  // Handler para adicionar um novo custo
  const handleAdicionarCusto = () => {
    if (!novoCusto.descricao || novoCusto.valor <= 0) {
      toast.error("Preencha todos os campos do custo corretamente");
      return;
    }
    
    setProposta(prev => ({
      ...prev,
      custos: [
        ...prev.custos,
        {
          id: Date.now(),
          ...novoCusto
        }
      ]
    }));
    
    setNovoCusto({
      descricao: "",
      valor: 0
    });
    
    toast.success("Custo adicionado com sucesso!");
  };

  // Handler para remover um custo
  const handleRemoverCusto = (id: number) => {
    setProposta(prev => ({
      ...prev,
      custos: prev.custos.filter(custo => custo.id !== id)
    }));
    
    toast.success("Custo removido com sucesso!");
  };

  // Calcular total de custos
  const totalCustos = proposta.custos.reduce((sum, item) => sum + item.valor, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Custos Internos (Não aparecem na proposta)</CardTitle>
        <div className="text-sm text-muted-foreground">
          Estes custos são apenas para controle interno e não serão exibidos no PDF da proposta.
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-8">
            <Label htmlFor="custodescricao">Descrição do Custo</Label>
            <Input 
              id="custodescricao" 
              value={novoCusto.descricao}
              onChange={(e) => setNovoCusto(prev => ({ ...prev, descricao: e.target.value }))}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="custovalor">Valor (R$)</Label>
            <Input 
              id="custovalor" 
              type="number"
              step="0.01"
              min="0"
              value={novoCusto.valor.toString()}
              onChange={(e) => setNovoCusto(prev => ({ ...prev, valor: Number(e.target.value) }))}
            />
          </div>
          
          <div className="col-span-2">
            <Button className="w-full" onClick={handleAdicionarCusto}>
              <Plus className="mr-1 h-4 w-4" /> Adicionar Custo
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposta.custos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    Nenhum custo adicionado
                  </TableCell>
                </TableRow>
              ) : (
                proposta.custos.map((custo) => (
                  <TableRow key={custo.id}>
                    <TableCell>{custo.descricao}</TableCell>
                    <TableCell>{formatCurrency(custo.valor)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoverCusto(custo.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end space-x-4">
          <div className="text-lg font-medium">
            Total de Custos: {formatCurrency(totalCustos)}
          </div>
        </div>
        
        <div>
          <div className="bg-yellow-100 p-3 rounded-md text-sm border border-yellow-300">
            <p className="font-medium text-yellow-800">
              Análise da Lucratividade
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Valor Venda:</span> {formatCurrency(proposta.valorTotal)}
              </div>
              <div>
                <span className="font-medium">Total Custos:</span> {formatCurrency(totalCustos)}
              </div>
              <div>
                <span className="font-medium">Lucro Bruto:</span> {formatCurrency(proposta.valorTotal - totalCustos)}
              </div>
              <div>
                <span className="font-medium">Margem (%):</span> {
                  proposta.valorTotal === 0 ? '0%' :
                  `${((proposta.valorTotal - totalCustos) / proposta.valorTotal * 100).toFixed(2)}%`
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustoInterno;
