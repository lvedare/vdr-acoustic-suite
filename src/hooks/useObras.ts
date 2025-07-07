
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obraService } from '@/services/obraService';
import { toast } from 'sonner';

interface RelatedItem {
  type: string;
  count: number;
  items: string[];
}

export const useObras = () => {
  const queryClient = useQueryClient();

  const { data: obras = [], isLoading } = useQuery({
    queryKey: ['obras'],
    queryFn: obraService.listarTodas,
  });

  const criarObra = useMutation({
    mutationFn: obraService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar obra:', error);
      toast.error('Erro ao criar obra');
    },
  });

  const atualizarObra = useMutation({
    mutationFn: ({ id, obra }: { id: string; obra: any }) =>
      obraService.atualizar(id, obra),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar obra:', error);
      toast.error('Erro ao atualizar obra');
    },
  });

  const excluirObra = useMutation({
    mutationFn: obraService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir obra:', error);
      toast.error('Erro ao excluir obra');
    },
  });

  // Verificar relacionamentos antes da exclusão
  const verificarRelacionamentos = async (obraId: string): Promise<RelatedItem[]> => {
    try {
      const relacionamentos: RelatedItem[] = [];
      
      // Verificar cronograma relacionado
      // Verificar financeiro relacionado
      // Verificar propostas relacionadas
      console.log('Verificando relacionamentos para obra:', obraId);
      
      return relacionamentos;
    } catch (error) {
      console.error('Erro ao verificar relacionamentos:', error);
      return [];
    }
  };

  return {
    obras,
    isLoading,
    criarObra: criarObra.mutate,
    atualizarObra: atualizarObra.mutate,
    excluirObra: excluirObra.mutate,
    verificarRelacionamentos,
    isCriando: criarObra.isPending,
    isAtualizando: atualizarObra.isPending,
    isExcluindo: excluirObra.isPending,
  };
};
