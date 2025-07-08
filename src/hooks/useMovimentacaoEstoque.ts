
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
    console.log('Atualizando estoque produto - parâmetros:', { produtoId, quantidade, tipo, motivo });
    
    // Validar se o produtoId é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(produtoId)) {
      console.error('ID do produto não é um UUID válido:', produtoId);
      toast.error('Erro: ID do produto inválido');
      throw new Error('ID do produto inválido');
    }
    
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

      console.log('Criando movimentação para produto:', movimentacao);
      await criarMovimentacao.mutateAsync(movimentacao);

      // Atualizar estoque do produto
      console.log(`${tipo === 'entrada' ? 'Adicionando' : 'Removendo'} ${quantidade} do estoque do produto ${produtoId}`);
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
    console.log('Atualizando estoque insumo - parâmetros:', { insumoId, quantidade, tipo, motivo });
    
    // Validar se o insumoId é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(insumoId)) {
      console.error('ID do insumo não é um UUID válido:', insumoId);
      toast.error('Erro: ID do insumo inválido');
      throw new Error('ID do insumo inválido');
    }
    
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

      console.log('Criando movimentação para insumo:', movimentacao);
      await criarMovimentacao.mutateAsync(movimentacao);

      // Atualizar estoque do insumo
      console.log(`${tipo === 'entrada' ? 'Adicionando' : 'Removendo'} ${quantidade} do estoque do insumo ${insumoId}`);
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
