import { getApiUrl } from "@/config/api";

export class AuthService {
  private static SESSION_KEY = "cleanpro_admin_session_v1";

  static async login(user: string, pass: string): Promise<boolean> {
    try {
      // 1. Tentar autenticação via API PHP
      const response = await fetch(getApiUrl('login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.trim(), pass })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem(this.SESSION_KEY, "true");
          return true;
        }
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
      // Fallback para login fixo mesmo com erro de rede se estiver em dev
      const ADMIN_USER = "proclean@2026";
      const ADMIN_PASS = "limpeza@2026";
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(this.SESSION_KEY, "true");
        return true;
      }
      return false;
    }
  }

  static logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem(this.SESSION_KEY) === "true";
  }
}
