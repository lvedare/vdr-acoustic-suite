
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movimentacaoEstoqueService } from '@/services/movimentacaoEstoqueService';
import { produtoAcabadoService } from '@/services/produtoAcabadoService';
import { insumoService } from '@/services/insumoService';
import { toast } from 'sonner';

export const useMovimentacaoEstoque = () => {
  const queryClient = useQueryClient();

  const { data: movimentacoes = [], isLoading } = useQuery({
    queryKey: ['movimentacoes-estoque'],
    queryFn: () => movimentacaoEstoqueService.listarTodas(),
  });

  const criarMovimentacao = useMutation({
    mutationFn: movimentacaoEstoqueService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes-estoque'] });
      queryClient.invalidateQueries({ queryKey: ['produtos-acabados'] });
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Movimentação registrada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar movimentação:', error);
      toast.error('Erro ao registrar movimentação');
    },
  });

  const atualizarEstoqueProduto = async (produtoId: string, quantidade: number, tipo: 'entrada' | 'saida', motivo: string) => {
    console.log('Atualizando estoque produto:', { produtoId, quantidade, tipo, motivo });
    
    try {
      const movimentacao = {
        produto_id: produtoId,
        insumo_id: null,
        tipo,
        quantidade: tipo === 'saida' ? -quantidade : quantidade,
        motivo,
        usuario: 'Sistema',
        observacoes: `Movimentação ${tipo} de estoque`,
        data_movimentacao: new Date().toISOString()
      };

      await criarMovimentacao.mutateAsync(movimentacao);

      // Atualizar estoque do produto
      if (tipo === 'entrada') {
        await produtoAcabadoService.adicionarEstoque(produtoId, quantidade);
      } else {
        await produtoAcabadoService.removerEstoque(produtoId, quantidade);
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque do produto:', error);
      throw error;
    }
  };

  const atualizarEstoqueInsumo = async (insumoId: string, quantidade: number, tipo: 'entrada' | 'saida', motivo: string) => {
    console.log('Atualizando estoque insumo:', { insumoId, quantidade, tipo, motivo });
    
    try {
      const movimentacao = {
        produto_id: null,
        insumo_id: insumoId,
        tipo,
        quantidade: tipo === 'saida' ? -quantidade : quantidade,
        motivo,
        usuario: 'Sistema',
        observacoes: `Movimentação ${tipo} de estoque`,
        data_movimentacao: new Date().toISOString()
      };

      await criarMovimentacao.mutateAsync(movimentacao);

      // Atualizar estoque do insumo
      if (tipo === 'entrada') {
        await insumoService.adicionarEstoque(insumoId, quantidade);
      } else {
        await insumoService.removerEstoque(insumoId, quantidade);
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque do insumo:', error);
      throw error;
    }
  };

  return {
    movimentacoes,
    isLoading,
    criarMovimentacao,
    atualizarEstoqueProduto,
    atualizarEstoqueInsumo
  };
};
