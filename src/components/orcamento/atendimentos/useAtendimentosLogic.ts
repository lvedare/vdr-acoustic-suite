
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAtendimentosLogic = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [canalFilter, setCanalFilter] = useState("");
  const [atendimentosPendentes, setAtendimentosPendentes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar atendimentos com status "Enviado para Orçamento"
  useEffect(() => {
    const carregarAtendimentosPendentes = async () => {
      try {
        setIsLoading(true);
        console.log('Carregando atendimentos pendentes de orçamento...');

        const { data: atendimentos, error } = await supabase
          .from('atendimentos')
          .select(`
            *,
            cliente:clientes(*)
          `)
          .eq('status', 'Enviado para Orçamento')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar atendimentos pendentes:', error);
          toast.error('Erro ao carregar atendimentos pendentes');
          setAtendimentosPendentes([]);
        } else {
          console.log('Atendimentos pendentes carregados:', atendimentos);
          setAtendimentosPendentes(atendimentos || []);
        }
      } catch (error) {
        console.error('Erro ao carregar atendimentos pendentes:', error);
        toast.error('Erro inesperado ao carregar atendimentos');
        setAtendimentosPendentes([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarAtendimentosPendentes();
  }, []);

  // Filtrar atendimentos pendentes
  const atendimentosFiltrados = atendimentosPendentes.filter(atendimento => {
    const matchesSearch = !searchTerm || 
      atendimento.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.assunto?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCanal = !canalFilter || atendimento.canal === canalFilter;
    
    return matchesSearch && matchesCanal;
  });

  const handleCriarProposta = async (atendimento: any) => {
    try {
      // Gerar número da proposta
      const numeroPropostaSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      const numeroProposta = `PROP-${numeroPropostaSuffix}`;
      
      console.log('Criando proposta a partir do atendimento:', atendimento);
      
      // Criar proposta no Supabase
      const { data: novaProposta, error } = await supabase
        .from('propostas')
        .insert({
          numero: numeroProposta,
          data: new Date().toISOString().split('T')[0],
          cliente_id: atendimento.cliente_id,
          atendimento_id: atendimento.id,
          origem: 'atendimento',
          status: 'rascunho',
          observacoes: `Proposta gerada a partir do atendimento: ${atendimento.assunto}`,
          valor_total: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar proposta:', error);
        toast.error('Erro ao criar proposta');
        return;
      }

      console.log('Proposta criada com sucesso:', novaProposta);
      toast.success("Proposta criada com sucesso!");
      
      // Navegar para editar a proposta
      navigate(`/novo-orcamento`, { 
        state: { propostaId: Number(novaProposta.id), isEdit: true } 
      });
      
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast.error("Erro ao criar proposta");
    }
  };

  const handleVisualizarAtendimento = (atendimento: any) => {
    const detalhes = `
Cliente: ${atendimento.cliente_nome}
${atendimento.cliente?.empresa ? `Empresa: ${atendimento.cliente.empresa}` : ''}
Assunto: ${atendimento.assunto}
Canal: ${atendimento.canal}
Contato: ${atendimento.contato}
Data: ${atendimento.data}
Mensagem: ${atendimento.mensagem || 'Nenhuma mensagem adicional'}
    `;
    alert(detalhes);
  };

  return {
    searchTerm,
    setSearchTerm,
    canalFilter,
    setCanalFilter,
    atendimentosPendentes,
    atendimentosFiltrados,
    isLoading,
    handleCriarProposta,
    handleVisualizarAtendimento,
  };
};
