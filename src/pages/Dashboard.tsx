
import React from "react";
import { Badge } from "@/components/ui/badge";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SupabaseTestPanel from "@/components/supabase/SupabaseTestPanel";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Integrado com Supabase
        </Badge>
      </div>

      {/* Métricas principais */}
      <DashboardMetrics />

      {/* Gráficos dinâmicos */}
      <DashboardCharts />

      {/* Painel de teste do Supabase */}
      <SupabaseTestPanel />
    </div>
  );
};

export default Dashboard;
