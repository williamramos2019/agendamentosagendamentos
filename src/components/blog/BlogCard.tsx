import { Clock, ChevronRight, BookOpen } from "lucide-react";
import { BlogPost } from "@/core/types";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  onClick: (slug: string) => void;
  className?: string;
}

export function BlogCard({ post, onClick, className }: BlogCardProps) {
  return (
    <article
      onClick={() => onClick(post.slug)}
      className={cn(
        "group cursor-pointer rounded-2xl bg-card border border-border overflow-hidden active:scale-[0.98] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {post.imageUrl ? (
          <div className="sm:w-40 h-40 shrink-0 relative overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
              {post.category}
            </div>
          </div>
        ) : (
          <div className="sm:w-40 h-40 shrink-0 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative">
             <BookOpen className="h-10 w-10 text-primary/40" />
             <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-primary/20 backdrop-blur-sm text-[10px] font-bold text-primary uppercase tracking-wider">
              {post.category}
            </div>
          </div>
        )}
        
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            
            <button className="flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-wider">
              Ler mais <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
