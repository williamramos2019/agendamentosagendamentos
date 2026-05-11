// Sistema de notificações push do navegador para o admin

const PERMISSION_KEY = "cleanpro_push_permission_v1";

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isNotificationSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  const result = await Notification.requestPermission();
  localStorage.setItem(PERMISSION_KEY, result);
  return result;
}

export interface AdminNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export function sendAdminNotification(payload: AdminNotificationPayload): boolean {
  if (!isNotificationSupported() || Notification.permission !== "granted") return false;
  try {
    const n = new Notification(payload.title, {
      body: payload.body,
      icon: "/placeholder.svg",
      badge: "/placeholder.svg",
      tag: payload.tag ?? "cleanpro-booking",
      data: payload.data,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return true;
  } catch (e) {
    console.error("Erro ao disparar notificação:", e);
    return false;
  }
}
