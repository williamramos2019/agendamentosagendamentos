import { notificationRepository, SystemNotification } from "@/repositories/NotificationRepository";
import { getApiUrl } from "@/config/api";

export class NotificationService {
  static async create(type: string, title: string, message: string, targetUrl?: string) {
    try {
      // 1. Create internal notification
      await notificationRepository.create({ type, title, message });

      // 2. Trigger external push via PHP API (usando action=pushalert conforme solicitado)
      fetch(getApiUrl('pushalert'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          target_url: targetUrl || window.location.origin
        })
      }).catch(err => console.error("Push API failed:", err));
      
    } catch (error) {
      console.error("Failed to process notification:", error);
    }
  }

  static async list(): Promise<SystemNotification[]> {
    return await notificationRepository.getAll();
  }

  static async markAsRead(id: string) {
    await notificationRepository.markAsRead(id);
  }

  static async getUnreadCount(): Promise<number> {
    return await notificationRepository.getUnreadCount();
  }
}
