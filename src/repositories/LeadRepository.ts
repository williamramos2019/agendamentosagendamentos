import { BaseRepository } from "./BaseRepository";
import { Lead } from "@/core/types";
import { NotificationService } from "@/services/NotificationService";

export class LeadRepository extends BaseRepository {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async create(lead: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> {
    const { data, error } = await this.supabase
      .from("leads")
      .insert({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        source: lead.source,
        status: 'new'
      })
      .select()
      .single();

    this.handleError(error);
    const result = this.mapToModel(data);

    // Notify
    NotificationService.create(
      "lead",
      "📩 Novo lead recebido!",
      `${result.name} entrou em contato via ${result.source || 'site'}`,
      "/leads"
    );

    return result;
  }

  private mapToModel(data: any): Lead {
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: data.source,
      status: data.status,
      createdAt: data.created_at
    };
  }
}

export const leadRepository = new LeadRepository();
