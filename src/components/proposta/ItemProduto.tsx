
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Search, Trash } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  ItemProposta, 
  NovoItemInput, 
  ProdutoAcabado, 
  Proposta, 
  UNIDADES_OPCOES, 
  formatCurrency 
} from "@/types/orcamento";

interface ItemProdutoProps {
  proposta: Proposta;
  setProposta: React.Dispatch<React.SetStateAction<Proposta>>;
  produtosAcabados: ProdutoAcabado[];
}

const ItemProduto = ({ proposta, setProposta, produtosAcabados }: ItemProdutoProps) => {
  const [novoItem, setNovoItem] = useState<NovoItemInput>({
    codigo: "",
    descricao: "",
    unidade: "PÇ",
    quantidade: 1,
    valorUnitario: 0
  });

  const [filtroProduto, setFiltroProduto] = useState("");
  const [dialogProdutosAberto, setDialogProdutosAberto] = useState(false);

  // Handler para adicionar um novo item
  const handleAdicionarItem = () => {
    if (!novoItem.codigo || !novoItem.descricao || novoItem.quantidade <= 0 || novoItem.valorUnitario <= 0) {
      toast.error("Preencha todos os campos do item corretamente");
      return;
    }
    
    const valorTotal = novoItem.quantidade * novoItem.valorUnitario;
    
    setProposta(prev => ({
      ...prev,
      itens: [
        ...prev.itens,
        {
          id: Date.now(),
          ...novoItem,
          valorTotal
        }
      ]
    }));
    
    setNovoItem({
      codigo: "",
      descricao: "",
      unidade: "PÇ",
      quantidade: 1,
      valorUnitario: 0
    });
    
    toast.success("Item adicionado com sucesso!");
  };

  // Handler para adicionar produto da lista de produtos acabados
  const handleAdicionarProdutoAcabado = (produto: ProdutoAcabado) => {
    setNovoItem({
      codigo: produto.codigo,
      descricao: produto.nome,
      unidade: produto.unidadeMedida,
      quantidade: 1,
      valorUnitario: produto.valorBase
    });

    setDialogProdutosAberto(false);
    toast.success("Produto selecionado, ajuste a quantidade se necessário");
  };

  // Handler para remover um item
  const handleRemoverItem = (id: number) => {
    setProposta(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== id)
    }));
    
    toast.success("Item removido com sucesso!");
  };

  // Filtrar produtos para o diálogo de seleção
  const produtosFiltrados = produtosAcabados.filter(produto => {
    const termoBusca = filtroProduto.toLowerCase();
    return (
      produto.nome.toLowerCase().includes(termoBusca) ||
      produto.codigo.toLowerCase().includes(termoBusca) ||
      produto.descricao.toLowerCase().includes(termoBusca) ||
      produto.categoria.toLowerCase().includes(termoBusca)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens da Proposta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-2">
            <Label htmlFor="codigo">Código</Label>
            <Input 
              id="codigo" 
              value={novoItem.codigo}
              onChange={(e) => setNovoItem(prev => ({ ...prev, codigo: e.target.value }))}
            />
          </div>
          
          <div className="col-span-4">
            <Label htmlFor="descricao">Descrição</Label>
            <div className="flex space-x-2">
              <Input 
                id="descricao" 
                value={novoItem.descricao}
                onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                className="flex-1"
              />
              <Dialog open={dialogProdutosAberto} onOpenChange={setDialogProdutosAberto}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Package className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>Selecionar Produto Acabado</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="relative mb-4">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produto por nome, código ou categoria..."
                        className="pl-8"
                        value={filtroProduto}
                        onChange={(e) => setFiltroProduto(e.target.value)}
                      />
                    </div>
                    
                    <div className="rounded-md border max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Un.</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {produtosFiltrados.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                Nenhum produto encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            produtosFiltrados.map((produto) => (
                              <TableRow key={produto.id}>
                                <TableCell className="font-medium">{produto.codigo}</TableCell>
                                <TableCell>
                                  <div>
                                    <div>{produto.nome}</div>
                                    {produto.descricao && (
                                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                                        {produto.descricao}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{produto.categoria}</TableCell>
                                <TableCell>{produto.unidadeMedida}</TableCell>
                                <TableCell>{formatCurrency(produto.valorBase)}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAdicionarProdutoAcabado(produto)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" /> Selecionar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="col-span-1">
            <Label htmlFor="unidade">Un.</Label>
            <Select
              value={novoItem.unidade}
              onValueChange={(value) => setNovoItem(prev => ({ ...prev, unidade: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Un" />
              </SelectTrigger>
              <SelectContent>
                {UNIDADES_OPCOES.map((unidade) => (
                  <SelectItem key={unidade} value={unidade}>
                    {unidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-1">
            <Label htmlFor="quantidade">Qtd.</Label>
            <Input 
              id="quantidade" 
              type="number"
              min="1"
              value={novoItem.quantidade.toString()}
              onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="valorUnitario">Valor Unit. (R$)</Label>
            <Input 
              id="valorUnitario" 
              type="number"
              step="0.01"
              min="0"
              value={novoItem.valorUnitario.toString()}
              onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: Number(e.target.value) }))}
            />
          </div>
          
          <div className="col-span-2">
            <Button className="w-full" onClick={handleAdicionarItem}>
              <Plus className="mr-1 h-4 w-4" /> Adicionar Item
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead className="w-[300px]">Descrição</TableHead>
                <TableHead>Un.</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposta.itens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhum item adicionado
                  </TableCell>
                </TableRow>
              ) : (
                proposta.itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={item.descricao}>
                      {item.descricao}
                    </TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{formatCurrency(item.valorUnitario)}</TableCell>
                    <TableCell>{formatCurrency(item.valorTotal)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoverItem(item.id)}
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
          <div className="text-xl font-medium">
            Total: {formatCurrency(proposta.valorTotal)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemProduto;
