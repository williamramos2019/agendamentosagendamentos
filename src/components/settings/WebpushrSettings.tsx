import { useState, useEffect } from "react";
import { Globe, ShieldCheck, Save, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function WebpushrSettings() {
  const [key, setKey] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("config_key, config_value")
          .in("config_key", ["webpushr_key", "webpushr_auth_token"]);

        if (error) throw error;

        const keyVal = data.find(c => c.config_key === "webpushr_key")?.config_value;
        const tokenVal = data.find(c => c.config_key === "webpushr_auth_token")?.config_value;

        setKey(typeof keyVal === 'string' ? keyVal : "");
        setToken(typeof tokenVal === 'string' ? tokenVal : "");
      } catch (error) {
        console.error("Error loading webpushr config:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        { config_key: "webpushr_key", config_value: key },
        { config_key: "webpushr_auth_token", config_value: token }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("site_config")
          .upsert(update, { onConflict: "config_key" });
        if (error) throw error;
      }

      toast.success("Configurações do Webpushr salvas!", {
        description: "As notificações push estão agora ativas."
      });
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-xs text-muted-foreground">Carregando configurações...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Configuração Webpushr
        </h3>
        <a 
          href="https://www.webpushr.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-primary flex items-center gap-1 hover:underline"
        >
          Acessar Painel <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Globe className="h-3.5 w-3.5" /> Key (API Key)
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Webpushr Key"
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Auth Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Webpushr Auth Token"
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}
