import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Search, MapPin } from "lucide-react";
import { BlogService } from "@/services/BlogService";
import { BlogPost } from "@/core/types";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { cn } from "@/lib/utils";
import HeroStory from "@/components/blog/news/HeroStory";
import NewsCard from "@/components/blog/news/NewsCard";
import WeatherWidget from "@/components/blog/news/WeatherWidget";
import EventsWidget from "@/components/blog/news/EventsWidget";
import TrendingTopics from "@/components/blog/news/TrendingTopics";
import { motion } from "framer-motion";
import mascote from "@/assets/mascote-auto-limpeza-pro.png";

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
    <div className="min-h-screen bg-[#020817] pb-32">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/5 safe-top">
        <div className="px-5 py-4 flex items-center gap-4 max-w-6xl mx-auto w-full">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              Blog & Notícias
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
             <MapPin className="h-3 w-3 text-primary" />
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">SJ Lapa - MG</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero Section */}
            {posts.length > 0 && !loading && (
              <HeroStory post={posts[0]} onClick={onOpenPost} />
            )}

            {loading && (
              <div className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
            )}

            {/* Filter & Search Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Conteúdo Exclusivo</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Explore por categoria ou busca</p>
                </div>
                
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Buscar artigo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 transition-all text-xs outline-none text-white font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {["Todos", "Notícias", "Saúde", "Automotivo", "Tecnologia", "Economia"].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setSearchTerm(cat === "Todos" ? "" : cat)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      (searchTerm === cat || (cat === "Todos" && searchTerm === ""))
                        ? "bg-primary border-primary text-[#020817] shadow-lg shadow-primary/20"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                ))
              ) : filteredPosts.length > 1 ? (
                filteredPosts.slice(1).map((post, i) => (
                  <NewsCard 
                    key={post.slug} 
                    post={post} 
                    index={i}
                    onClick={onOpenPost} 
                  />
                ))
              ) : filteredPosts.length === 1 && searchTerm ? (
                <NewsCard 
                  key={filteredPosts[0].slug} 
                  post={filteredPosts[0]} 
                  index={0}
                  onClick={onOpenPost} 
                />
              ) : (
                <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Nenhum artigo encontrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 hidden lg:block">
            {/* CTA Mascot */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shadow-2xl"
            >
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight leading-tight">Dúvida Técnica?</h3>
                <p className="text-xs text-muted-foreground mb-6 font-medium uppercase tracking-widest leading-relaxed">
                  Fale agora com nossos especialistas em higienização profissional.
                </p>
                <button 
                  onClick={() => window.open(`https://wa.me/${COMPANY_INFO.whatsapp}`, "_blank")}
                  className="w-full py-3.5 rounded-xl bg-primary text-[#020817] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  WhatsApp Direto
                </button>
              </div>
              <img 
                src={mascote} 
                alt="" 
                className="absolute -right-8 -bottom-8 w-32 h-32 object-contain opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none grayscale group-hover:grayscale-0"
              />
            </motion.div>

            <WeatherWidget />
            <EventsWidget />
            <TrendingTopics />
          </aside>
        </div>
      </main>
    </div>
  );
}
