import { useState, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Calendar, Wallet, Users, LayoutDashboard, Settings } from "lucide-react";
import { Toaster } from "sonner";

// Placeholders dos Módulos Originais
const SmartHome = ({ onNavigate }: any) => (
  <div className="p-5 pt-20 space-y-8 pb-32">
    <div className="flex items-center gap-3">
      <ShieldCheck className="text-primary w-8 h-8" />
      <h1 className="text-2xl font-black uppercase">CleanPro Smart</h1>
    </div>
    <div className="bg-primary p-1 rounded-3xl" onClick={() => onNavigate("/agenda")}>
       <div className="bg-[#090F15] p-8 rounded-[1.4rem] text-center space-y-4">
          <Calendar className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Agendar Higienização</h2>
       </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 p-6 rounded-3xl space-y-3" onClick={() => onNavigate("/vendas")}>
        <Wallet className="w-6 h-6 text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Vendas</p>
      </div>
      <div className="bg-white/5 p-6 rounded-3xl space-y-3" onClick={() => onNavigate("/leads")}>
        <Users className="w-6 h-6 text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Leads</p>
      </div>
    </div>
  </div>
);

const GenericModule = ({ title, onBack }: any) => (
  <div className="p-5 pt-20 space-y-8">
    <button onClick={onBack} className="text-primary font-bold uppercase text-xs">← Voltar</button>
    <h1 className="text-3xl font-black uppercase">{title}</h1>
    <div className="bg-white/5 p-10 rounded-3xl text-center text-white/20 uppercase font-black tracking-widest">
      Módulo em Restauração
    </div>
  </div>
);

const queryClient = new QueryClient();

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const { theme } = useAppState();
  const { profile } = useProfileSettings();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const renderContent = () => {
    switch (currentPath) {
      case "/": return <SmartHome onNavigate={setCurrentPath} />;
      case "/agenda": return <GenericModule title="Agenda" onBack={() => setCurrentPath("/")} />;
      case "/vendas": return <GenericModule title="Vendas" onBack={() => setCurrentPath("/")} />;
      case "/caixa": return <GenericModule title="Caixa" onBack={() => setCurrentPath("/")} />;
      case "/financas": return <GenericModule title="Finanças" onBack={() => setCurrentPath("/")} />;
      case "/leads": return <GenericModule title="Leads" onBack={() => setCurrentPath("/")} />;
      case "/perfil": return <GenericModule title="Perfil" onBack={() => setCurrentPath("/")} />;
      default: return <SmartHome onNavigate={setCurrentPath} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#090F15] text-white selection:bg-primary selection:text-white">
        <Toaster position="top-center" richColors />
        
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

        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
          <button onClick={() => setCurrentPath("/")} className={`flex flex-col items-center gap-1 ${currentPath === "/" ? "text-primary" : "text-white/40"}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase">Home</span>
          </button>
          <button onClick={() => setCurrentPath("/agenda")} className={`flex flex-col items-center gap-1 ${currentPath === "/agenda" ? "text-primary" : "text-white/40"}`}>
            <Calendar className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase">Agenda</span>
          </button>
          <button onClick={() => setCurrentPath("/caixa")} className={`flex flex-col items-center gap-1 ${currentPath === "/caixa" ? "text-primary" : "text-white/40"}`}>
            <Wallet className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase">Caixa</span>
          </button>
          <button onClick={() => setCurrentPath("/perfil")} className={`flex flex-col items-center gap-1 ${currentPath === "/perfil" ? "text-primary" : "text-white/40"}`}>
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase">Perfil</span>
          </button>
        </nav>
      </div>
    </QueryClientProvider>
  );
}
