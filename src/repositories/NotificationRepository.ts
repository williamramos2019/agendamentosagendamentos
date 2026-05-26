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
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async create(notification: Omit<SystemNotification, "id" | "createdAt" | "isRead">): Promise<SystemNotification> {
    const { data, error } = await this.supabase
      .from("notifications")
      .insert({
        type: notification.type,
        title: notification.title,
        message: notification.message
      })
      .select()
      .single();

    this.handleError(error);
    return this.mapToModel(data);
  }

  async markAsRead(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    this.handleError(error);
  }

  async getUnreadCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("*", { count: 'exact', head: true })
      .eq("is_read", false);

    this.handleError(error);
    return count || 0;
  }

  private mapToModel(data: any): SystemNotification {
    return {
      id: data.id,
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: data.is_read,
      createdAt: data.created_at
    };
  }
}

export const notificationRepository = new NotificationRepository();
