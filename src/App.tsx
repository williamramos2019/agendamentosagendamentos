import { useState, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Módulos Legados (Placeholders para restauração incremental)
const SmartHome = () => <div className="p-10 text-white">Smart Home Original</div>;
const VendasPage = () => <div className="p-10 text-white">Módulo de Vendas</div>;
const CaixaPage = () => <div className="p-10 text-white">Módulo de Caixa</div>;
const PerfilPage = () => <div className="p-10 text-white">Módulo de Perfil</div>;
const FinancasPage = () => <div className="p-10 text-white">Módulo de Finanças</div>;
const AgendaPage = () => <div className="p-10 text-white">Módulo de Agenda</div>;

const queryClient = new QueryClient();

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const { theme } = useAppState();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const renderContent = () => {
    switch (currentPath) {
      case "/": return <SmartHome />;
      case "/vendas": return <VendasPage />;
      case "/caixa": return <CaixaPage />;
      case "/perfil": return <PerfilPage />;
      case "/financas": return <FinancasPage />;
      case "/agenda": return <AgendaPage />;
      default: return <SmartHome />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#090F15] text-white selection:bg-primary selection:text-white overflow-x-hidden">
        <Toaster />
        <Sonner position="top-center" richColors />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Barra de Navegação Inferior Original (Placeholder) */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
          <button onClick={() => setCurrentPath("/")} className={`p-2 ${currentPath === "/" ? "text-primary" : "text-white/40"}`}>Home</button>
          <button onClick={() => setCurrentPath("/agenda")} className={`p-2 ${currentPath === "/agenda" ? "text-primary" : "text-white/40"}`}>Agenda</button>
          <button onClick={() => setCurrentPath("/caixa")} className={`p-2 ${currentPath === "/caixa" ? "text-primary" : "text-white/40"}`}>Caixa</button>
          <button onClick={() => setCurrentPath("/perfil")} className={`p-2 ${currentPath === "/perfil" ? "text-primary" : "text-white/40"}`}>Perfil</button>
        </div>
      </div>
    </QueryClientProvider>
  );
}
