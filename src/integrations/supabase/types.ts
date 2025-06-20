export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          cnpj: string | null
          created_at: string | null
          email: string | null
          empresa: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      composicao_produtos: {
        Row: {
          created_at: string | null
          id: string
          insumo_id: string | null
          observacao: string | null
          produto_id: string | null
          quantidade: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          insumo_id?: string | null
          observacao?: string | null
          produto_id?: string | null
          quantidade: number
        }
        Update: {
          created_at?: string | null
          id?: string
          insumo_id?: string | null
          observacao?: string | null
          produto_id?: string | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "composicao_produtos_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "composicao_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos_acabados"
            referencedColumns: ["id"]
          },
        ]
      }
      insumos: {
        Row: {
          categoria: string
          codigo: string
          created_at: string | null
          data_cadastro: string
          descricao: string | null
          fornecedor: string | null
          id: string
          nome: string
          pode_ser_revendido: boolean | null
          quantidade_estoque: number
          unidade_medida: string
          updated_at: string | null
          valor_custo: number
        }
        Insert: {
          categoria: string
          codigo: string
          created_at?: string | null
          data_cadastro?: string
          descricao?: string | null
          fornecedor?: string | null
          id?: string
          nome: string
          pode_ser_revendido?: boolean | null
          quantidade_estoque?: number
          unidade_medida: string
          updated_at?: string | null
          valor_custo?: number
        }
        Update: {
          categoria?: string
          codigo?: string
          created_at?: string | null
          data_cadastro?: string
          descricao?: string | null
          fornecedor?: string | null
          id?: string
          nome?: string
          pode_ser_revendido?: boolean | null
          quantidade_estoque?: number
          unidade_medida?: string
          updated_at?: string | null
          valor_custo?: number
        }
        Relationships: []
      }
      movimentacoes_estoque: {
        Row: {
          created_at: string | null
          data_movimentacao: string | null
          id: string
          insumo_id: string | null
          motivo: string
          observacoes: string | null
          produto_id: string | null
          quantidade: number
          tipo: string
          usuario: string | null
        }
        Insert: {
          created_at?: string | null
          data_movimentacao?: string | null
          id?: string
          insumo_id?: string | null
          motivo: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade: number
          tipo: string
          usuario?: string | null
        }
        Update: {
          created_at?: string | null
          data_movimentacao?: string | null
          id?: string
          insumo_id?: string | null
          motivo?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade?: number
          tipo?: string
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos_acabados"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          data_previsao: string | null
          endereco: string
          id: string
          nome: string
          observacoes: string | null
          projeto_id: string | null
          status: Database["public"]["Enums"]["obra_status"]
          updated_at: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_previsao?: string | null
          endereco: string
          id?: string
          nome: string
          observacoes?: string | null
          projeto_id?: string | null
          status?: Database["public"]["Enums"]["obra_status"]
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_previsao?: string | null
          endereco?: string
          id?: string
          nome?: string
          observacoes?: string | null
          projeto_id?: string | null
          status?: Database["public"]["Enums"]["obra_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "obras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_producao: {
        Row: {
          created_at: string | null
          data_conclusao: string | null
          data_pedido: string
          data_previsao: string | null
          id: string
          numero: string
          observacoes: string | null
          produto_id: string | null
          quantidade: number
          status: Database["public"]["Enums"]["producao_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_conclusao?: string | null
          data_pedido?: string
          data_previsao?: string | null
          id?: string
          numero: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade: number
          status?: Database["public"]["Enums"]["producao_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_conclusao?: string | null
          data_pedido?: string
          data_previsao?: string | null
          id?: string
          numero?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade?: number
          status?: Database["public"]["Enums"]["producao_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_producao_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos_acabados"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_acabados: {
        Row: {
          categoria: string
          codigo: string
          created_at: string | null
          data_cadastro: string
          descricao: string | null
          id: string
          nome: string
          quantidade_estoque: number
          unidade_medida: string
          updated_at: string | null
          valor_base: number
        }
        Insert: {
          categoria: string
          codigo: string
          created_at?: string | null
          data_cadastro?: string
          descricao?: string | null
          id?: string
          nome: string
          quantidade_estoque?: number
          unidade_medida: string
          updated_at?: string | null
          valor_base?: number
        }
        Update: {
          categoria?: string
          codigo?: string
          created_at?: string | null
          data_cadastro?: string
          descricao?: string | null
          id?: string
          nome?: string
          quantidade_estoque?: number
          unidade_medida?: string
          updated_at?: string | null
          valor_base?: number
        }
        Relationships: []
      }
      projetos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          data_previsao: string | null
          id: string
          nome: string
          observacoes: string | null
          status: Database["public"]["Enums"]["projeto_status"]
          tipo: string
          updated_at: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_previsao?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["projeto_status"]
          tipo: string
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_previsao?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["projeto_status"]
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      proposta_custos: {
        Row: {
          created_at: string | null
          descricao: string
          diluido: boolean | null
          id: string
          proposta_id: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          descricao: string
          diluido?: boolean | null
          id?: string
          proposta_id?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          descricao?: string
          diluido?: boolean | null
          id?: string
          proposta_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposta_custos_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: false
            referencedRelation: "propostas"
            referencedColumns: ["id"]
          },
        ]
      }
      proposta_itens: {
        Row: {
          codigo: string
          created_at: string | null
          descricao: string
          id: string
          proposta_id: string | null
          quantidade: number
          unidade: string
          valor_original: number | null
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descricao: string
          id?: string
          proposta_id?: string | null
          quantidade: number
          unidade: string
          valor_original?: number | null
          valor_total: number
          valor_unitario: number
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: string
          proposta_id?: string | null
          quantidade?: number
          unidade?: string
          valor_original?: number | null
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposta_itens_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: false
            referencedRelation: "propostas"
            referencedColumns: ["id"]
          },
        ]
      }
      propostas: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data: string
          forma_pagamento: string | null
          id: string
          numero: string
          observacoes: string | null
          prazo_entrega: string | null
          prazo_obra: string | null
          status: Database["public"]["Enums"]["proposta_status"]
          updated_at: string | null
          validade: string | null
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data: string
          forma_pagamento?: string | null
          id?: string
          numero: string
          observacoes?: string | null
          prazo_entrega?: string | null
          prazo_obra?: string | null
          status?: Database["public"]["Enums"]["proposta_status"]
          updated_at?: string | null
          validade?: string | null
          valor_total?: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data?: string
          forma_pagamento?: string | null
          id?: string
          numero?: string
          observacoes?: string | null
          prazo_entrega?: string | null
          prazo_obra?: string | null
          status?: Database["public"]["Enums"]["proposta_status"]
          updated_at?: string | null
          validade?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "propostas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas_produtos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_venda: string
          id: string
          observacoes: string | null
          produto_id: string | null
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_venda?: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_venda?: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_produtos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos_acabados"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      obra_status: "planejamento" | "em_andamento" | "concluido" | "cancelado"
      producao_status: "pendente" | "em_andamento" | "concluido" | "cancelado"
      projeto_status:
        | "planejamento"
        | "em_andamento"
        | "concluido"
        | "cancelado"
      proposta_status:
        | "rascunho"
        | "enviada"
        | "aprovada"
        | "rejeitada"
        | "expirada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      obra_status: ["planejamento", "em_andamento", "concluido", "cancelado"],
      producao_status: ["pendente", "em_andamento", "concluido", "cancelado"],
      projeto_status: [
        "planejamento",
        "em_andamento",
        "concluido",
        "cancelado",
      ],
      proposta_status: [
        "rascunho",
        "enviada",
        "aprovada",
        "rejeitada",
        "expirada",
      ],
    },
  },
} as const
