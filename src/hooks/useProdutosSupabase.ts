
import { useProdutosAcabados as useSupabaseProdutos } from '@/hooks/useProdutosAcabados';
import { ProdutoAcabado } from '@/types/orcamento';

export const useProdutosSupabase = () => {
  const { 
    produtos: produtosSupabase, 
    isLoading, 
    criarProduto: criarProdutoSupabase,
    atualizarProduto: atualizarProdutoSupabase,
    excluirProduto: excluirProdutoSupabase,
    isCriando,
    isAtualizando,
    isExcluindo
  } = useSupabaseProdutos();

  // Converter produtos do Supabase para o formato esperado pelo contexto
  const produtos: ProdutoAcabado[] = produtosSupabase.map(produto => {
    // Gerar ID numérico baseado no hash do UUID
    let numericId = 0;
    if (produto.id) {
      const str = produto.id.toString();
      for (let i = 0; i < str.length; i++) {
        numericId = ((numericId << 5) - numericId + str.charCodeAt(i)) & 0xffffffff;
      }
      numericId = Math.abs(numericId);
    }
    
    return {
      id: numericId,
      codigo: produto.codigo || `COD-${numericId}`,
      nome: produto.nome || "Produto sem nome",
      descricao: produto.descricao || "",
      categoria: produto.categoria || "Sem categoria",
      unidadeMedida: produto.unidade_medida || "un",
      valorBase: Number(produto.valor_base) || 0,
      quantidadeEstoque: produto.quantidade_estoque || 0,
      dataCadastro: produto.data_cadastro || new Date().toISOString().split('T')[0]
    };
  });

  // Função para criar produto - converter formato
  const criarProduto = (produtoData: ProdutoAcabado) => {
    const supabaseData = {
      codigo: produtoData.codigo,
      nome: produtoData.nome,
      descricao: produtoData.descricao,
      categoria: produtoData.categoria,
      unidade_medida: produtoData.unidadeMedida,
      valor_base: produtoData.valorBase,
      quantidade_estoque: produtoData.quantidadeEstoque,
      data_cadastro: produtoData.dataCadastro
    };
    
    return criarProdutoSupabase(supabaseData);
  };

  // Função para atualizar produto - corrigir tipo do parâmetro id
  const atualizarProduto = (id: string, produtoData: Partial<ProdutoAcabado>) => {
    const supabaseData = {
      ...(produtoData.codigo && { codigo: produtoData.codigo }),
      ...(produtoData.nome && { nome: produtoData.nome }),
      ...(produtoData.descricao && { descricao: produtoData.descricao }),
      ...(produtoData.categoria && { categoria: produtoData.categoria }),
      ...(produtoData.unidadeMedida && { unidade_medida: produtoData.unidadeMedida }),
      ...(produtoData.valorBase !== undefined && { valor_base: produtoData.valorBase }),
      ...(produtoData.quantidadeEstoque !== undefined && { quantidade_estoque: produtoData.quantidadeEstoque }),
      ...(produtoData.dataCadastro && { data_cadastro: produtoData.dataCadastro })
    };
    
    return atualizarProdutoSupabase({ id, produto: supabaseData });
  };

  return {
    produtos,
    isLoading,
    criarProduto,
    atualizarProduto,
    excluirProduto: excluirProdutoSupabase,
    isCriando,
    isAtualizando,
    isExcluindo
  };
};
