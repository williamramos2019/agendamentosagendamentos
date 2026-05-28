import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { BlogService } from "@/services/BlogService";
import { BlogPost } from "@/core/types";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { BlogCard } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";

interface BlogListPageProps {
  onBack: () => void;
  onOpenPost: (slug: string) => void;
}

export function BlogListPage({ onBack, onOpenPost }: BlogListPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const data = await BlogService.getPosts();
      setPosts(data);
      setLoading(false);
    };
    loadPosts();

    const prevTitle = document.title;
    document.title = "Blog & Dicas — Auto Limpeza Pro | Especialistas em Higienização";

    const setMeta = (name: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.content;
      tag.content = content;
      return () => { tag!.content = prev; };
    };

    const restoreDesc = setMeta(
      "description",
      "Confira nossas dicas profissionais de higienização de sofás, colchões e estética automotiva. O guia completo para manter sua casa saudável."
    );

    return () => {
      document.title = prevTitle;
      restoreDesc();
    };
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-top">
        <div className="px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-foreground uppercase tracking-tight">
              Blog & Notícias
            </h1>
          </div>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-10">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
            <BookOpen className="h-3 w-3" /> Central de Conteúdo
          </div>
          <h2 className="text-3xl font-black text-foreground leading-[1.1]">
            As Melhores Notícias da <span className="text-primary italic">Região</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Fique por dentro de tudo o que acontece em São José da Lapa, Vespasiano e RMBH. O portal oficial da Auto Limpeza Pro.
          </p>
        </section>

        {/* Search Bar */}
        <section className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="O que você quer aprender?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-muted/30 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm outline-none"
          />
        </section>

        {/* Categories (Optional/Hardcoded for now as quick filters) */}
        <section className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {["Todos", "Notícias", "Saúde", "Automotivo", "Tecnologia", "Economia"].map((cat) => (
            <button 
              key={cat}
              onClick={() => setSearchTerm(cat === "Todos" ? "" : cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                (searchTerm === cat || (cat === "Todos" && searchTerm === ""))
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Posts List */}
        <section className="space-y-5">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-5">
              {filteredPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  onClick={onOpenPost}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground text-sm font-medium">Nenhum artigo encontrado com esses termos.</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-primary text-xs font-bold underline"
              >
                Limpar busca
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
