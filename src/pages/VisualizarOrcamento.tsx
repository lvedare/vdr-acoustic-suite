
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Printer, FileText } from "lucide-react";
import { toast } from "sonner";
import { generateProposalPDF } from "../services/pdfService";
import { Proposta } from "@/types/orcamento";

const VisualizarOrcamento = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProposta = async () => {
      try {
        setLoading(true);
        // Carregar as propostas do localStorage
        const propostasString = localStorage.getItem("propostas");
        const propostas: Proposta[] = propostasString ? JSON.parse(propostasString) : [];
        
        // Encontrar a proposta pelo ID
        const propostaEncontrada = propostas.find(p => p.id === Number(id));
        
        if (propostaEncontrada) {
          setProposta(propostaEncontrada);
        } else {
          toast.error("Proposta não encontrada");
          navigate("/orcamentos");
        }
      } catch (error) {
        console.error("Erro ao carregar proposta:", error);
        toast.error("Erro ao carregar dados da proposta");
      } finally {
        setLoading(false);
      }
    };

    carregarProposta();
  }, [id, navigate]);

  // Formatar valores para moeda brasileira
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  // Formatação de data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Gerar PDF da proposta
  const handleGerarPDF = () => {
    if (proposta) {
      generateProposalPDF(proposta);
      toast.success("PDF gerado com sucesso!");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando detalhes da proposta...</div>;
  }

  if (!proposta) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-destructive">Proposta não encontrada</h2>
            <p className="mt-2">A proposta solicitada não existe ou foi removida.</p>
            <Button className="mt-4" onClick={() => navigate("/orcamentos")}>
              Voltar para Lista de Propostas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/orcamentos")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Proposta</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGerarPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Cabeçalho da Proposta */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Número</h3>
              <p>{proposta.numero}</p>
            </div>
            <div>
              <h3 className="font-semibold">Data</h3>
              <p>{formatarData(proposta.data)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className="capitalize">{proposta.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Validade</h3>
              <p>{proposta.validade}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Nome</h3>
              <p>{proposta.cliente.nome}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{proposta.cliente.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Telefone</h3>
              <p>{proposta.cliente.telefone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Empresa</h3>
              <p>{proposta.cliente.empresa || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold">CNPJ/CPF</h3>
              <p>{proposta.cliente.cnpj || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens da Proposta */}
      <Card>
        <CardHeader>
          <CardTitle>Itens da Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Un.</TableHead>
                  <TableHead>Qtd.</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposta.itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell className="max-w-xs">{item.descricao}</TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{formatCurrency(item.valorUnitario)}</TableCell>
                    <TableCell>{formatCurrency(item.valorTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <div className="text-xl font-medium">
              Total: {formatCurrency(proposta.valorTotal)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condições Comerciais */}
      <Card>
        <CardHeader>
          <CardTitle>Condições Comerciais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Forma de Pagamento</h3>
              <p>{proposta.formaPagamento}</p>
            </div>
            <div>
              <h3 className="font-semibold">Prazo de Entrega</h3>
              <p>{proposta.prazoEntrega}</p>
            </div>
            <div>
              <h3 className="font-semibold">Prazo de Execução</h3>
              <p>{proposta.prazoObra}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Observações</h3>
            <p className="whitespace-pre-line mt-2">{proposta.observacoes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizarOrcamento;
