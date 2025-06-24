
import { useQuery } from '@tanstack/react-query';
import { clienteService } from '@/services/supabaseService';
import { produtoAcabadoService } from '@/services/produtoAcabadoService';
import { ClienteSimplificado, ProdutoAcabado } from '@/types/orcamento';

export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async (): Promise<ClienteSimplificado[]> => {
      const data = await clienteService.listarTodos();
      return data.map(cliente => ({
        id: parseInt(cliente.id.replace(/-/g, '').substring(0, 8), 16),
        nome: cliente.nome,
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        empresa: cliente.empresa || '',
        cnpj: cliente.cnpj || ''
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useProdutosAcabados = () => {
  return useQuery({
    queryKey: ['produtos-acabados'],
    queryFn: async (): Promise<ProdutoAcabado[]> => {
      const data = await produtoAcabadoService.listarTodos();
      
      return data.map(produto => ({
        id: parseInt(produto.id.replace(/-/g, '').substring(0, 8), 16),
        codigo: produto.codigo,
        nome: produto.nome,
        descricao: produto.descricao || '',
        categoria: produto.categoria,
        unidadeMedida: produto.unidade_medida,
        valorBase: parseFloat(produto.valor_base.toString()),
        quantidadeEstoque: produto.quantidade_estoque,
        dataCadastro: produto.data_cadastro,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
