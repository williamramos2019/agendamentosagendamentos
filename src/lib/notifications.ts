import { PushService } from "@/services/PushService";

export const isNotificationSupported = () => "Notification" in window;
export const getNotificationPermission = () => Notification.permission;
export const requestNotificationPermission = () => PushService.requestPermission();

export interface AdminNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: any;
}

export function sendAdminNotification(payload: AdminNotificationPayload): boolean {
  PushService.send(payload.title, {
    body: payload.body,
    tag: payload.tag,
    data: payload.data
  });
  return true;
}
