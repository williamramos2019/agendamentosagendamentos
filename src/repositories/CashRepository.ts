import { BaseRepository } from "./BaseRepository";
import { CashOperation } from "@/core/types";

export class CashRepository extends BaseRepository {
  async getOperations(): Promise<CashOperation[]> {
    try {
      const data = await this.fetchApi<any[]>("cash_operations");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOperation(op: Omit<CashOperation, "id">): Promise<CashOperation> {
    try {
      const data = await this.fetchApi<any>("cash_operations_create", {
        method: "POST",
        body: JSON.stringify({
          type: op.type,
          description: op.description,
          amount: op.amount,
          time: op.time,
          sale_id: op.saleId
        }),
      });

      return this.mapToModel(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapToModel(data: any): CashOperation {
    return {
      id: String(data.id),
      type: data.type,
      description: data.description,
      amount: Number(data.amount),
      time: data.time,
      saleId: data.sale_id
    };
  }
}

export const cashRepository = new CashRepository();
