
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Material } from "@/types/estoque";

interface EstoqueBaixoAlertProps {
  materiaisBaixos: Material[];
}

export const EstoqueBaixoAlert = ({ materiaisBaixos }: EstoqueBaixoAlertProps) => {
  const navigate = useNavigate();
  
  // Ensure materiaisBaixos is always an array to prevent "length" of undefined errors
  const itensComBaixoEstoque = materiaisBaixos || [];
  
  return (
    <div className="mt-4">
      {itensComBaixoEstoque.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex gap-4 items-center">
            <div className="rounded-full bg-amber-100 p-2">
              <AlertCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800">Atenção para Estoque Baixo</h3>
              <p className="text-sm text-amber-700">
                {itensComBaixoEstoque.length} itens estão abaixo do estoque mínimo recomendado.
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-amber-800 font-semibold"
                  onClick={() => navigate("/financeiro")}
                >
                  É recomendável fazer uma nova compra.
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
