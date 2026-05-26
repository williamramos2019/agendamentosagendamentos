import { BaseRepository } from "./BaseRepository";
import { Appointment } from "@/core/types";
import { NotificationService } from "@/services/NotificationService";

export class AppointmentRepository extends BaseRepository {
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await this.supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true });

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async create(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    const accessToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await this.supabase
      .from("appointments")
      .insert({
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
      })
      .select()
      .single();

    this.handleError(error);
    const result = this.mapToModel(data);

    // Notify Admin
    NotificationService.create(
      "appointment",
      "📅 Novo agendamento recebido!",
      `${result.client} agendou ${result.services.join(", ")} para ${result.date} às ${result.time}`,
      "/agenda"
    );

    // Notify Client with personal link
    const clientUrl = `/meu-agendamento?token=${accessToken}`;
    NotificationService.create(
      "appointment",
      "✨ Agendamento Confirmado!",
      `Olá ${result.client}! Seu agendamento foi registrado com sucesso. Clique aqui para ver os detalhes.`,
      clientUrl
    );

    return result;
  }

  async getByToken(token: string): Promise<Appointment | null> {
    const { data, error } = await this.supabase
      .from("appointments")
      .select("*")
      .eq("access_token", token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      this.handleError(error);
    }
    
    return data ? this.mapToModel(data) : null;
  }

  async updateStatus(id: string, status: Appointment["status"]): Promise<void> {
    const { error } = await this.supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    this.handleError(error);

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
  }

  private mapToModel(data: any): Appointment {
    return {
      id: data.id,
      time: data.time.slice(0, 5),
      date: data.date,
      client: data.client_name,
      phone: data.client_phone,
      address: data.client_address,
      services: data.services,
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
