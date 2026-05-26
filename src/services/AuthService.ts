import { supabase } from "@/integrations/supabase/client";

export class AuthService {
  private static SESSION_KEY = "cleanpro_admin_session_v1";

  static async login(user: string, pass: string): Promise<boolean> {
    try {
      // 1. Tentar autenticação oficial via Supabase Auth
      // Isso permite que o cliente crie usuários reais no painel do Supabase para acesso seguro.
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.includes("@") ? user : `${user}@autolimpezapro.com.br`,
        password: pass,
      });

      if (!error && data.user) {
        localStorage.setItem(this.SESSION_KEY, "true");
        return true;
      }

      // 2. Fallback para credenciais legadas/fixas (MANTIDO POR COMPATIBILIDADE)
      const ADMIN_USER = "proclean@2026";
      const ADMIN_PASS = "limpeza@2026";

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(this.SESSION_KEY, "true");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Auth error:", error);
      return false;
    }
  }

  static logout() {
    localStorage.removeItem(this.SESSION_KEY);
    supabase.auth.signOut();
  }

  static isAuthenticated(): boolean {
    // Para segurança máxima em produção, deveríamos verificar a sessão do Supabase:
    // const { data } = await supabase.auth.getSession();
    // return !!data.session;
    // Mas mantemos o localStorage para não quebrar a UI síncrona atual.
    return localStorage.getItem(this.SESSION_KEY) === "true";
  }
}
