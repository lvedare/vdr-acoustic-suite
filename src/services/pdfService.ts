
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Proposta, formatCurrency } from '@/types/orcamento';

// Formatação de data
const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

// Função principal para gerar PDF da proposta
export const generateProposalPDF = (proposta: Proposta) => {
  const doc = new jsPDF();
  
  // Dimensões da página
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Cores
  const azulVDR = [1/255, 53/255, 118/255]; // #013576
  const vermelhoVDR = [252/255, 1/255, 24/255]; // #FC0118
  
  // Fonte padrão
  doc.setFont("helvetica");
  
  // Cabeçalho
  doc.setFillColor(azulVDR[0], azulVDR[1], azulVDR[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo VDR
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("VDR", margin, 25);
  
  doc.setFontSize(12);
  doc.text("SOLUÇÕES EM VIDRO E ALUMÍNIO", margin + 25, 25);
  
  // Informações de contato
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("(62) 3086-5381 | comercial@vdrnova.com.br", pageWidth - margin, 15, { align: "right" });
  doc.text("Rua 2 Qd 3 Lt 17 e 18, Vila Lucy, Goiânia-GO", pageWidth - margin, 22, { align: "right" });
  doc.text("CNPJ: 27.913.618/0001-35", pageWidth - margin, 29, { align: "right" });
  
  // Título da proposta
  doc.setFillColor(vermelhoVDR[0], vermelhoVDR[1], vermelhoVDR[2]);
  doc.rect(0, 40, pageWidth, 14, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`PROPOSTA COMERCIAL Nº ${proposta.numero}`, pageWidth / 2, 48, { align: "center" });
  
  // Data da proposta
  const yPos = 70;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Goiânia, ${formatarData(proposta.data)}`, pageWidth - margin, yPos, { align: "right" });
  
  // Dados do cliente
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DO CLIENTE", margin, yPos + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  let clienteY = yPos + 20;
  doc.text(`Cliente: ${proposta.cliente.nome}`, margin, clienteY);
  clienteY += 7;
  
  if (proposta.cliente.empresa) {
    doc.text(`Empresa: ${proposta.cliente.empresa}`, margin, clienteY);
    clienteY += 7;
  }
  
  if (proposta.cliente.cnpj) {
    doc.text(`CNPJ/CPF: ${proposta.cliente.cnpj}`, margin, clienteY);
    clienteY += 7;
  }
  
  doc.text(`E-mail: ${proposta.cliente.email}`, margin, clienteY);
  clienteY += 7;
  doc.text(`Telefone: ${proposta.cliente.telefone}`, margin, clienteY);
  clienteY += 7;
  
  // Linha separadora
  clienteY += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, clienteY, pageWidth - margin, clienteY);
  clienteY += 10;
  
  // Título da tabela de itens
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(azulVDR[0]*255, azulVDR[1]*255, azulVDR[2]*255);
  doc.text("DESCRIÇÃO DOS ITENS E SERVIÇOS", margin, clienteY);
  clienteY += 10;
  
  // Tabela de itens
  const tableHeaders = [
    "Cód.", "Descrição", "Un.", "Qtd", "Valor Unit.", "Valor Total"
  ];
  
  const tableData = proposta.itens.map(item => [
    item.codigo,
    item.descricao,
    item.unidade,
    item.quantidade.toString(),
    formatCurrency(item.valorUnitario),
    formatCurrency(item.valorTotal)
  ]);
  
  // Adicionar linha de total
  tableData.push([
    "",
    "",
    "",
    "",
    "TOTAL:",
    formatCurrency(proposta.valorTotal)
  ]);
  
  autoTable(doc, {
    startY: clienteY,
    head: [tableHeaders],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [1, 53, 118],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 35, halign: 'right' },
      5: { cellWidth: 35, halign: 'right' }
    },
    styles: {
      fontSize: 9
    },
    foot: [[
      {
        content: 'Total da Proposta: ' + formatCurrency(proposta.valorTotal),
        colSpan: 6,
        styles: {
          halign: 'right',
          fillColor: [240, 240, 240],
          fontStyle: 'bold'
        }
      }
    ]],
  });
  
  // Nova posição Y após a tabela
  let newY = (doc as any).lastAutoTable.finalY + 15;
  
  // Verificar se precisamos de uma nova página
  if (newY > pageHeight - 100) {
    doc.addPage();
    newY = 40;
  }
  
  // Condições comerciais
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(azulVDR[0]*255, azulVDR[1]*255, azulVDR[2]*255);
  doc.text("CONDIÇÕES COMERCIAIS", margin, newY);
  
  newY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Grid de condições
  const condicoes = [
    { label: "Forma de Pagamento:", value: proposta.formaPagamento },
    { label: "Prazo de Entrega do Material:", value: proposta.prazoEntrega },
    { label: "Prazo de Execução da Obra:", value: proposta.prazoObra },
    { label: "Validade da proposta:", value: proposta.validade }
  ];
  
  condicoes.forEach((condicao, index) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${condicao.label}`, margin, newY);
    doc.setFont("helvetica", "normal");
    doc.text(`${condicao.value}`, margin + 60, newY);
    newY += 8;
  });
  
  // Verificar se precisamos de uma nova página
  if (newY > pageHeight - 80) {
    doc.addPage();
    newY = 40;
  }
  
  // Observações
  newY += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(azulVDR[0]*255, azulVDR[1]*255, azulVDR[2]*255);
  doc.text("OBSERVAÇÕES", margin, newY);
  newY += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Dividir observações em linhas
  const linhasObs = doc.splitTextToSize(proposta.observacoes, pageWidth - (margin * 2));
  
  // Verificar se as observações não ultrapassarão a página
  if (newY + (linhasObs.length * 5) > pageHeight - 60) {
    doc.addPage();
    newY = 40;
  }
  
  doc.text(linhasObs, margin, newY);
  newY += (linhasObs.length * 5) + 15;
  
  // Assinaturas
  const assinaturaY = pageHeight - 50;
  
  // Linha para assinatura do cliente
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, assinaturaY, pageWidth / 2 - 10, assinaturaY);
  doc.text("Assinatura do Cliente", margin, assinaturaY + 10);
  
  // Linha para assinatura da VDR
  doc.line(pageWidth / 2 + 10, assinaturaY, pageWidth - margin, assinaturaY);
  doc.text("Assinatura VDR", pageWidth / 2 + 10, assinaturaY + 10);
  
  // Rodapé
  const rodapeY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("VDR - Soluções em Vidro e Alumínio", pageWidth / 2, rodapeY, { align: "center" });
  
  // Salvar o PDF
  doc.save(`Proposta_${proposta.numero}.pdf`);
};
