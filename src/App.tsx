
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Cadastros from './pages/Cadastros';
import Clientes from './pages/Clientes';
import ProdutosAcabados from './pages/ProdutosAcabados';
import Estoque from './pages/Estoque';
import Orcamentos from './pages/Orcamentos';
import NovoOrcamento from './pages/NovoOrcamento';
import VisualizarOrcamento from './pages/VisualizarOrcamento';
import Projetos from './pages/Projetos';
import Obras from './pages/Obras';
import Producao from './pages/Producao';
import Financeiro from './pages/Financeiro';
import Atendimento from './pages/Atendimento';
import Relatorios from './pages/Relatorios';
import AccessRequests from './pages/AccessRequests';
import Configuracoes from './pages/Configuracoes';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import PlaceholderPage from './pages/PlaceholderPage';

// Toaster
import { Toaster } from './components/ui/sonner';

import './App.css';

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout><Outlet /></AppLayout>}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cadastros" element={<Cadastros />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="produtos" element={<ProdutosAcabados />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="orcamentos" element={<Orcamentos />} />
            <Route path="novo-orcamento" element={<NovoOrcamento />} />
            <Route path="orcamentos/:id" element={<VisualizarOrcamento />} />
            <Route path="projetos" element={<Projetos />} />
            <Route path="obras" element={<Obras />} />
            <Route path="producao" element={<Producao />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="atendimento" element={<Atendimento />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="access" element={<AccessRequests />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
