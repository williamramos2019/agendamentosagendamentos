import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import {
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  type NotificationPermissionState,
} from "@/lib/pwa";

const DISMISS_KEY = "cleanpro_notif_banner_dismissed_v1";

export function NotificationsBanner() {
  const [permission, setPermission] = useState<NotificationPermissionState>("default");
  const [dismissed, setDismissed] = useState<boolean>(
    () => localStorage.getItem(DISMISS_KEY) === "1",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  if (permission === "unsupported" || permission === "granted" || permission === "denied")
    return null;
  if (dismissed) return null;

  const handleEnable = async () => {
    setLoading(true);
    const result = await requestNotificationPermission();
    setPermission(result);
    setLoading(false);
    if (result === "granted") {
      void showNotification("Notificações ativadas! 🔔", {
        body: "Você receberá lembretes dos seus agendamentos.",
      });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="mx-5 mt-3 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/30 p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
        <Bell className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">
          Ative as notificações
        </p>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Receba lembretes do seu agendamento e promoções da região.
        </p>
      </div>
      <button
        onClick={handleEnable}
        disabled={loading}
        className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shrink-0 disabled:opacity-50"
      >
        {loading ? "..." : "Ativar"}
      </button>
      <button
        onClick={handleDismiss}
        className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center shrink-0"
        aria-label="Dispensar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function NotificationsBannerCompact() {
  // Variante alternativa, sem ícone fechar (caso queira inserir em outra tela)
  const permission = getNotificationPermission();
  if (permission !== "default") return null;
  return (
    <button
      onClick={() => requestNotificationPermission()}
      className="text-xs text-primary inline-flex items-center gap-1"
    >
      <BellOff className="h-3 w-3" /> Ativar notificações
    </button>
  );
}
