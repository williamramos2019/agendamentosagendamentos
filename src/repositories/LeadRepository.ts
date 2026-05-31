import { BaseRepository } from "./BaseRepository";

export class LeadRepository extends BaseRepository {
  static async getAll() {
    return this.fetchAPI('leads');
  }

  static async create(data: any) {
    return this.fetchAPI('leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string) {
    return this.fetchAPI(`leads&id=${id}`, {
      method: 'DELETE'
    });
  }
}

export const leadRepository = LeadRepository;
