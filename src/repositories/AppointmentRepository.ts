import { BaseRepository } from "./BaseRepository";
import { Appointment } from "@/core/types";

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
        longitude: appointment.customerLongitude
      })
      .select()
      .single();

    this.handleError(error);
    return this.mapToModel(data);
  }

  async updateStatus(id: string, status: Appointment["status"]): Promise<void> {
    const { error } = await this.supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    this.handleError(error);
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
      customerLongitude: data.longitude
    };
  }
}

export const appointmentRepository = new AppointmentRepository();
