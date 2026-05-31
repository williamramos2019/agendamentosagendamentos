import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <PublicLayout title="Blog & Dicas | Auto Limpeza Pro" description="Dicas profissionais sobre limpeza de estofados, remoção de manchas e cuidados com seu veículo.">
      <section className="pt-40 pb-32">
        <div className="container mx-auto px-5">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Nossa Revista Digital</p>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">Blog & Dicas</h1>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                Informação de qualidade para manter sua casa e seu carro sempre impecáveis e saudáveis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article 
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.08] hover:border-primary/20 transition-all duration-500"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={post.image_url || `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80`} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6 px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString('pt-BR')}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.read_minutes} min</div>
                      </div>

                      <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between group/link">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ler Artigo Completo</span>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-black transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}