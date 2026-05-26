import { neighborhoodRepository, Neighborhood } from "@/repositories/NeighborhoodRepository";

export class NeighborhoodService {
  static async getNeighborhoods(): Promise<Neighborhood[]> {
    return neighborhoodRepository.getAll();
  }

  static async getNeighborhoodBySlug(city: string, slug: string): Promise<Neighborhood | null> {
    // Tentamos buscar do banco/API
    const neighborhood = await neighborhoodRepository.getBySlug(city, slug);
    if (neighborhood) return neighborhood;

    // Fallback: Se não encontrar na API, verificamos se é um dos bairros padrão do sistema
    // Isso garante que as rotas funcionem mesmo se o backend PHP ainda não tiver todos os bairros cadastrados
    const fallbackBairros = [
      { name: "Centro", city: "Vespasiano", slug: "centro" },
      { name: "Nova Pampulha", city: "Vespasiano", slug: "nova-pampulha" },
      { name: "Santa Clara", city: "Vespasiano", slug: "santa-clara" },
      { name: "Centro", city: "São José da Lapa", slug: "centro" },
      { name: "Bom Pastor", city: "São José da Lapa", slug: "bom-pastor" },
    ];

    const found = fallbackBairros.find(b => 
      b.slug === slug && 
      b.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-") === city
    );

    if (found) {
      return {
        id: found.slug,
        name: found.name,
        city: found.city,
        slug: found.slug
      };
    }

    return null;
  }
}