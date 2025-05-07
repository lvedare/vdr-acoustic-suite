
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Atendimento from "./pages/Atendimento";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import AccessRequests from "./pages/AccessRequests";
import Orcamentos from "./pages/Orcamentos";
import NovoOrcamento from "./pages/NovoOrcamento";
import Clientes from "./pages/Clientes";

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  
  // If not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If requiredRole is specified and user doesn't have the role, redirect to dashboard
  if (requiredRole && userRole && !requiredRole.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to prevent flash of login screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-vdr-blue">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-md bg-vdr-red p-3">
              <span className="text-2xl font-bold text-white">VDR</span>
            </div>
          </div>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-blue-200">
            <div className="animate-pulse h-full w-full bg-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/atendimento"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Atendimento />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orcamentos"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Orcamentos />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orcamentos/novo"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NovoOrcamento />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Clientes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/producao"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projetos"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estoque"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/obras"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/financeiro"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadastros"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlaceholderPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Rota para solicitações de acesso (apenas Administrador) */}
            <Route
              path="/solicitacoes-acesso"
              element={
                <ProtectedRoute requiredRole={["administrador"]}>
                  <AppLayout>
                    <AccessRequests />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <LogoutRoute />
              }
            />
            
            {/* Catch-all route for 404 */}
            <Route
              path="*"
              element={
                <AppLayout>
                  <NotFound />
                </AppLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Logout route component
const LogoutRoute = () => {
  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  }, []);

  return null;
};

export default App;
