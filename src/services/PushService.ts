import { toast } from "sonner";

export class PushService {
  static async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta notificações desktop");
      return "denied";
    }

    if (Notification.permission === "granted") return "granted";

    return await Notification.requestPermission();
  }

  static send(title: string, options?: NotificationOptions) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/logo.png",
        ...options,
      });
    } else {
      toast(title, {
        description: options?.body,
      });
    }
  }
}
