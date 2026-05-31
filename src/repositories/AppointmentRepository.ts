import { BaseRepository } from "./BaseRepository";

export class AppointmentRepository extends BaseRepository {
  static async getAll() {
    return this.fetchAPI('appointments');
  }

  static async create(data: any) {
    return this.fetchAPI('appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: any) {
    return this.fetchAPI(`appointments&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string) {
    return this.fetchAPI(`appointments&id=${id}`, {
      method: 'DELETE'
    });
  }
}

export const appointmentRepository = AppointmentRepository;
