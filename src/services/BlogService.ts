import { blogRepository } from "@/repositories/BlogRepository";
import { BlogPost } from "@/core/types";
import { BLOG_POSTS } from "@/data/blogPosts";

export class BlogService {
  static async getPosts(): Promise<BlogPost[]> {
    try {
      const dbPosts = await blogRepository.getAll();
      if (dbPosts.length > 0) return dbPosts;
    } catch (error) {
      console.warn("Failed to fetch blog posts from DB, using static data", error);
    }
    
    // Map static data to the common BlogPost type
    return BLOG_POSTS.map(p => ({
      id: p.slug,
      title: p.title,
      slug: p.slug,
      content: p.excerpt,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      createdAt: p.publishedAt,
      tags: p.tags,
      category: p.category,
      readMinutes: p.readMinutes,
      blocks: p.blocks as any[]
    }));
  }

  static async getPostBySlug(slug: string): Promise<any> {
    try {
      const post = await blogRepository.getBySlug(slug);
      if (post) return post;
    } catch (error) {
      console.warn(`Failed to fetch blog post ${slug} from DB`, error);
    }
    
    // Fallback to static data
    const { BLOG_POSTS_BY_SLUG } = await import("@/data/blogPosts");
    return BLOG_POSTS_BY_SLUG[slug];
  }
}
