import { Link, Routes, Route, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  BarChart3,
  LogOut,
  Sparkles
} from "lucide-react";
import { RequireAdmin } from "./RequireAdmin";
import { supabase } from "@/integrations/supabase/client";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Calendar, label: "Agendamentos", path: "/admin/appointments" },
  { icon: BookOpen, label: "Blog", path: "/admin/blog" },
  { icon: Sparkles, label: "Gerador IA", path: "/admin/blog/generate" },
  { icon: MessageSquare, label: "Chatbot", path: "/admin/chat" },
  { icon: Settings, label: "Configurações", path: "/admin/config" },
];

export default function AdminLayout() {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-[#090F15] flex text-white font-sans">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-black/20 flex flex-col sticky top-0 h-screen">
          <div className="p-8">
            <h1 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
                <Settings className="w-5 h-5" />
              </div>
              Admin Pro
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${active ? "bg-primary text-black" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-12 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            {/* Outras sub-rotas admin virão em seguida */}
            <Route path="*" element={<div className="text-white/20 uppercase font-black text-4xl">Em breve...</div>} />
          </Routes>
        </main>
      </div>
    </RequireAdmin>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Visão Geral</p>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Bem-vindo, Administrador</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Novos Leads", value: "12", trend: "+20%", color: "bg-blue-500" },
          { label: "Agendamentos", value: "48", trend: "+5%", color: "bg-emerald-500" },
          { label: "Visitas Únicas", value: "1.2k", trend: "+12%", color: "bg-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-black text-white">{stat.value}</p>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}