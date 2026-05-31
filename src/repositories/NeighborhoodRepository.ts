import { BaseRepository } from "./BaseRepository";

export class NeighborhoodRepository extends BaseRepository {
  static async getAll() {
    return this.fetchAPI('neighborhoods');
  }

  static async getByCity(citySlug: string) {
    return this.fetchAPI(`neighborhoods&city_slug=${citySlug}`);
  }
}

export const neighborhoodRepository = NeighborhoodRepository;
