import { BaseRepository } from "./BaseRepository";
import { BlogPost } from "@/core/types";

export class BlogRepository extends BaseRepository {
  async getAll(): Promise<BlogPost[]> {
    try {
      const data = await this.fetchApi<any[]>("blog");
      return (data || []).map(this.mapToModel);
    } catch (error) {
      console.error("[BlogRepository]:", error);
      return [];
    }
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const data = await this.fetchApi<any>(`blog&slug=${slug}`);
      return data ? this.mapToModel(data) : null;
    } catch (error) {
      console.error(`[BlogRepository]: Erro ao buscar ${slug}`, error);
      return null;
    }
  }

  async save(post: Partial<BlogPost>): Promise<boolean> {
    try {
      await this.fetchApi('blog', {
        method: 'POST',
        body: JSON.stringify({ ...post, save: true })
      });
      return true;
    } catch (error) {
      console.error("[BlogRepository]: Erro ao salvar post", error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.fetchApi(`blog`, {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return true;
    } catch (error) {
      console.error("[BlogRepository]: Erro ao deletar post", error);
      return false;
    }
  }

  private mapToModel(data: any): BlogPost {
    const wordsPerMinute = 200;
    const contentText = typeof data.content === 'string' ? data.content : '';
    const wordCount = contentText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return {
      id: String(data.id),
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || (contentText ? contentText.substring(0, 160) + '...' : ''),
      imageUrl: data.image_url || data.imageUrl,
      author: data.author,
      tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? JSON.parse(data.tags) : []),
      category: data.category || 'Geral',
      readMinutes: Number(data.read_minutes || data.readMinutes || readingTime),
      publishedAt: data.published_at || data.publishedAt || data.created_at,
      blocks: typeof data.blocks === 'string' ? JSON.parse(data.blocks) : (data.blocks || []),
      createdAt: data.created_at || data.createdAt
    };
  }
}

export const blogRepository = new BlogRepository();
