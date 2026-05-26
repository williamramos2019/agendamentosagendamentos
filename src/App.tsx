import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bairro/:city/:neighborhood" element={<Index />} />
          <Route path="/mapa-do-site" element={<Index />} />
          <Route path="/blog" element={<Index />} />
          <Route path="/blog/:slug" element={<Index />} />
          <Route path="/dicas" element={<Index />} />
          <Route path="/dicas/:slug" element={<Index />} />
          <Route path="/meu-agendamento" element={<Index />} />
          <Route path="/admin" element={<Index />} />
          <Route path="/admin/blog" element={<Index />} />
          <Route path="/agenda" element={<Index />} />
          <Route path="/caixa" element={<Index />} />
          <Route path="/vendas" element={<Index />} />
          <Route path="/perfil" element={<Index />} />
          <Route path="/financas" element={<Index />} />
          <Route path="/analytics" element={<Index />} />
          <Route path="/leads" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
