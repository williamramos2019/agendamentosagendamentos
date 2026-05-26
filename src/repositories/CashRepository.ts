import { BaseRepository } from "./BaseRepository";
import { CashOperation } from "@/core/types";

export class CashRepository extends BaseRepository {
  async getOperations(): Promise<CashOperation[]> {
    const { data, error } = await this.supabase
      .from("cash_operations")
      .select("*")
      .order("created_at", { ascending: false });

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async createOperation(op: Omit<CashOperation, "id">): Promise<CashOperation> {
    const { data, error } = await this.supabase
      .from("cash_operations")
      .insert({
        type: op.type,
        description: op.description,
        amount: op.amount,
        time: op.time,
        sale_id: op.saleId
      })
      .select()
      .single();

    this.handleError(error);
    return this.mapToModel(data);
  }

  private mapToModel(data: any): CashOperation {
    return {
      id: data.id,
      type: data.type,
      description: data.description,
      amount: Number(data.amount),
      time: data.time,
      saleId: data.sale_id
    };
  }
}

export const cashRepository = new CashRepository();
