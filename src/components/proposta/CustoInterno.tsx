
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, ArrowDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { CustoProposta, NovoCustoInput, Proposta, formatCurrency, ItemProposta } from "@/types/orcamento";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustoInternoProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
}

const CustoInterno = ({ proposta, setProposta }: CustoInternoProps) => {
  const [novoCusto, setNovoCusto] = useState<NovoCustoInput>({
    descricao: "",
    valor: 0
  });
  
  const [custosDiluidos, setCustosDiluidos] = useState(false);
  const [metodoDiluicao, setMetodoDiluicao] = useState<'proporcional' | 'igual'>('proporcional');

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
          ...novoCusto,
          diluido: false
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

  // Calcular total de custos (apenas os não diluídos)
  const totalCustos = proposta.custos
    .filter(custo => !custo.diluido)
    .reduce((sum, item) => sum + item.valor, 0);
  
  // Efeito para diluir os custos nos itens da proposta quando a opção estiver ativada
  useEffect(() => {
    if (custosDiluidos) {
      diluirCustosNosItens();
    } else {
      // Restaurar valores originais dos itens se a diluição for desativada
      restaurarValoresOriginais();
    }
  }, [custosDiluidos, metodoDiluicao, proposta.custos]);
  
  // Função para diluir os custos internos entre os itens da proposta
  const diluirCustosNosItens = () => {
    if (proposta.itens.length === 0) return;
    
    // Copiar os itens para não modificar diretamente
    const itensAtualizados = [...proposta.itens];
    
    // Pegar apenas os custos que ainda não foram diluídos
    const custosParaDiluir = proposta.custos.filter(custo => !custo.diluido);
    const valorTotalCustosParaDiluir = custosParaDiluir.reduce((sum, custo) => sum + custo.valor, 0);
    
    if (valorTotalCustosParaDiluir === 0) return;
    
    // Marcar os custos como diluídos
    const custosAtualizados = proposta.custos.map(custo => 
      !custo.diluido ? { ...custo, diluido: true } : custo
    );
    
    if (metodoDiluicao === 'proporcional') {
      // Diluição proporcional ao valor de cada item
      const valorTotalItens = itensAtualizados.reduce((sum, item) => sum + item.valorTotal, 0);
      
      // Se não há valor, não há como distribuir proporcionalmente
      if (valorTotalItens === 0) return;
      
      itensAtualizados.forEach(item => {
        const proporcao = item.valorTotal / valorTotalItens;
        const custoProporcional = valorTotalCustosParaDiluir * proporcao;
        
        // Armazenar o valor original em um atributo se ainda não estiver armazenado
        if (!item.hasOwnProperty('valorOriginal')) {
          Object.defineProperty(item, 'valorOriginal', {
            value: item.valorUnitario,
            writable: true,
            enumerable: false
          });
        }
        
        // Calcular o acréscimo no valor unitário
        const acrescimoPorUnidade = custoProporcional / item.quantidade;
        
        // Atualizar o valor unitário
        item.valorUnitario = Number((item.valorOriginal as number) + acrescimoPorUnidade);
        item.valorTotal = item.valorUnitario * item.quantidade;
      });
    } else {
      // Diluição igual entre todos os itens
      const custoPorItem = valorTotalCustosParaDiluir / itensAtualizados.length;
      
      itensAtualizados.forEach(item => {
        // Armazenar o valor original em um atributo se ainda não estiver armazenado
        if (!item.hasOwnProperty('valorOriginal')) {
          Object.defineProperty(item, 'valorOriginal', {
            value: item.valorUnitario,
            writable: true,
            enumerable: false
          });
        }
        
        // Calcular o acréscimo no valor unitário
        const acrescimoPorUnidade = custoPorItem / item.quantidade;
        
        // Atualizar o valor unitário
        item.valorUnitario = Number((item.valorOriginal as number) + acrescimoPorUnidade);
        item.valorTotal = item.valorUnitario * item.quantidade;
      });
    }
    
    // Atualizar o valor total da proposta
    const novoValorTotal = itensAtualizados.reduce((sum, item) => sum + item.valorTotal, 0);
    
    // Atualizar a proposta com os novos valores
    setProposta(prev => ({
      ...prev,
      itens: itensAtualizados,
      custos: custosAtualizados,
      valorTotal: novoValorTotal
    }));
    
    toast.success(`Custos diluídos entre os itens usando método ${metodoDiluicao === 'proporcional' ? 'proporcional' : 'igual'}`);
  };
  
  // Função para restaurar os valores originais dos itens
  const restaurarValoresOriginais = () => {
    const itensRestaurados = proposta.itens.map(item => {
      const valorOriginal = item.hasOwnProperty('valorOriginal') ? item.valorOriginal as number : item.valorUnitario;
      
      return {
        ...item,
        valorUnitario: valorOriginal,
        valorTotal: valorOriginal * item.quantidade
      };
    });
    
    // Desmarcar todos os custos como não diluídos
    const custosRestaurados = proposta.custos.map(custo => ({
      ...custo,
      diluido: false
    }));
    
    // Atualizar o valor total da proposta
    const novoValorTotal = itensRestaurados.reduce((sum, item) => sum + item.valorTotal, 0);
    
    // Atualizar a proposta com os valores restaurados
    setProposta(prev => ({
      ...prev,
      itens: itensRestaurados,
      custos: custosRestaurados,
      valorTotal: novoValorTotal
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Custos Internos</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground mr-4">
            Diluir custos nos itens da proposta
          </div>
          <Switch
            checked={custosDiluidos}
            onCheckedChange={setCustosDiluidos}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {custosDiluidos && (
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="text-sm text-blue-700">
              Os custos internos serão diluídos entre os itens da proposta
            </div>
            <Select
              value={metodoDiluicao}
              onValueChange={(value) => setMetodoDiluicao(value as 'proporcional' | 'igual')}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Método de diluição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proporcional">Proporcional</SelectItem>
                <SelectItem value="igual">Igualmente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
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
        
        {custosDiluidos && totalCustos > 0 && (
          <div className="flex items-center justify-center p-3 bg-green-50 rounded-md border border-green-200">
            <ArrowDown className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700">
              Custos diluídos no valor dos itens da proposta
            </span>
          </div>
        )}
        
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
