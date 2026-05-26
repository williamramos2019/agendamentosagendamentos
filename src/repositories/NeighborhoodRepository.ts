import { BaseRepository } from "./BaseRepository";

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  slug: string;
  seoData?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export class NeighborhoodRepository extends BaseRepository {
  async getAll(): Promise<Neighborhood[]> {
    try {
      const data = await this.fetchApi<any[]>("neighborhoods");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      console.error("[NeighborhoodRepository]:", error);
      return [];
    }
  }

  async getBySlug(citySlug: string, neighborhoodSlug: string): Promise<Neighborhood | null> {
    try {
      const data = await this.fetchApi<any>(`neighborhood&city=${citySlug}&slug=${neighborhoodSlug}`);
      return data ? this.mapToModel(data) : null;
    } catch (error) {
      console.error(`[NeighborhoodRepository]: Erro ao buscar ${citySlug}/${neighborhoodSlug}`, error);
      return null;
    }
  }

  private mapToModel(data: any): Neighborhood {
    return {
      id: String(data.id),
      name: data.name,
      city: data.city,
      slug: data.slug,
      seoData: typeof data.seo_data === 'string' ? JSON.parse(data.seo_data) : (data.seo_data || {})
    };
  }
}

export const neighborhoodRepository = new NeighborhoodRepository();
