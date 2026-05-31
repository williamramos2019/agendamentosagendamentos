import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { BlockRenderer } from "@/components/blog/BlockRenderer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) setPost(data);
      setLoading(false);
      window.scrollTo(0, 0);
    }
    fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#090F15] flex items-center justify-center text-white/50">Carregando artigo...</div>;
  if (!post) return <div className="min-h-screen bg-[#090F15] flex items-center justify-center text-white/50">Artigo não encontrado.</div>;

  return (
    <PublicLayout 
      title={`${post.title} | Auto Limpeza Pro`} 
      description={post.excerpt}
      canonical={`https://agendamentosautolimpeza.lovable.app/blog/${post.slug}`}
    >
      <article className="pt-40 pb-32">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto">
            
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-12 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
            </Link>

            <header className="space-y-8 mb-16">
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <span className="px-3 py-1 bg-primary text-black rounded-full">{post.category}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.read_minutes} MIN DE LEITURA</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95]">
                {post.title}
              </h1>

              <p className="text-xl md:text-2xl text-white/60 font-medium italic leading-relaxed">
                "{post.excerpt}"
              </p>

              <div className="aspect-[21/9] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={post.image_url || `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80`} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none">
              <BlockRenderer blocks={post.blocks} />
            </div>

            <footer className="mt-20 pt-10 border-t border-white/10 space-y-12">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="rounded-full border-white/10 text-xs font-black uppercase tracking-widest gap-2">
                  <Share2 className="w-4 h-4" /> Compartilhar
                </Button>
              </div>

              <div className="bg-primary rounded-[3rem] p-12 text-center space-y-8 shadow-2xl shadow-primary/20">
                <h3 className="text-3xl font-black text-[#090F15] uppercase tracking-tighter leading-none">Gostou da dica?</h3>
                <p className="text-[#090F15]/70 font-bold max-w-md mx-auto italic">Solicite agora um orçamento sem compromisso e deixe seu estofado novo de novo!</p>
                <Button size="lg" className="bg-[#090F15] text-white hover:bg-black rounded-2xl h-16 px-10 font-black uppercase tracking-widest" asChild>
                  <Link to="/agendamento">Agendar Agora</Link>
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}