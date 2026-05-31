import { BaseRepository } from "./BaseRepository";
export class SaleRepository extends BaseRepository {
  static async getAll() { return this.fetchAPI('sales'); }
  static async create(data: any) { return this.fetchAPI('sales', { method: 'POST', body: JSON.stringify(data) }); }
}
export const saleRepository = SaleRepository;
