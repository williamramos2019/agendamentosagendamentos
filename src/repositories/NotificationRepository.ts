import { BaseRepository } from "./BaseRepository";

export interface SystemNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export class NotificationRepository extends BaseRepository {
  async getAll(): Promise<SystemNotification[]> {
    try {
      const data = await this.fetchApi<any[]>("notifications");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(notification: Omit<SystemNotification, "id" | "createdAt" | "isRead">): Promise<SystemNotification> {
    try {
      const data = await this.fetchApi<any>("notifications_create", {
        method: "POST",
        body: JSON.stringify({
          type: notification.type,
          title: notification.title,
          message: notification.message
        }),
      });

      return this.mapToModel(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await this.fetchApi("notification_mark_read", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const data = await this.fetchApi<{ count: number }>("notification_unread_count");
      return data.count || 0;
    } catch (error) {
      return 0;
    }
  }

  private mapToModel(data: any): SystemNotification {
    return {
      id: String(data.id),
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: Boolean(Number(data.is_read)),
      createdAt: data.created_at
    };
  }
}

export const notificationRepository = new NotificationRepository();
