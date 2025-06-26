
import React from "react";

export const convertAtendimentosData = (atendimentos: any[]) => {
  return atendimentos.map(atendimento => ({
    id: parseInt(atendimento.id?.substring(0, 8) || '0', 16),
    cliente: atendimento.cliente_nome,
    contato: atendimento.contato,
    assunto: atendimento.assunto,
    data: new Date(atendimento.data).toLocaleDateString('pt-BR'),
    hora: atendimento.hora,
    canal: atendimento.canal,
    status: atendimento.status,
    mensagem: atendimento.mensagem || '',
    clienteId: atendimento.cliente_id ? parseInt(atendimento.cliente_id.substring(0, 8), 16) : undefined
  }));
};

export const convertSelectedAtendimento = (selectedAtendimento: any, convertedAtendimentos: any[]) => {
  return selectedAtendimento ? {
    id: parseInt(selectedAtendimento.id?.substring(0, 8) || '0', 16),
    cliente: selectedAtendimento.cliente_nome,
    contato: selectedAtendimento.contato,
    assunto: selectedAtendimento.assunto,
    data: new Date(selectedAtendimento.data).toLocaleDateString('pt-BR'),
    hora: selectedAtendimento.hora,
    canal: selectedAtendimento.canal,
    status: selectedAtendimento.status,
    mensagem: selectedAtendimento.mensagem || '',
    clienteId: selectedAtendimento.cliente_id ? parseInt(selectedAtendimento.cliente_id.substring(0, 8), 16) : undefined
  } : (convertedAtendimentos[0] || {
    id: 0,
    cliente: '',
    contato: '',
    assunto: '',
    data: '',
    hora: '',
    canal: '',
    status: '',
    mensagem: ''
  });
};
