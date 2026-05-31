import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/admin");
    } catch (error: any) {
      toast.error("Erro no login", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090F15] flex items-center justify-center p-5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 space-y-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-black mx-auto mb-6 shadow-lg shadow-primary/20">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-none">Acesso Restrito</h1>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Painel Administrativo Auto Limpeza Pro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">E-mail Corporativo</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-primary/50" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-primary/50" 
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
          >
            {loading ? "Autenticando..." : "Entrar no Sistema"}
            <LogIn className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <p className="text-[9px] text-center text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
          Proteção SSL Ativa • Sistema de Auditoria Interna
        </p>
      </motion.div>
    </div>
  );
}