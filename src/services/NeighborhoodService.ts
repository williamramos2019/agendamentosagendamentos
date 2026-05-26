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
      // SÃO JOSÉ DA LAPA
      { name: "Centro", city: "São José da Lapa", slug: "centro" },
      { name: "Dom Pedro I", city: "São José da Lapa", slug: "dom-pedro-i" },
      { name: "Dom Pedro II", city: "São José da Lapa", slug: "dom-pedro-ii" },
      { name: "Cachoeira", city: "São José da Lapa", slug: "cachoeira" },
      { name: "Inácia de Carvalho", city: "São José da Lapa", slug: "inacia-de-carvalho" },
      { name: "Jardim Encantado", city: "São José da Lapa", slug: "jardim-encantado" },
      { name: "Parque Jardim Encantado", city: "São José da Lapa", slug: "parque-jardim-encantado" },
      { name: "Belo Vale", city: "São José da Lapa", slug: "belo-vale" },
      { name: "Campinho", city: "São José da Lapa", slug: "campinho" },
      { name: "Chácaras Reunidas", city: "São José da Lapa", slug: "chacaras-reunidas" },
      { name: "Nova Granja", city: "São José da Lapa", slug: "nova-granja" },
      { name: "Morada da Serra", city: "São José da Lapa", slug: "morada-da-serra" },
      { name: "Vila Ical", city: "São José da Lapa", slug: "vila-ical" },
      { name: "Vila Maria de Lourdes", city: "São José da Lapa", slug: "vila-maria-de-lourdes" },
      { name: "Vila Palmeiras", city: "São José da Lapa", slug: "vila-palmeiras" },
      { name: "Vila José Antônio", city: "São José da Lapa", slug: "vila-jose-antonio" },
      { name: "Vila Militar", city: "São José da Lapa", slug: "vila-militar" },
      { name: "Parque Horizonte", city: "São José da Lapa", slug: "parque-horizonte" },
      { name: "Serra Dourada", city: "São José da Lapa", slug: "serra-dourada" },
      { name: "Palmital", city: "São José da Lapa", slug: "palmital" },
      { name: "Vale da Mata", city: "São José da Lapa", slug: "vale-da-mata" },
      { name: "Chácaras São Geraldo", city: "São José da Lapa", slug: "chacaras-sao-geraldo" },
      { name: "Cristina", city: "São José da Lapa", slug: "cristina" },
      { name: "Industrial", city: "São José da Lapa", slug: "industrial" },
      { name: "Lagoa", city: "São José da Lapa", slug: "lagoa" },
      { name: "Novo Horizonte", city: "São José da Lapa", slug: "novo-horizonte" },
      { name: "Jardim Beira Rio", city: "São José da Lapa", slug: "jardim-beira-rio" },
      { name: "Parque Primavera", city: "São José da Lapa", slug: "parque-primavera" },
      { name: "Residencial Cachoeira", city: "São José da Lapa", slug: "residencial-cachoeira" },
      { name: "Vila Rica", city: "São José da Lapa", slug: "vila-rica" },
      { name: "Santa Fé", city: "São José da Lapa", slug: "santa-fe" },
      { name: "Parque Real", city: "São José da Lapa", slug: "parque-real" },
      { name: "Recanto da Lagoa", city: "São José da Lapa", slug: "recanto-da-lagoa" },
      { name: "Distrito Industrial", city: "São José da Lapa", slug: "distrito-industrial" },
      { name: "Parque Verde", city: "São José da Lapa", slug: "parque-verde" },
      { name: "São Benedito", city: "São José da Lapa", slug: "sao-benedito" },
      
      // VESPASIANO
      { name: "Centro", city: "Vespasiano", slug: "centro" },
      { name: "Caieiras", city: "Vespasiano", slug: "caieiras" },
      { name: "Célvia", city: "Vespasiano", slug: "celvia" },
      { name: "Gávea", city: "Vespasiano", slug: "gavea" },
      { name: "Jardim da Glória", city: "Vespasiano", slug: "jardim-da-gloria" },
      { name: "Jardim Itaú", city: "Vespasiano", slug: "jardim-itau" },
      { name: "Jardim Alterosa", city: "Vespasiano", slug: "jardim-alterosa" },
      { name: "Morro Alto", city: "Vespasiano", slug: "morro-alto" },
      { name: "Morro Alto II", city: "Vespasiano", slug: "morro-alto-ii" },
      { name: "Nova Pampulha", city: "Vespasiano", slug: "nova-pampulha" },
      { name: "Parque Jardim Itaú", city: "Vespasiano", slug: "parque-jardim-itau" },
      { name: "Parque Norte", city: "Vespasiano", slug: "parque-norte" },
      { name: "Santa Clara", city: "Vespasiano", slug: "santa-clara" },
      { name: "Santa Cruz", city: "Vespasiano", slug: "santa-cruz" },
      { name: "Santo Antônio", city: "Vespasiano", slug: "santo-antonio" },
      { name: "Suely", city: "Vespasiano", slug: "suely" },
      { name: "Vale Formoso", city: "Vespasiano", slug: "vale-formoso" },
      { name: "Vila Esportiva", city: "Vespasiano", slug: "vila-esportiva" },
      { name: "Vila Ipê", city: "Vespasiano", slug: "vila-ipe" },
      { name: "Vila Verde", city: "Vespasiano", slug: "vila-verde" },
      { name: "Bernardo de Souza", city: "Vespasiano", slug: "bernardo-de-souza" },
      { name: "Nazia", city: "Vespasiano", slug: "nazia" },
      { name: "Residencial Park I", city: "Vespasiano", slug: "residencial-park-i" },
      { name: "Residencial Park II", city: "Vespasiano", slug: "residencial-park-ii" },
      { name: "Imperial", city: "Vespasiano", slug: "imperial" },
      { name: "Serra Azul", city: "Vespasiano", slug: "serra-azul" },
      { name: "Serra Dourada", city: "Vespasiano", slug: "serra-dourada" },
      { name: "Jequitibá", city: "Vespasiano", slug: "jequitiba" },
      { name: "Novo Horizonte", city: "Vespasiano", slug: "novo-horizonte" },
      { name: "Celvia II", city: "Vespasiano", slug: "celvia-ii" },
      { name: "Conjunto Habitacional Vespasiano", city: "Vespasiano", slug: "conjunto-habitacional-vespasiano" },
      { name: "Jardim Encantado", city: "Vespasiano", slug: "jardim-encantado" },
      { name: "Moradas da Lagoa", city: "Vespasiano", slug: "moradas-da-lagoa" },
      { name: "Santa Maria", city: "Vespasiano", slug: "santa-maria" },
      { name: "Serra Verde", city: "Vespasiano", slug: "serra-verde" },
      { name: "Parque Serra Verde", city: "Vespasiano", slug: "parque-serra-verde" },
      { name: "Bonsucesso", city: "Vespasiano", slug: "bonsucesso" },
      { name: "Angicos", city: "Vespasiano", slug: "angicos" },
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

  static async getNeighborhoodsByCity(city: string): Promise<Neighborhood[]> {
    const all = await this.getNeighborhoods();
    if (all.length > 0) {
      return all.filter(n => n.city.toLowerCase().includes(city.toLowerCase()));
    }
    return [];
  }
}