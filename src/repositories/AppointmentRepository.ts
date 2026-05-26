import { BaseRepository } from "./BaseRepository";
import { Appointment } from "@/core/types";
import { NotificationService } from "@/services/NotificationService";

export class AppointmentRepository extends BaseRepository {
  async getAll(): Promise<Appointment[]> {
    try {
      const data = await this.fetchApi<any[]>("appointments");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    try {
      const accessToken = crypto.randomUUID().replace(/-/g, "");
      
      const data = await this.fetchApi<any>("appointments_create", {
        method: "POST",
        body: JSON.stringify({
          client_name: appointment.client,
          client_phone: appointment.phone,
          client_address: appointment.address,
          services: appointment.services,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          employee: appointment.employee,
          duration: appointment.duration,
          latitude: appointment.customerLatitude,
          longitude: appointment.customerLongitude,
          access_token: accessToken
        }),
      });

      const result = this.mapToModel(data);

      // Notify Admin
      NotificationService.create(
        "appointment",
        "📅 Novo agendamento recebido!",
        `${result.client} agendou ${result.services.join(", ")} para ${result.date} às ${result.time}`,
        "/agenda"
      );

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getByToken(token: string): Promise<Appointment | null> {
    try {
      const data = await this.fetchApi<any>(`appointment_by_token&token=${token}`);
      return data ? this.mapToModel(data) : null;
    } catch (error) {
      console.error("Token lookup failed", error);
      return null;
    }
  }

  async updateStatus(id: string, status: Appointment["status"]): Promise<void> {
    try {
      await this.fetchApi("appointment_update_status", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      });

      // Notify status change
      let title = "";
      let message = "";
      
      if (status === "confirmed") {
        title = "✅ Agendamento confirmado!";
        message = "Um agendamento foi marcado como confirmado.";
      } else if (status === "completed") {
        title = "🎉 Serviço finalizado!";
        message = "Um serviço foi concluído com sucesso.";
      }

      if (title) {
        NotificationService.create("appointment", title, message, "/agenda");
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private mapToModel(data: any): Appointment {
    return {
      id: String(data.id),
      time: data.time ? data.time.slice(0, 5) : "",
      date: data.date,
      client: data.client_name,
      phone: data.client_phone,
      address: data.client_address,
      services: typeof data.services === 'string' ? JSON.parse(data.services) : (data.services || []),
      employee: data.employee,
      status: data.status,
      duration: data.duration,
      customerLatitude: data.latitude,
      customerLongitude: data.longitude,
      accessToken: data.access_token
    };
  }
}

export const appointmentRepository = new AppointmentRepository();
