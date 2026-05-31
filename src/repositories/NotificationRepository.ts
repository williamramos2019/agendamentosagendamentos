import { BaseRepository } from "./BaseRepository";

export class NotificationRepository extends BaseRepository {
  static async getAll() {
    return this.fetchAPI('notifications');
  }

  static async markAsRead(id: string) {
    return this.fetchAPI(`notifications&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_read: true })
    });
  }

  static async delete(id: string) {
    return this.fetchAPI(`notifications&id=${id}`, {
      method: 'DELETE'
    });
  }
}

export const notificationRepository = NotificationRepository;
