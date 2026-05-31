import { BaseRepository } from "./BaseRepository";
export class NeighborhoodRepository extends BaseRepository {
  static async getAll() { return this.fetchAPI('neighborhoods'); }
}
export const neighborhoodRepository = NeighborhoodRepository;
