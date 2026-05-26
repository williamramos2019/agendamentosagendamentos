import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  ChevronRight,
  Share2,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { BlogService } from "@/services/BlogService";
import { BlogPost } from "@/core/types";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { toast } from "sonner";
import { BlogBlocksRenderer } from "@/components/blog/BlogBlocksRenderer";
import { BlogCTA } from "@/components/blog/BlogCTA";

interface BlogPostPageProps {
  slug: string;
  onBack: () => void;
  onOpenPost: (slug: string) => void;
  onStartBooking: (serviceId?: string) => void;
}

export function BlogPostPage({
  slug,
  onBack,
  onOpenPost,
  onStartBooking,
}: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const data = await BlogService.getPostBySlug(slug);
      setPost(data);
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  // SEO
  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = `${post.title} — Auto Limpeza Pro`;

    const setMeta = (name: string, content: string, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        if (prop) tag.setAttribute("property", name);
        else tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.content;
      tag.content = content;
      return () => { tag!.content = prev; };
    };

    const restoreDesc = setMeta("description", post.excerpt || "");
    const restoreOg = setMeta("og:title", post.title, true);
    const restoreOgDesc = setMeta("og:description", post.excerpt || "", true);
    const restoreOgType = setMeta("og:type", "article", true);
    const restoreOgImage = post.imageUrl ? setMeta("og:image", post.imageUrl, true) : () => {};

    // JSON-LD Article
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "blog-post-jsonld";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      author: { "@type": "Organization", name: COMPANY_INFO.nome },
      publisher: {
        "@type": "Organization",
        name: COMPANY_INFO.nome,
        logo: {
          "@type": "ImageObject",
          url: "https://autolimpezapro.com.br/logo.png",
        },
      },
      mainEntityOfPage: window.location.href,
      image: post.imageUrl,
      keywords: post.tags?.join(", "),
      articleSection: post.category,
    });
    document.head.appendChild(ld);

    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      document.title = prevTitle;
      restoreDesc();
      restoreOg();
      restoreOgDesc();
      restoreOgType();
      restoreOgImage();
      document.getElementById("blog-post-jsonld")?.remove();
    };
  }, [post]);

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    const text = `${post.title} — Auto Limpeza Pro`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado!");
      } catch {
        toast.error("Erro ao copiar link");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">Carregando conteúdo premium...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Ops! Artigo não encontrado</h2>
          <p className="text-sm text-muted-foreground">O conteúdo que você procura pode ter sido movido ou removido.</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition-all"
        >
          Voltar para o Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-top">
        <div className="px-5 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center active:scale-90 transition-all"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
              {post.category}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center active:scale-90 transition-all"
            aria-label="Compartilhar"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="px-5 pt-8 pb-10 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {post.readMinutes} min de leitura
            </span>
          </div>
        </div>

        {post.imageUrl && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden border border-border shadow-2xl">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Main Article Body */}
      <article className="px-5">
        <div className="max-w-none prose prose-slate prose-sm sm:prose-base dark:prose-invert">
          {post.blocks && post.blocks.length > 0 ? (
            <BlogBlocksRenderer 
              blocks={post.blocks} 
              onOpenPost={onOpenPost}
              onStartBooking={onStartBooking}
            />
          ) : (
             <div className="text-[16px] text-foreground/80 leading-relaxed space-y-4">
               {post.content.split('\n').map((para, i) => (
                 <p key={i}>{para}</p>
               ))}
             </div>
          )}
        </div>

        {/* Dynamic CTA */}
        <BlogCTA onStartBooking={onStartBooking} variant="footer" className="mt-16" />

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Social Bar (Mobile Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-40 sm:hidden">
        <button 
          onClick={() => window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent("Olá! Vi o artigo '" + post.title + "' e gostaria de mais informações.")}`, "_blank")}
          className="w-full h-12 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all"
        >
          <MessageSquare className="h-5 w-5" /> Falar no WhatsApp
        </button>
      </div>
    </div>
  );
}
