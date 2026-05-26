import { supabase } from "@/integrations/supabase/client";
import { NotificationService } from "./NotificationService";
import { format, addDays } from "date-fns";

export class ReminderService {
  static async checkAndRun() {
    try {
      // 1. Check if already ran today
      const today = format(new Date(), "yyyy-MM-dd");
      
      const { data: config, error: configError } = await supabase
        .from("site_config")
        .select("config_value")
        .eq("config_key", "last_reminder_run")
        .single();

      if (configError && configError.code !== "PGRST116") {
        console.error("Error fetching last_reminder_run:", configError);
        return;
      }

      if (config?.config_value === today) {
        // Already ran today
        return;
      }

      console.log("Running daily reminders...");

      // 2. Find appointments for tomorrow
      const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
      
      const { data: appointments, error: apptError } = await supabase
        .from("appointments")
        .select("*")
        .eq("date", tomorrow)
        .eq("status", "confirmed");

      if (apptError) {
        console.error("Error fetching tomorrow's appointments:", apptError);
        return;
      }

      if (appointments && appointments.length > 0) {
        for (const appt of appointments) {
          const token = appt.access_token;
          const time = appt.time.slice(0, 5);
          const clientName = appt.client_name;
          
          const title = "⏰ Lembrete de agendamento";
          const message = `Olá ${clientName}, você tem um agendamento amanhã às ${time}`;
          const url = `${window.location.origin}/meu-agendamento?token=${token}&action=appointment/view`;

          await NotificationService.create("reminder", title, message, url);
          console.log(`Reminder sent to ${clientName} for ${tomorrow} at ${time}`);
        }
      }

      // 3. Update last run date
      const { error: updateError } = await supabase
        .from("site_config")
        .upsert({ config_key: "last_reminder_run", config_value: today }, { onConflict: 'config_key' });

      if (updateError) {
        console.error("Error updating last_reminder_run:", updateError);
      } else {
        console.log("Daily reminders finished and last_run updated.");
      }
    } catch (err) {
      console.error("Reminder service failed:", err);
    }
  }
}
