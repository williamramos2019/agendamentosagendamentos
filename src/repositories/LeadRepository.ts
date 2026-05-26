import { BaseRepository } from "./BaseRepository";
import { Lead } from "@/core/types";
import { NotificationService } from "@/services/NotificationService";

export class LeadRepository extends BaseRepository {
  async getAll(): Promise<Lead[]> {
    try {
      const data = await this.fetchApi<any[]>("leads");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(lead: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> {
    try {
      const data = await this.fetchApi<any>("leads_create", {
        method: "POST",
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          source: lead.source,
          status: 'new'
        }),
      });

      const result = this.mapToModel(data);

      // Notify
      NotificationService.create(
        "lead",
        "📩 Novo lead recebido!",
        `${result.name} entrou em contato via ${result.source || 'site'}`,
        "/leads"
      );

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapToModel(data: any): Lead {
    return {
      id: String(data.id),
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
