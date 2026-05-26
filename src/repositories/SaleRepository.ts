import { BaseRepository } from "./BaseRepository";
import { Sale } from "@/core/types";

export class SaleRepository extends BaseRepository {
  async getAll(): Promise<Sale[]> {
    const { data, error } = await this.supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async create(sale: Omit<Sale, "id" | "createdAt">): Promise<Sale> {
    const { data, error } = await this.supabase
      .from("sales")
      .insert({
        items: sale.items as any,
        total: sale.total,
        payment_method: sale.paymentMethod,
        type: sale.type,
        client_name: sale.clientName
      })
      .select()
      .single();

    this.handleError(error);
    return this.mapToModel(data);
  }

  private mapToModel(data: any): Sale {
    return {
      id: data.id,
      items: data.items,
      total: Number(data.total),
      paymentMethod: data.payment_method,
      type: data.type,
      clientName: data.client_name,
      createdAt: new Date(data.created_at)
    };
  }
}

export const saleRepository = new SaleRepository();
