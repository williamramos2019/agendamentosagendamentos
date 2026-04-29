import { ArrowLeft, Calendar, Wallet, ShoppingBag, BarChart3, User, LogOut, ShieldCheck } from "lucide-react";
import { adminLogout } from "./AdminLogin";
import { toast } from "sonner";

interface AdminPanelProps {
  onBack: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  stats: {
    totalAppointments: number;
    pendingAppointments: number;
    todaySales: number;
  };
}

export function AdminPanel({ onBack, onNavigate, onLogout, stats }: AdminPanelProps) {
  const modules = [
    { icon: Calendar, label: "Agenda", desc: "Agendamentos e horários", path: "/agenda", color: "from-primary to-primary-glow" },
    { icon: Wallet, label: "Caixa", desc: "Abertura, fechamento e movimentos", path: "/caixa", color: "from-success to-emerald-400" },
    { icon: ShoppingBag, label: "Histórico de vendas", desc: "Vendas realizadas", path: "/vendas", color: "from-amber-500 to-orange-400" },
    { icon: BarChart3, label: "Finanças", desc: "Receitas e despesas", path: "/financas", color: "from-violet-500 to-fuchsia-500" },
    { icon: User, label: "Perfil da empresa", desc: "Dados, equipe e configurações", path: "/perfil", color: "from-cyan-500 to-blue-500" },
  ];

  const handleLogout = () => {
    adminLogout();
    toast.success("Sessão encerrada");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-base text-foreground">Painel administrativo</h1>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition"
            aria-label="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-card border border-border p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.totalAppointments}</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Agendamentos</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-3 text-center">
            <p className="text-2xl font-bold text-warning">{stats.pendingAppointments}</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Pendentes</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-3 text-center">
            <p className="text-2xl font-bold text-success">{stats.todaySales}</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Vendas hoje</p>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Módulos</h2>
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.path}
                onClick={() => onNavigate(m.path)}
                className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center gap-4 text-left active:scale-[0.99]"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0 shadow-salon`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
