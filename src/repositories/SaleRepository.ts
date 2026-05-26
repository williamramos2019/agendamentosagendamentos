import { BaseRepository } from "./BaseRepository";
import { Sale } from "@/core/types";

export class SaleRepository extends BaseRepository {
  async getAll(): Promise<Sale[]> {
    try {
      const data = await this.fetchApi<any[]>("sales");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(sale: Omit<Sale, "id" | "createdAt">): Promise<Sale> {
    try {
      const data = await this.fetchApi<any>("sales_create", {
        method: "POST",
        body: JSON.stringify({
          items: sale.items,
          total: sale.total,
          payment_method: sale.paymentMethod,
          type: sale.type,
          client_name: sale.clientName
        }),
      });

      return this.mapToModel(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapToModel(data: any): Sale {
    return {
      id: String(data.id),
      items: typeof data.items === 'string' ? JSON.parse(data.items) : (data.items || []),
      total: Number(data.total),
      paymentMethod: data.payment_method,
      type: data.type,
      clientName: data.client_name,
      createdAt: new Date(data.created_at)
    };
  }
}

export const saleRepository = new SaleRepository();
