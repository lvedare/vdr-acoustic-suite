
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { Proposta } from "@/types/orcamento";
import { toast } from "sonner";

interface PropostasExportButtonProps {
  propostas: Proposta[];
}

const PropostasExportButton = ({ propostas }: PropostasExportButtonProps) => {
  const handleExportExcel = () => {
    toast.info("Exportando relatório em Excel...", {
      description: "O download começará em instantes.",
    });
    
    setTimeout(() => {
      toast.success("Relatório Excel gerado com sucesso!");
    }, 2000);
  };

  const handleExportPDF = () => {
    toast.info("Exportando relatório em PDF...", {
      description: "O download começará em instantes.",
    });
    
    setTimeout(() => {
      toast.success("Relatório PDF gerado com sucesso!");
    }, 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar ({propostas.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border shadow-md">
        <DropdownMenuItem onClick={handleExportExcel}>
          Exportar para Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          Exportar para PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PropostasExportButton;
