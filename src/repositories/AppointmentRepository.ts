import { BaseRepository } from "./BaseRepository";
export class AppointmentRepository extends BaseRepository {
  static async getAll() { return this.fetchAPI('appointments'); }
}
export const appointmentRepository = AppointmentRepository;
