import { useState } from "react";
import { ArrowLeft, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ADMIN_USER = "proclean@2026";
const ADMIN_PASS = "limpeza@2026";
const SESSION_KEY = "cleanpro_admin_session_v1";

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      toast.error("Muitas tentativas", { description: "Aguarde alguns minutos antes de tentar novamente." });
      return;
    }
    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      toast.success("Bem-vindo, administrador");
      onSuccess();
    } else {
      setAttempts((a) => a + 1);
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-background flex flex-col animate-fade-in">
      <header className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-base text-foreground">Acesso administrativo</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-salon-lg">
              <ShieldCheck className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Painel Auto Limpeza Pro</h2>
            <p className="text-muted-foreground mt-2 text-sm">Área restrita à administração</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label htmlFor="adm-user" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <User className="h-4 w-4" /> Usuário
              </label>
              <input
                id="adm-user"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="off"
                maxLength={64}
                className="w-full p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="usuário"
              />
            </div>

            <div>
              <label htmlFor="adm-pass" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4" /> Senha
              </label>
              <div className="relative">
                <input
                  id="adm-pass"
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="off"
                  maxLength={64}
                  className="w-full p-4 pr-12 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!user || !pass}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-salon disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              Entrar no painel
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}
