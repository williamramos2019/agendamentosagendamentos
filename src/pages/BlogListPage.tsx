import { useEffect, useState } from "react";
import { ArrowLeft, Clock, ChevronRight, BookOpen } from "lucide-react";
import { BlogService } from "@/services/BlogService";
import { BlogPost } from "@/core/types";
import { COMPANY_INFO } from "@/config/whatsappTemplate";

interface BlogListPageProps {
  onBack: () => void;
  onOpenPost: (slug: string) => void;
}

export function BlogListPage({ onBack, onOpenPost }: BlogListPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await BlogService.getPosts();
      setPosts(data);
      setLoading(false);
    };
    loadPosts();

    const prevTitle = document.title;
    document.title =
      "Dicas e Artigos — Auto Limpeza Pro | Higienização de estofados, colchões e carros";

    const setMeta = (name: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`,
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.content;
      tag.content = content;
      return () => {
        tag!.content = prev;
      };
    };

    const restoreDesc = setMeta(
      "description",
      "Dicas profissionais de higienização de sofás, colchões, automotiva e pós-obra. Conteúdo da Auto Limpeza Pro para São José da Lapa, Vespasiano e região.",
    );

    // JSON-LD: Blog
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "blog-list-jsonld";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Dicas Auto Limpeza Pro",
      url: "https://autolimpezapro.com.br/?page=dicas",
      publisher: { "@type": "LocalBusiness", name: COMPANY_INFO.nome },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.content.slice(0, 160),
        datePublished: p.createdAt,
        url: `https://autolimpezapro.com.br/?page=dicas&post=${p.slug}`,
      })),
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      restoreDesc();
      document.getElementById("blog-list-jsonld")?.remove();
    };
  }, [posts.length]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border safe-top">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Dicas e Artigos
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Conteúdo profissional de higienização
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 pt-5 space-y-6">
        <section>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold mb-3">
            <BookOpen className="h-3.5 w-3.5" /> Blog Auto Limpeza Pro
          </div>
          <h2 className="text-2xl font-extrabold text-foreground leading-tight">
            Dicas que fazem seu sofá, colchão e carro durarem mais
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Tudo que aprendemos limpando milhares de estofados em São José da
            Lapa e Vespasiano. Conteúdo direto, sem enrolação.
          </p>
        </section>

        <section className="space-y-3">
          {BLOG_POSTS.map((post) => {
            const Icon = post.icon;
            return (
              <article
                key={post.slug}
                onClick={() => onOpenPost(post.slug)}
                className="cursor-pointer rounded-2xl bg-card border border-border p-4 active:scale-[0.99] transition flex gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/25 to-cyan-500/15 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-primary">
                    {post.category}
                  </p>
                  <h3 className="text-sm font-bold text-foreground mt-0.5 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readMinutes} min
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground self-center shrink-0" />
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
