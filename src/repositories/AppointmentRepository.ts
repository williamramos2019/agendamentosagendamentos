import { BaseRepository } from "./BaseRepository";
export class AppointmentRepository extends BaseRepository {
  static async getAll() { return this.fetchAPI('appointments'); }
  static async create(data: any) { return this.fetchAPI('appointments', { method: 'POST', body: JSON.stringify(data) }); }
}
export const appointmentRepository = AppointmentRepository;
