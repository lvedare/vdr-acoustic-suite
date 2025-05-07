
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Adicionando o tipo ao jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ClienteSimplificado {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cnpj?: string;
}

interface ItemProposta {
  id: number;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface CustoProposta {
  id: number;
  descricao: string;
  valor: number;
}

interface Proposta {
  id: number;
  numero: string;
  data: string;
  cliente: ClienteSimplificado;
  status: "rascunho" | "enviada" | "aprovada" | "rejeitada" | "expirada";
  itens: ItemProposta[];
  custos: CustoProposta[];
  observacoes: string;
  valorTotal: number;
  formaPagamento: string;
  prazoEntrega: string;
  prazoObra: string;
  validade: string;
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 */
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Formata um valor numérico para o formato de moeda brasileira
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Gera um PDF de proposta baseado no modelo VDR
 */
export const generateProposalPDF = (proposta: Proposta) => {
  // Criar um novo documento PDF
  const doc = new jsPDF();
  
  // Definir margens
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 20;
  
  // Configurações de cores
  const azulVDR = [1/255, 53/255, 118/255]; // #013576
  const vermelhoVDR = [252/255, 1/255, 24/255]; // #FC0118
  
  // Adicionar cabeçalho com logo
  doc.setFillColor(1, 1, 1);
  doc.rect(marginLeft, marginTop, 170, 30, 'F');
  
  // Adicionar barra lateral vermelha (simulação)
  doc.setFillColor(vermelhoVDR[0], vermelhoVDR[1], vermelhoVDR[2]);
  doc.rect(marginLeft, marginTop, 5, 250, 'F');
  
  // Logo VDR (simulação)
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(marginLeft + 10, marginTop + 2, 30, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("VEDARE", marginLeft + 15, marginTop + 11);
  
  // Título da proposta
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA", 100, marginTop + 5, { align: "center" });
  doc.text(proposta.numero, 100, marginTop + 12, { align: "center" });
  
  // Data no canto superior direito
  const dataFormatada = formatDate(proposta.data);
  doc.text(`Goiânia, ${dataFormatada.replace(/\//g, ' de ')} de 2025`, 170, marginTop + 5, { align: "right" });
  
  // Informações do cliente
  doc.setFont("helvetica", "bold");
  doc.text(proposta.cliente.nome, marginLeft, marginTop + 40);
  doc.setFont("helvetica", "normal");
  doc.text(`AT.: ${proposta.cliente.empresa || '-'}`, marginLeft, marginTop + 45);
  doc.text(`CNPJ / CPF: ${proposta.cliente.cnpj || '-'}`, marginLeft, marginTop + 50);
  doc.text(`TEL: ${proposta.cliente.telefone}`, marginLeft, marginTop + 55);
  doc.text(`E-MAIL: ${proposta.cliente.email}`, marginLeft, marginTop + 60);
  doc.text(`OBRA: ISOLAMENTO ACÚSTICO`, marginLeft, marginTop + 65);
  
  // Prezado Sr.
  doc.text("Prezado Sr.", marginLeft, marginTop + 75);
  
  // Texto introdutório
  doc.text("        Atendendo à grata solicitação, vimos apresentar para vossa análise e apreciação, a nossa proposta técnico-comercial para realizarmos o", marginLeft, marginTop + 80);
  doc.text("tratamento Acústico, nas dependências do vosso empreendimento, localizado em Comando De Operações Especiais - Avenida Salvador Di Bernardi, 270 -", marginLeft, marginTop + 85);
  doc.text("Guarujázinho Cep: 74675-240 - Goiânia - Go.", marginLeft, marginTop + 90);
  
  // APRESENTAÇÃO
  doc.setFont("helvetica", "bold");
  doc.text("APRESENTAÇÃO", 100, marginTop + 105, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("        A Presente proposta técnica foi elaborada procurando estabelecer uma coerência lógica entre o planejamento geral das instalações e os dados", marginLeft, marginTop + 110);
  doc.text("fornecidos por V.Sr, em vista disso, o roteiro da proposta obedeceu aos itens que foram fornecidos pelo Contratante, com o intuito de atender do", marginLeft, marginTop + 115);
  doc.text("material proposto, buscando uma solução que atendesse tanto aos requisitos estéticos quanto acústicos tendo em vista o melhor custo-benefício e dando", marginLeft, marginTop + 120);
  doc.text("a segurança na execução da obra de acordo com as normas técnicas dos fabricantes dos materiais a serem  utilizadas na obra em questão.", marginLeft, marginTop + 125);
  
  // DISPOSIÇÃO DOS VALORES
  doc.setFont("helvetica", "bold");
  doc.text("DISPOSIÇÃO DOS VALORES", 100, marginTop + 140, { align: "center" });
  doc.text("O valor total do investimento apresentado é de:", 100, marginTop + 145, { align: "center" });
  doc.setFontSize(14);
  doc.text(formatCurrency(proposta.valorTotal), 100, marginTop + 155, { align: "center" });
  
  // INFORMAÇÕES COMERCIAIS
  doc.setFontSize(12);
  doc.text("INFORMAÇÕES COMERCIAIS", 100, marginTop + 170, { align: "center" });
  
  // Forma de Pagamento
  doc.setFont("helvetica", "bold");
  doc.text("Forma de Pagamento:", marginLeft, marginTop + 180);
  doc.setFont("helvetica", "normal");
  doc.text(proposta.formaPagamento, marginLeft + 40, marginTop + 180);
  
  // Prazo de Entrega
  doc.setFont("helvetica", "bold");
  doc.text("Prazo de Entrega do Material:", marginLeft, marginTop + 185);
  doc.setFont("helvetica", "normal");
  doc.text(proposta.prazoEntrega, marginLeft + 60, marginTop + 185);
  
  // Prazo de Entrega da Obra
  doc.setFont("helvetica", "bold");
  doc.text("Prazo de Entrega da Obra:", marginLeft, marginTop + 190);
  doc.setFont("helvetica", "normal");
  doc.text(proposta.prazoObra, marginLeft + 55, marginTop + 190);
  
  // Validade
  doc.setFont("helvetica", "bold");
  doc.text("Validade da proposta:", marginLeft, marginTop + 195);
  doc.setFont("helvetica", "normal");
  doc.text(proposta.validade, marginLeft + 45, marginTop + 195);
  
  // OBSERVAÇÕES
  doc.setFont("helvetica", "bold");
  doc.text("OBSERVAÇÕES", 100, marginTop + 210, { align: "center" });
  
  // Quebrar observações em linhas
  const observacoes = proposta.observacoes.split('\n');
  let currentY = marginTop + 215;
  
  observacoes.forEach(obs => {
    doc.setFont("helvetica", "normal");
    doc.text(obs, marginLeft, currentY);
    currentY += 5;
  });
  
  // Adicionar assinaturas
  currentY = Math.max(currentY + 10, marginTop + 240);
  
  doc.setFont("helvetica", "normal");
  doc.text("Atenciosamente,", marginLeft, currentY);
  doc.text("DORI LIMA DOS SANTOS", marginLeft, currentY + 10);
  doc.text("DIRETOR TÉCNICO COMERCIAL", marginLeft, currentY + 15);
  
  doc.text("RAYAN FÁSSIO SANTOS", 170, currentY + 10, { align: "right" });
  doc.text("DE ACORDO EM ______/______/_______", 170, currentY + 15, { align: "right" });
  
  // Adicionar rodapé
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(marginLeft, 280, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Av. Pedro Ludovico Teixeira, Nº 4415, Qd. 142, Lt. 18 - Parque Oeste Industrial, CEP: 74.375-400", 100, 285, { align: "center" });
  doc.text("Goiânia/GO - Fone/Fax: (62) 3942-1877 - www.vedare.com.br - CNPJ 28.298.757/0001-78", 100, 288, { align: "center" });

  // Nova página para os itens da proposta
  doc.addPage();

  // Cabeçalho da segunda página (logo + data)
  doc.setFillColor(1, 1, 1);
  doc.rect(marginLeft, marginTop, 170, 20, 'F');
  
  // Adicionar barra lateral vermelha (simulação)
  doc.setFillColor(vermelhoVDR[0], vermelhoVDR[1], vermelhoVDR[2]);
  doc.rect(marginLeft, marginTop, 5, 250, 'F');
  
  // Logo VDR (simulação)
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(marginLeft + 10, marginTop + 2, 30, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("VEDARE", marginLeft + 15, marginTop + 11);
  
  // Data no canto superior direito
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Goiânia, ${dataFormatada.replace(/\//g, ' de ')} de 2025`, 170, marginTop + 10, { align: "right" });
  
  // Tabela de itens
  const tableColumn = [
    "CÓDIGO",
    "ITEM",
    "DESCRIÇÃO COMERCIAL",
    "UNID",
    "QUANT.",
    "VALOR UNIT.",
    "TOTAL"
  ];
  
  const tableRows = proposta.itens.map(item => [
    item.codigo,
    "", // Item number
    item.descricao,
    item.unidade,
    item.quantidade,
    formatCurrency(item.valorUnitario),
    formatCurrency(item.valorTotal)
  ]);
  
  doc.autoTable({
    startY: marginTop + 25,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: azulVDR,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 15 }, // CÓDIGO
      1: { cellWidth: 10 }, // ITEM
      2: { cellWidth: 80 }, // DESCRIÇÃO COMERCIAL
      3: { cellWidth: 12 }, // UNID
      4: { cellWidth: 15 }, // QUANT
      5: { cellWidth: 20 }, // VALOR UNIT
      6: { cellWidth: 20 }  // TOTAL
    },
    styles: {
      fontSize: 9,
      cellPadding: 2
    }
  });
  
  // Adicionar subtotal da tabela
  const finalY = (doc as any).lastAutoTable.finalY;
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(marginLeft, finalY, 170, 8, 'F');
  doc.text("VALOR DOS ITENS:", 150, finalY + 5.5, { align: "right" });
  doc.text(formatCurrency(proposta.valorTotal), 182, finalY + 5.5, { align: "right" });
  
  // Tabela de custos extras (M.O., Projeto, Execução)
  doc.setTextColor(0, 0, 0);
  doc.autoTable({
    startY: finalY + 15,
    head: [['DESCRIÇÃO', 'VALOR']],
    body: [
      ['# # # #', '-']
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });
  
  // Total do investimento
  const custosFinalY = (doc as any).lastAutoTable.finalY;
  
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(marginLeft, custosFinalY + 5, 170, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL DO INVESTIMENTO", 100, custosFinalY + 10.5, { align: "center" });
  doc.text(formatCurrency(proposta.valorTotal), 182, custosFinalY + 10.5, { align: "right" });
  
  // Assinaturas na parte inferior
  let signatureY = 260;
  doc.setTextColor(0, 0, 0);
  doc.text("Atenciosamente,", marginLeft, signatureY);
  doc.text("DORI LIMA DOS SANTOS", marginLeft, signatureY + 10);
  doc.text("DIRETOR TÉCNICO COMERCIAL", marginLeft, signatureY + 15);
  
  doc.text("RAYAN FÁSSIO SANTOS", 170, signatureY + 10, { align: "right" });
  doc.text("DE ACORDO EM ______/______/_______", 170, signatureY + 15, { align: "right" });
  
  // Adicionar rodapé
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(marginLeft, 280, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Av. Pedro Ludovico Teixeira, Nº 4415, Qd. 142, Lt. 18 - Parque Oeste Industrial, CEP: 74.375-400", 100, 285, { align: "center" });
  doc.text("Goiânia/GO - Fone/Fax: (62) 3942-1877 - www.vedare.com.br - CNPJ 28.298.757/0001-78", 100, 288, { align: "center" });

  // Salvar o PDF
  const pdfName = `proposta_${proposta.numero.replace(/\./g, '_')}.pdf`;
  doc.save(pdfName);
  
  return pdfName;
};

// Exportar função de geração de PDF
export default {
  generateProposalPDF
};
