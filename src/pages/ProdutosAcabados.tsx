
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Package, Plus, Search, Trash, Edit, FileText, PackageOpen } from "lucide-react";

interface ProdutoAcabado {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  valorBase: number;
  quantidadeEstoque: number;
  dataCadastro: string;
}

const categorias = [
  "Portas",
  "Janelas",
  "Guarda-corpo",
  "Móveis",
  "Box",
  "Fechamento",
  "Diversos"
];

const unidadesMedida = [
  "PÇ",
  "M²",
  "M",
  "UN",
  "CJ",
  "KG"
];

const ProdutosAcabados = () => {
  const [produtos, setProdutos] = useState<ProdutoAcabado[]>([]);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  
  const [novoProduto, setNovoProduto] = useState<Omit<ProdutoAcabado, "id" | "dataCadastro">>({
    codigo: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidadeMedida: "PÇ",
    valorBase: 0,
    quantidadeEstoque: 0
  });
  
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoAcabado | null>(null);
  const [dialogModoEdicao, setDialogModoEdicao] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);

  // Carregar produtos do localStorage
  useEffect(() => {
    const produtosSalvos = localStorage.getItem("produtosAcabados");
    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos));
    }
  }, []);

  // Salvar produtos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("produtosAcabados", JSON.stringify(produtos));
  }, [produtos]);

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const termoPresente = 
      produto.nome.toLowerCase().includes(filtroBusca.toLowerCase()) || 
      produto.codigo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(filtroBusca.toLowerCase());
    
    const categoriaCorreta = filtroCategoria ? produto.categoria === filtroCategoria : true;
    
    return termoPresente && categoriaCorreta;
  });

  // Formatar valores para moeda brasileira
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  // Manipular adição de novo produto
  const handleAdicionarProduto = () => {
    // Validar dados
    if (!novoProduto.codigo || !novoProduto.nome || !novoProduto.categoria || !novoProduto.unidadeMedida) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    // Verificar se código já existe
    if (produtos.some(p => p.codigo === novoProduto.codigo)) {
      toast.error("Um produto com este código já existe");
      return;
    }
    
    // Adicionar novo produto
    const novoProdutoCompleto: ProdutoAcabado = {
      ...novoProduto,
      id: Date.now(),
      dataCadastro: new Date().toISOString()
    };
    
    setProdutos(prev => [...prev, novoProdutoCompleto]);
    
    // Reset do formulário
    setNovoProduto({
      codigo: "",
      nome: "",
      descricao: "",
      categoria: "",
      unidadeMedida: "PÇ",
      valorBase: 0,
      quantidadeEstoque: 0
    });
    
    setDialogAberto(false);
    toast.success("Produto adicionado com sucesso");
  };

  // Manipular atualização de produto
  const handleAtualizarProduto = () => {
    if (!produtoEmEdicao) return;
    
    // Validar dados
    if (!produtoEmEdicao.codigo || !produtoEmEdicao.nome || !produtoEmEdicao.categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    // Verificar se código já existe em outro produto
    if (produtos.some(p => p.codigo === produtoEmEdicao.codigo && p.id !== produtoEmEdicao.id)) {
      toast.error("Um produto com este código já existe");
      return;
    }
    
    // Atualizar produto
    setProdutos(prev => prev.map(p => p.id === produtoEmEdicao.id ? produtoEmEdicao : p));
    
    setDialogAberto(false);
    setProdutoEmEdicao(null);
    toast.success("Produto atualizado com sucesso");
  };

  // Manipular exclusão de produto
  const handleExcluirProduto = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(prev => prev.filter(p => p.id !== id));
      toast.success("Produto excluído com sucesso");
    }
  };

  // Manipular edição de produto
  const handleEditarProduto = (produto: ProdutoAcabado) => {
    setProdutoEmEdicao(produto);
    setDialogModoEdicao(true);
    setDialogAberto(true);
  };

  // Lidar com o fechamento do diálogo
  const handleFecharDialog = () => {
    setDialogAberto(false);
    setDialogModoEdicao(false);
    setProdutoEmEdicao(null);
    setNovoProduto({
      codigo: "",
      nome: "",
      descricao: "",
      categoria: "",
      unidadeMedida: "PÇ",
      valorBase: 0,
      quantidadeEstoque: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos Acabados</h1>
          <p className="text-muted-foreground">
            Gerencie o catálogo de produtos acabados para orçamentos e vendas.
          </p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setDialogModoEdicao(false);
              setNovoProduto({
                codigo: "",
                nome: "",
                descricao: "",
                categoria: "",
                unidadeMedida: "PÇ",
                valorBase: 0,
                quantidadeEstoque: 0
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {dialogModoEdicao ? "Editar Produto" : "Adicionar Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código*</Label>
                  <Input
                    id="codigo"
                    value={dialogModoEdicao ? produtoEmEdicao?.codigo : novoProduto.codigo}
                    onChange={(e) => {
                      if (dialogModoEdicao) {
                        setProdutoEmEdicao(prev => prev ? {...prev, codigo: e.target.value} : null);
                      } else {
                        setNovoProduto(prev => ({...prev, codigo: e.target.value}));
                      }
                    }}
                    placeholder="Ex: PA001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria*</Label>
                  <Select
                    value={dialogModoEdicao ? produtoEmEdicao?.categoria : novoProduto.categoria}
                    onValueChange={(value) => {
                      if (dialogModoEdicao) {
                        setProdutoEmEdicao(prev => prev ? {...prev, categoria: value} : null);
                      } else {
                        setNovoProduto(prev => ({...prev, categoria: value}));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto*</Label>
                <Input
                  id="nome"
                  value={dialogModoEdicao ? produtoEmEdicao?.nome : novoProduto.nome}
                  onChange={(e) => {
                    if (dialogModoEdicao) {
                      setProdutoEmEdicao(prev => prev ? {...prev, nome: e.target.value} : null);
                    } else {
                      setNovoProduto(prev => ({...prev, nome: e.target.value}));
                    }
                  }}
                  placeholder="Nome do produto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={dialogModoEdicao ? produtoEmEdicao?.descricao : novoProduto.descricao}
                  onChange={(e) => {
                    if (dialogModoEdicao) {
                      setProdutoEmEdicao(prev => prev ? {...prev, descricao: e.target.value} : null);
                    } else {
                      setNovoProduto(prev => ({...prev, descricao: e.target.value}));
                    }
                  }}
                  placeholder="Descrição detalhada do produto"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidadeMedida">Unidade*</Label>
                  <Select
                    value={dialogModoEdicao ? produtoEmEdicao?.unidadeMedida : novoProduto.unidadeMedida}
                    onValueChange={(value) => {
                      if (dialogModoEdicao) {
                        setProdutoEmEdicao(prev => prev ? {...prev, unidadeMedida: value} : null);
                      } else {
                        setNovoProduto(prev => ({...prev, unidadeMedida: value}));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Un." />
                    </SelectTrigger>
                    <SelectContent>
                      {unidadesMedida.map((un) => (
                        <SelectItem key={un} value={un}>
                          {un}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorBase">Valor Base (R$)*</Label>
                  <Input
                    id="valorBase"
                    type="number"
                    step="0.01"
                    value={dialogModoEdicao ? produtoEmEdicao?.valorBase : novoProduto.valorBase}
                    onChange={(e) => {
                      const valor = Number(e.target.value);
                      if (dialogModoEdicao) {
                        setProdutoEmEdicao(prev => prev ? {...prev, valorBase: valor} : null);
                      } else {
                        setNovoProduto(prev => ({...prev, valorBase: valor}));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidadeEstoque">Qtd. Estoque</Label>
                  <Input
                    id="quantidadeEstoque"
                    type="number"
                    step="1"
                    value={dialogModoEdicao ? produtoEmEdicao?.quantidadeEstoque : novoProduto.quantidadeEstoque}
                    onChange={(e) => {
                      const qtd = Number(e.target.value);
                      if (dialogModoEdicao) {
                        setProdutoEmEdicao(prev => prev ? {...prev, quantidadeEstoque: qtd} : null);
                      } else {
                        setNovoProduto(prev => ({...prev, quantidadeEstoque: qtd}));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleFecharDialog}>
                Cancelar
              </Button>
              <Button onClick={dialogModoEdicao ? handleAtualizarProduto : handleAdicionarProduto}>
                {dialogModoEdicao ? "Salvar Alterações" : "Adicionar Produto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, código ou descrição..."
            className="pl-8"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
          />
        </div>
        <Select
          value={filtroCategoria}
          onValueChange={setFiltroCategoria}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PackageOpen className="mr-2 h-5 w-5" />
            Lista de Produtos Acabados
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({produtosFiltrados.length} produtos)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Un.</TableHead>
                  <TableHead>Valor Base</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
                            <div className="text-xs text-muted-foreground truncate max-w-xs">{produto.descricao}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>{produto.unidadeMedida}</TableCell>
                      <TableCell>{formatCurrency(produto.valorBase)}</TableCell>
                      <TableCell>{produto.quantidadeEstoque}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditarProduto(produto)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleExcluirProduto(produto.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProdutosAcabados;
