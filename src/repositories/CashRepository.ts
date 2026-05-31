import { BaseRepository } from "./BaseRepository";
export class CashRepository extends BaseRepository {
  static async getAll() { return this.fetchAPI('cash_operations'); }
  static async create(data: any) { return this.fetchAPI('cash_operations', { method: 'POST', body: JSON.stringify(data) }); }
}
export const cashRepository = CashRepository;
