
import { clienteService } from "./clienteService";
import { propostaService } from "./propostaService";
import { atendimentoSupabaseService } from "./atendimentoSupabaseService";

export const supabaseService = {
  listarClientes: clienteService.listar,
  criarCliente: clienteService.criar,
  atualizarCliente: clienteService.atualizar,
  excluirCliente: clienteService.excluir,

  listarPropostas: propostaService.listar,
  criarProposta: propostaService.criar,
  atualizarProposta: propostaService.atualizar,
  excluirProposta: propostaService.excluir,

  atendimentoService: atendimentoSupabaseService,
};

// Export clienteService for backward compatibility
export { clienteService };
