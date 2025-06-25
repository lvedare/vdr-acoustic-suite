
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orcamentos from "./pages/Orcamentos";
import NovoOrcamento from "./pages/NovoOrcamento";
import Clientes from "./pages/Clientes";
import Atendimento from "./pages/Atendimento";
import ProdutosAcabados from "./pages/ProdutosAcabados";
import Estoque from "./pages/Estoque";
import Producao from "./pages/Producao";
import Cronograma from "./pages/Cronograma";
import Obras from "./pages/Obras";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import AccessRequests from "./pages/AccessRequests";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Cadastros from "./pages/Cadastros";
import { Outlet } from "react-router-dom";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AppLayout><Outlet /></AppLayout>}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orcamentos" element={<Orcamentos />} />
                <Route path="novo-orcamento" element={<NovoOrcamento />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="atendimento" element={<Atendimento />} />
                <Route path="produtos" element={<ProdutosAcabados />} />
                <Route path="estoque" element={<Estoque />} />
                <Route path="producao" element={<Producao />} />
                <Route path="cronograma" element={<Cronograma />} />
                <Route path="obras" element={<Obras />} />
                <Route path="financeiro" element={<Financeiro />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="solicitacoes-acesso" element={<AccessRequests />} />
                <Route path="cadastros" element={<Cadastros />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
