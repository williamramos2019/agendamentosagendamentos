/**
 * Registro do service worker e helpers de notificação.
 *
 * IMPORTANT: o SW NUNCA é registrado dentro de iframes ou hosts de preview do
 * Lovable (evita cache poluído na edição). Em produção (build publicado) o SW
 * é registrado normalmente.
 */

const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("id-preview--") ||
    window.location.hostname.includes("lovableproject.com") ||
    window.location.hostname.includes("lovable.app"));

export function shouldRegisterPWA(): boolean {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;
  if (isInIframe) return false;
  if (isPreviewHost) return false;
  if (!import.meta.env.PROD) return false;
  return true;
}

export async function registerPWA() {
  // Em preview/iframe: limpa qualquer SW antigo que tenha sobrado
  if (!shouldRegisterPWA()) {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      regs.forEach((r) => r.unregister());
    }
    return;
  }

  try {
    const { registerSW } = await import("virtual:pwa-register");
    registerSW({ immediate: true });
  } catch (err) {
    console.warn("[PWA] register failed", err);
  }
}

// =============== Notificações ===============

export type NotificationPermissionState =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window))
    return "unsupported";
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === "undefined" || !("Notification" in window))
    return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result as NotificationPermissionState;
}

export async function showNotification(
  title: string,
  options?: NotificationOptions,
) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const opts: NotificationOptions = {
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    lang: "pt-BR",
    ...options,
  };

  // Preferir SW (funciona em background no Android)
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.showNotification(title, opts);
      return;
    }
  }
  new Notification(title, opts);
}

// Lembrete local agendado via setTimeout (válido enquanto a aba viver).
// Ideal para confirmações imediatas (ex.: "agendamento criado") e
// lembretes curtos (até algumas horas antes do serviço).
export function scheduleLocalReminder(
  title: string,
  body: string,
  whenMs: number,
) {
  const delay = whenMs - Date.now();
  if (delay <= 0) {
    void showNotification(title, { body });
    return;
  }
  // Limita a 24h por segurança
  const safeDelay = Math.min(delay, 24 * 60 * 60 * 1000);
  setTimeout(() => {
    void showNotification(title, { body });
  }, safeDelay);
}
