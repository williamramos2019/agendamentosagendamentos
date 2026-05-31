import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AgendaPage = lazy(() => import("./pages/admin/AgendaPage"));
const CaixaPage = lazy(() => import("./pages/admin/CaixaPage"));
const VendasPage = lazy(() => import("./pages/admin/VendasPage"));
const PerfilPage = lazy(() => import("./pages/admin/PerfilPage"));
const FinancasPage = lazy(() => import("./pages/admin/FinancasPage"));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage"));
const StockPage = lazy(() => import("./pages/admin/StockPage"));
const EPIPage = lazy(() => import("./pages/admin/EPIPage"));
const CollaboratorsPage = lazy(() => import("./pages/admin/CollaboratorsPage"));
const StockHistoryPage = lazy(() => import("./pages/admin/StockHistoryPage"));
const SiteMapPage = lazy(() => import("./pages/SiteMapPage"));
const NeighborhoodPage = lazy(() => import("./pages/NeighborhoodPage"));
const ClientAppointmentPage = lazy(() => import("./pages/ClientAppointmentPage"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/legal/TermsOfUse"));
const FAQ = lazy(() => import("./pages/legal/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
              <Route path="/caixa" element={<ProtectedRoute><CaixaPage /></ProtectedRoute>} />
              <Route path="/vendas" element={<ProtectedRoute><VendasPage /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
              <Route path="/financas" element={<ProtectedRoute><FinancasPage /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
              <Route path="/estoque" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
              <Route path="/epi" element={<ProtectedRoute><EPIPage /></ProtectedRoute>} />
              <Route path="/colaboradores" element={<ProtectedRoute><CollaboratorsPage /></ProtectedRoute>} />
              <Route path="/historico-estoque" element={<ProtectedRoute><StockHistoryPage /></ProtectedRoute>} />
              <Route path="/mapa-do-site" element={<SiteMapPage />} />
              <Route path="/bairro/:city/:neighborhood" element={<NeighborhoodPage />} />
              <Route path="/meu-agendamento" element={<ClientAppointmentPage />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos-de-uso" element={<TermsOfUse />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
