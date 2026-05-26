import { BlogPost } from "@/core/types";
import { getApiUrl } from "@/config/api";

export class BlogRepository {
  async getAll(): Promise<BlogPost[]> {
    try {
      const response = await fetch(getApiUrl('blog'));
      if (!response.ok) throw new Error('Falha ao carregar posts');
      
      const data = await response.json();
      return (data || []).map(this.mapToModel);
    } catch (error) {
      console.error("[BlogRepository]:", error);
      return [];
    }
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(getApiUrl(`blog&slug=${slug}`));
      if (!response.ok) throw new Error('Artigo não encontrado');
      
      const data = await response.json();
      return data ? this.mapToModel(data) : null;
    } catch (error) {
      console.error(`[BlogRepository]: Erro ao buscar ${slug}`, error);
      return null;
    }
  }

  private mapToModel(data: any): BlogPost {
    // Cálculo de tempo de leitura caso não venha da API
    const wordsPerMinute = 200;
    const wordCount = (data.content || '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return {
      id: String(data.id),
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || (data.content ? data.content.substring(0, 160) + '...' : ''),
      imageUrl: data.image_url || data.imageUrl,
      author: data.author,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? JSON.parse(data.tags) : []),
      category: data.category || 'Geral',
      readMinutes: data.read_minutes || data.readMinutes || readingTime,
      publishedAt: data.published_at || data.publishedAt || data.created_at,
      blocks: typeof data.blocks === 'string' ? JSON.parse(data.blocks) : (data.blocks || []),
      createdAt: data.created_at || data.createdAt
    };
  }
}

export const blogRepository = new BlogRepository();
