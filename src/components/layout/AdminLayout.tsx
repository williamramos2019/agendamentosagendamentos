import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { adminLogout } from "@/components/admin/AdminLogin";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
}

export function AdminLayout({ children, title, showBack = true }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminLogout();
    toast.success("Sessão encerrada");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
          <div className="flex items-center gap-3 px-4 py-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex-1 flex items-center gap-2">
              {!showBack && <ShieldCheck className="h-5 w-5 text-primary" />}
              <h1 className="font-bold text-base text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition"
                aria-label="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
