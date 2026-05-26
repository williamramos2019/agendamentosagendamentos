import { BaseRepository } from "./BaseRepository";
import { BlogPost } from "@/core/types";

export class BlogRepository extends BaseRepository {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    this.handleError(error);
    return (data || []).map(this.mapToModel);
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    this.handleError(error);
    return data ? this.mapToModel(data) : null;
  }

  private mapToModel(data: any): BlogPost {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      imageUrl: data.image_url,
      author: data.author,
      tags: data.tags,
      createdAt: data.created_at
    };
  }
}

export const blogRepository = new BlogRepository();
