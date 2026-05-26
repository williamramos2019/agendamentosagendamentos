import { getApiUrl } from "@/config/api";
import { NotificationService } from "./NotificationService";
import { format, addDays } from "date-fns";

export class ReminderService {
  static async checkAndRun() {
    try {
      // 1. Check if already ran today via PHP API
      const today = format(new Date(), "yyyy-MM-dd");
      
      const response = await fetch(getApiUrl('reminder_status'));
      if (!response.ok) return;
      
      const config = await response.json();
      if (config?.last_run === today) return;

      // 2. Trigger reminders via PHP API
      const runResponse = await fetch(getApiUrl('run_reminders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ today })
      });

      if (runResponse.ok) {
        // console.log("Daily reminders finished and last_run updated via PHP.");
      }
    } catch (err) {
      console.error("Reminder service failed:", err);
    }
  }
}
