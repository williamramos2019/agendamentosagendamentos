import { BaseRepository } from "./BaseRepository";

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  slug: string;
  seoData: any;
}

export class NeighborhoodRepository extends BaseRepository {
  async getAll(): Promise<Neighborhood[]> {
    const { data, error } = await this.supabase
      .from("neighborhoods")
      .select("*")
      .order("name", { ascending: true });

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async getBySlug(slug: string): Promise<Neighborhood | null> {
    const { data, error } = await this.supabase
      .from("neighborhoods")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    this.handleError(error);
    return data ? this.mapToModel(data) : null;
  }

  private mapToModel(data: any): Neighborhood {
    return {
      id: data.id,
      name: data.name,
      city: data.city,
      slug: data.slug,
      seoData: data.seo_data
    };
  }
}

export const neighborhoodRepository = new NeighborhoodRepository();
