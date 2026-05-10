import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  ChevronRight,
  Share2,
  CheckCircle2,
} from "lucide-react";
import {
  BLOG_POSTS_BY_SLUG,
  getRelatedPosts,
  type BlogBlock,
  type BlogPost,
} from "@/data/blogPosts";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { toast } from "sonner";

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
  const post = BLOG_POSTS_BY_SLUG[slug];
  const related = useMemo(() => getRelatedPosts(slug), [slug]);

  // SEO
  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = post.metaTitle;

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
      return () => {
        tag!.content = prev;
      };
    };

    const restoreDesc = setMeta("description", post.metaDescription);
    const restoreOg = setMeta("og:title", post.metaTitle, true);
    const restoreOgDesc = setMeta("og:description", post.metaDescription, true);
    const restoreOgType = setMeta("og:type", "article", true);

    // JSON-LD Article
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "blog-post-jsonld";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.publishedAt,
      author: { "@type": "Organization", name: COMPANY_INFO.nome },
      publisher: {
        "@type": "Organization",
        name: COMPANY_INFO.nome,
        logo: {
          "@type": "ImageObject",
          url: "https://autolimpezapro.com.br/og-image.png",
        },
      },
      mainEntityOfPage: `https://autolimpezapro.com.br/?page=dicas&post=${post.slug}`,
      keywords: post.tags.join(", "),
      articleSection: post.category,
    });
    document.head.appendChild(ld);

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    return () => {
      document.title = prevTitle;
      restoreDesc();
      restoreOg();
      restoreOgDesc();
      restoreOgType();
      document.getElementById("blog-post-jsonld")?.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-foreground font-bold mb-2">Artigo não encontrado</p>
          <button
            onClick={onBack}
            className="text-primary text-sm font-semibold underline"
          >
            Voltar para o blog
          </button>
        </div>
      </div>
    );
  }

  const Icon = post.icon;

  const handleShare = async () => {
    const url = `${window.location.origin}/?page=dicas&post=${post.slug}`;
    const text = `${post.title} — ${COMPANY_INFO.nome}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado!");
      } catch {
        toast.error("Não consegui copiar o link");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border safe-top">
        <div className="px-5 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="flex-1 text-xs font-bold text-muted-foreground truncate">
            Dicas › {post.category}
          </p>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            aria-label="Compartilhar"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      <article className="px-5 pt-5">
        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-cyan-500/10 to-transparent border border-primary/20 p-5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-3">
            <Icon className="h-7 w-7" />
          </div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-primary">
            {post.category}
          </p>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight mt-1">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readMinutes} min de leitura
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-4">
          {post.blocks.map((b, i) => (
            <BlockRenderer key={i} block={b} onOpenPost={onOpenPost} />
          ))}
        </div>

        {/* CTA agendar */}
        {post.serviceId && (
          <section className="mt-7 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground p-5 shadow-lg shadow-primary/30">
            <p className="text-xs font-bold opacity-90 uppercase tracking-wider">
              Pronto para resolver?
            </p>
            <p className="text-base font-extrabold mt-1 leading-snug">
              Agende sua higienização agora pelo app
            </p>
            <p className="text-xs opacity-90 mt-1">
              5 passinhos, atendimento em São José da Lapa e Vespasiano.
            </p>
            <button
              onClick={() => onStartBooking(post.serviceId)}
              className="mt-4 w-full h-12 rounded-xl bg-white text-primary font-extrabold text-sm active:scale-[0.98] transition"
            >
              Quero agendar agora
            </button>
          </section>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <section className="mt-7">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-muted text-[11px] text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Posts relacionados — cross-linking principal */}
        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-foreground mb-3">
              Leia também
            </h2>
            <div className="space-y-2.5">
              {related.map((r) => (
                <RelatedCard key={r.slug} post={r} onOpen={onOpenPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

function BlockRenderer({
  block,
  onOpenPost,
}: {
  block: BlogBlock;
  onOpenPost: (slug: string) => void;
}) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="text-lg font-extrabold text-foreground mt-5 leading-snug">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-[15px] text-foreground/90 leading-relaxed">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2 pl-1">
          {block.items.map((it, i) => (
            <li
              key={i}
              className="flex gap-2 text-[14.5px] text-foreground/90 leading-relaxed"
            >
              <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="rounded-xl border-l-4 border-primary bg-primary/8 px-4 py-3 text-[14px] text-foreground/95 leading-relaxed">
          💡 {block.text}
        </div>
      );
    case "linkP": {
      const target = BLOG_POSTS_BY_SLUG[block.slug];
      const parts = block.text.split("{{slug}}");
      return (
        <p className="text-[15px] text-foreground/90 leading-relaxed">
          {parts[0]}
          {target ? (
            <button
              onClick={() => onOpenPost(block.slug)}
              className="text-primary font-bold underline-offset-2 underline decoration-primary/50 hover:decoration-primary"
            >
              {block.linkLabel}
            </button>
          ) : (
            <span>{block.linkLabel}</span>
          )}
          {parts[1] ?? ""}
        </p>
      );
    }
  }
}

function RelatedCard({
  post,
  onOpen,
}: {
  post: BlogPost;
  onOpen: (slug: string) => void;
}) {
  const Icon = post.icon;
  return (
    <button
      onClick={() => onOpen(post.slug)}
      className="w-full text-left flex items-center gap-3 rounded-xl bg-card border border-border p-3 active:scale-[0.99] transition"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-primary">
          {post.category}
        </p>
        <p className="text-sm font-bold text-foreground leading-snug line-clamp-2">
          {post.title}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
    </button>
  );
}
