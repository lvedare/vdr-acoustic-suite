
import { useQuery } from '@tanstack/react-query';
import { composicaoProdutoService } from '@/services/composicaoProdutoService';

export const useComposicaoProduto = (produtoId: string | null) => {
  return useQuery({
    queryKey: ['composicao-produto', produtoId],
    queryFn: () => produtoId ? composicaoProdutoService.listarPorProduto(produtoId) : Promise.resolve([]),
    enabled: !!produtoId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
