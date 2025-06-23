
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Search, Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
  
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemProposta | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  // Handler para iniciar a edição de um item
  const handleEditarItem = (item: ItemProposta) => {
    setItemEmEdicao({...item});
    setIsEditDialogOpen(true);
  };
  
  // Handler para salvar a edição de um item
  const handleSalvarEdicao = () => {
    if (!itemEmEdicao) return;
    
    if (!itemEmEdicao.codigo || !itemEmEdicao.descricao || itemEmEdicao.quantidade <= 0 || itemEmEdicao.valorUnitario <= 0) {
      toast.error("Preencha todos os campos do item corretamente");
      return;
    }
    
    // Atualizar o valor total
    const valorTotal = itemEmEdicao.quantidade * itemEmEdicao.valorUnitario;
    const itemAtualizado = { ...itemEmEdicao, valorTotal };
    
    // Atualizar a proposta com o item editado
    setProposta(prev => ({
      ...prev,
      itens: prev.itens.map(item => 
        item.id === itemAtualizado.id ? itemAtualizado : item
      )
    }));
    
    setIsEditDialogOpen(false);
    setItemEmEdicao(null);
    toast.success("Item atualizado com sucesso!");
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
                  <Button variant="outline" size="icon" title="Selecionar Produto">
                    <Package className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Selecionar Produto do Estoque</DialogTitle>
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
                            <TableHead className="w-[100px]">Código</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead className="w-[80px]">Un.</TableHead>
                            <TableHead className="w-[100px]">Valor</TableHead>
                            <TableHead className="w-[80px]">Estoque</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {produtosFiltrados.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                {produtosAcabados.length === 0 
                                  ? "Nenhum produto cadastrado no sistema."
                                  : "Nenhum produto encontrado com o filtro aplicado."
                                }
                              </TableCell>
                            </TableRow>
                          ) : (
                            produtosFiltrados.map((produto) => (
                              <TableRow key={produto.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">
                                  <Badge variant="outline">{produto.codigo}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{produto.nome}</div>
                                    {produto.descricao && (
                                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                                        {produto.descricao}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{produto.categoria}</Badge>
                                </TableCell>
                                <TableCell>{produto.unidadeMedida}</TableCell>
                                <TableCell className="font-medium">
                                  {formatCurrency(produto.valorBase)}
                                </TableCell>
                                <TableCell>
                                  <span className={produto.quantidadeEstoque < 10 ? 'text-red-500 font-medium' : ''}>
                                    {produto.quantidadeEstoque}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAdicionarProdutoAcabado(produto)}
                                    disabled={produto.quantidadeEstoque <= 0}
                                  >
                                    <Plus className="h-4 w-4 mr-1" /> 
                                    {produto.quantidadeEstoque <= 0 ? 'Sem estoque' : 'Selecionar'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {produtosFiltrados.length > 0 && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        Encontrados {produtosFiltrados.length} produtos
                      </div>
                    )}
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
                <TableHead className="w-[100px]"></TableHead>
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
                    <TableCell>
                      <Badge variant="outline">{item.codigo}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate" title={item.descricao}>
                      {item.descricao}
                    </TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{formatCurrency(item.valorUnitario)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(item.valorTotal)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditarItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => handleRemoverItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
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

        {/* Dialog para edição de item */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-codigo">Código</Label>
                  <Input 
                    id="edit-codigo" 
                    value={itemEmEdicao?.codigo || ""}
                    onChange={(e) => setItemEmEdicao(prev => prev ? { ...prev, codigo: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unidade">Unidade</Label>
                  <Select
                    value={itemEmEdicao?.unidade || ""}
                    onValueChange={(value) => setItemEmEdicao(prev => prev ? { ...prev, unidade: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade" />
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
              </div>
              <div>
                <Label htmlFor="edit-descricao">Descrição</Label>
                <Input 
                  id="edit-descricao" 
                  value={itemEmEdicao?.descricao || ""}
                  onChange={(e) => setItemEmEdicao(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-quantidade">Quantidade</Label>
                  <Input 
                    id="edit-quantidade" 
                    type="number"
                    min="1"
                    value={itemEmEdicao?.quantidade.toString() || ""}
                    onChange={(e) => setItemEmEdicao(prev => prev ? { ...prev, quantidade: Number(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-valorUnitario">Valor Unitário (R$)</Label>
                  <Input 
                    id="edit-valorUnitario" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemEmEdicao?.valorUnitario.toString() || ""}
                    onChange={(e) => setItemEmEdicao(prev => prev ? { ...prev, valorUnitario: Number(e.target.value) } : null)}
                  />
                </div>
              </div>
              {itemEmEdicao && (
                <div className="p-4 bg-slate-50 rounded-md">
                  <p className="font-medium">Valor Total: {formatCurrency(
                    itemEmEdicao.quantidade * itemEmEdicao.valorUnitario
                  )}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarEdicao}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ItemProduto;
