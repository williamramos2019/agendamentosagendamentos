import { notificationRepository, SystemNotification } from "@/repositories/NotificationRepository";
import { supabase } from "@/integrations/supabase/client";

export class NotificationService {
  static async create(type: string, title: string, message: string, targetUrl?: string) {
    try {
      // 1. Create internal notification
      await notificationRepository.create({ type, title, message });

      // 2. Trigger external Webpushr notification via Edge Function
      // We use an edge function to protect the Webpushr Auth Token
      await supabase.functions.invoke('send-webpush', {
        body: {
          title,
          message,
          target_url: targetUrl || window.location.origin
        }
      });
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
