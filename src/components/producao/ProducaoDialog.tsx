
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ProducaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: any;
}

export function ProducaoDialog({ isOpen, onOpenChange, ordem }: ProducaoDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    produto: "",
    quantidade: "",
    unidade: "pç",
    dataPrevisao: "",
    responsavel: "",
    status: "planejamento",
    progresso: 0,
    observacoes: ""
  });

  useEffect(() => {
    if (ordem) {
      setFormData({
        numero: ordem.numero || "",
        produto: ordem.produto || (ordem.produtos_acabados ? ordem.produtos_acabados.nome : ""),
        quantidade: ordem.quantidade?.toString() || "",
        unidade: ordem.unidade || (ordem.produtos_acabados ? ordem.produtos_acabados.unidade_medida : "pç"),
        dataPrevisao: ordem.dataPrevisao || ordem.data_previsao || "",
        responsavel: ordem.responsavel || "",
        status: ordem.status || "planejamento",
        progresso: ordem.progresso || 0,
        observacoes: ordem.observacoes || ""
      });
    }
  }, [ordem]);

  const handleSave = () => {
    toast.success("Ordem de produção atualizada com sucesso!");
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planejamento":
        return "bg-blue-100 text-blue-800";
      case "em_andamento":
        return "bg-amber-100 text-amber-800";
      case "aguardando":
        return "bg-purple-100 text-purple-800";
      case "concluido":
        return "bg-emerald-100 text-emerald-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  if (!ordem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Ordem de Produção" : "Detalhes da Ordem de Produção"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!isEditing ? (
            // Modo visualização
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Número da OP</Label>
                  <p className="text-lg font-semibold">{formData.numero}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className={getStatusColor(formData.status)}>
                      {formData.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Produto</Label>
                <p className="text-lg">{formData.produto}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Quantidade</Label>
                  <p className="text-lg">{formData.quantidade} {formData.unidade}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Responsável</Label>
                  <p className="text-lg">{formData.responsavel || "Não atribuído"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Progresso</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={formData.progresso} className="h-3 flex-1" />
                  <span className="text-sm font-medium">{formData.progresso}%</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Data de Previsão</Label>
                <p className="text-lg">{formatarData(formData.dataPrevisao)}</p>
              </div>

              {formData.observacoes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{formData.observacoes}</p>
                </div>
              )}
            </div>
          ) : (
            // Modo edição
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero">Número da OP</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="aguardando">Aguardando</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="produto">Produto</Label>
                <Input
                  id="produto"
                  value={formData.produto}
                  onChange={(e) => setFormData(prev => ({ ...prev, produto: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={formData.unidade} onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pç">Peças</SelectItem>
                      <SelectItem value="m²">m²</SelectItem>
                      <SelectItem value="m">Metros</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="L">Litros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="progresso">Progresso (%)</Label>
                  <Input
                    id="progresso"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progresso}
                    onChange={(e) => setFormData(prev => ({ ...prev, progresso: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dataPrevisao">Data de Previsão</Label>
                <Input
                  id="dataPrevisao"
                  type="date"
                  value={formData.dataPrevisao}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataPrevisao: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fechar
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  // Reset form data to original values
                  if (ordem) {
                    setFormData({
                      numero: ordem.numero || "",
                      produto: ordem.produto || (ordem.produtos_acabados ? ordem.produtos_acabados.nome : ""),
                      quantidade: ordem.quantidade?.toString() || "",
                      unidade: ordem.unidade || (ordem.produtos_acabados ? ordem.produtos_acabados.unidade_medida : "pç"),
                      dataPrevisao: ordem.dataPrevisao || ordem.data_previsao || "",
                      responsavel: ordem.responsavel || "",
                      status: ordem.status || "planejamento",
                      progresso: ordem.progresso || 0,
                      observacoes: ordem.observacoes || ""
                    });
                  }
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
