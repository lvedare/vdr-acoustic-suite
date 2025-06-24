
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package } from 'lucide-react';
import { usePropostas } from '@/hooks/usePropostas';
import { useOrdensProducao, useProdutosAcabados } from '@/hooks/useSupabaseModules';
import { toast } from 'sonner';

export const OrdemProducaoFromProposta = () => {
  const [selectedPropostaId, setSelectedPropostaId] = useState<string>("");
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>("");
  
  const { propostasAprovadas, converterParaOrdemProducao } = usePropostas();
  const { criarOrdem, isCriando } = useOrdensProducao();
  const { produtos } = useProdutosAcabados();

  const handleCriarOrdemProducao = () => {
    if (!selectedPropostaId) {
      toast.error('Selecione uma proposta aprovada');
      return;
    }

    const proposta = propostasAprovadas.find(p => p.id.toString() === selectedPropostaId);
    if (!proposta) {
      toast.error('Proposta não encontrada');
      return;
    }

    const ordensProducao = converterParaOrdemProducao(proposta);
    
    if (ordensProducao.length === 0) {
      toast.error('Nenhuma ordem de produção pode ser gerada desta proposta');
      return;
    }

    // Se um produto específico foi selecionado, criar apenas uma ordem para ele
    if (selectedProdutoId) {
      const produto = produtos.find(p => p.id === selectedProdutoId);
      if (produto) {
        const ordemEspecifica = {
          ...ordensProducao[0],
          produto_id: selectedProdutoId,
          numero: `OP-${proposta.numero}-${produto.codigo}`,
          observacoes: `OP para ${produto.nome} da proposta ${proposta.numero}`
        };
        criarOrdem(ordemEspecifica);
      }
    } else {
      // Criar uma ordem para cada item da proposta
      ordensProducao.forEach((ordem, index) => {
        setTimeout(() => {
          criarOrdem(ordem);
        }, index * 100); // Delay pequeno entre criações para evitar conflitos
      });
    }

    setSelectedPropostaId("");
    setSelectedProdutoId("");
  };

  const propostaSelecionada = propostasAprovadas.find(p => p.id.toString() === selectedPropostaId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Criar Ordem de Produção a partir de Proposta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Proposta Aprovada:</label>
          <Select value={selectedPropostaId} onValueChange={setSelectedPropostaId}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Selecione uma proposta aprovada" />
            </SelectTrigger>
            <SelectContent>
              {propostasAprovadas.map((proposta) => (
                <SelectItem key={proposta.id} value={proposta.id.toString()}>
                  {proposta.numero} - {proposta.cliente.nome} (R$ {proposta.valorTotal.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {propostaSelecionada && (
          <div>
            <label className="text-sm font-medium">Produto (opcional - deixe vazio para criar para todos os itens):</label>
            <Select value={selectedProdutoId} onValueChange={setSelectedProdutoId}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Selecione um produto específico (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os itens da proposta</SelectItem>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id}>
                    {produto.codigo} - {produto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {propostaSelecionada && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Itens da proposta:</h4>
            <ul className="text-sm space-y-1">
              {propostaSelecionada.itens.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.descricao}</span>
                  <span>Qtd: {item.quantidade}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={handleCriarOrdemProducao}
          disabled={!selectedPropostaId || isCriando}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCriando ? "Criando..." : "Criar Ordem(s) de Produção"}
        </Button>
      </CardContent>
    </Card>
  );
};
