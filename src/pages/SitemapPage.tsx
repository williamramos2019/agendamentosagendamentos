import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MapPin, BookOpen, Link as LinkIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SitemapPage() {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [nRes, pRes] = await Promise.all([
        supabase.from("neighborhoods").select("*").order("city").order("name"),
        supabase.from("blog_posts").select("slug, title").order("published_at", { ascending: false })
      ]);
      if (nRes.data) setNeighborhoods(nRes.data);
      if (pRes.data) setPosts(pRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const sections = [
    {
      title: "Páginas Principais",
      icon: LinkIcon,
      links: [
        { label: "Início", path: "/" },
        { label: "Agendamento Online", path: "/agendamento" },
        { label: "Blog & Dicas", path: "/blog" },
        { label: "Planos de Assinatura", path: "/planos" },
        { label: "Mapa do Site", path: "/sitemap" },
      ]
    },
    {
      title: "Nossos Serviços",
      icon: MapPin,
      links: [
        { label: "Higienização de Sofás", path: "/agendamento?s=sofa" },
        { label: "Estética Automotiva", path: "/agendamento?s=auto" },
        { label: "Limpeza de Colchões", path: "/agendamento?s=colchao" },
        { label: "Lavagem de Tapetes", path: "/agendamento?s=tapete" },
        { label: "Limpeza Pós-Obra", path: "/agendamento?s=pos-obra" },
      ]
    }
  ];

  const groupedNeighborhoods = neighborhoods.reduce((acc: any, curr) => {
    if (!acc[curr.city]) acc[curr.city] = [];
    acc[curr.city].push(curr);
    return acc;
  }, {});

  return (
    <PublicLayout title="Mapa do Site | Auto Limpeza Pro" description="Navegue por todas as páginas, serviços, bairros e artigos do blog da Auto Limpeza Pro.">
      <section className="pt-40 pb-32">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">Mapa do Site</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Total de 118 URLs indexadas para SEO</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {sections.map((section, i) => (
                <div key={i} className="space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <section.icon className="w-5 h-5" />
                    <h3 className="text-lg font-black uppercase tracking-tight">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, j) => (
                      <li key={j}>
                        <Link to={link.path} className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-primary/10 hover:border-primary/20 transition-all">
                          <span className="text-sm font-bold text-white/80 group-hover:text-white">{link.label}</span>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-3 text-primary">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-black uppercase tracking-tight">Artigos do Blog</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold text-white/70">
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex items-center gap-3 text-primary">
                <MapPin className="w-5 h-5" />
                <h3 className="text-lg font-black uppercase tracking-tight">Cobertura por Bairro</h3>
              </div>
              
              {Object.keys(groupedNeighborhoods).map(city => (
                <div key={city} className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2">{city}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {groupedNeighborhoods[city].map((n: any) => (
                      <Link 
                        key={n.slug} 
                        to={`/blog/higienizacao-estofados-${n.slug}-${n.city_slug}`} 
                        className="p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-primary/5 hover:text-primary transition-all text-[10px] font-black uppercase tracking-wider text-center"
                      >
                        {n.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}