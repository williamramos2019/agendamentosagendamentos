import { useEffect, useState } from "react";
import { 
  ArrowLeft, MapPin, Sofa, Bed, Car, HardHat, Sparkles, 
  CheckCircle2, Star, ShieldCheck, Zap, MessageSquare, 
  ChevronRight, Calendar, Phone, Info, HelpCircle
} from "lucide-react";
import { NeighborhoodService } from "@/services/NeighborhoodService";
import { Neighborhood } from "@/repositories/NeighborhoodRepository";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { cn } from "@/lib/utils";

interface NeighborhoodPageProps {
  citySlug: string;
  neighborhoodSlug: string;
  onBack: () => void;
  onStartBooking: (serviceId?: string) => void;
  onNavigate: (path: string) => void;
  onOpenPost?: (slug: string) => void;
}

const SERVICOS = [
  { id: "sofa", nome: "Higienização de Sofá", icon: Sofa, desc: "Remoção de manchas, odores e ácaros com secagem rápida." },
  { id: "colchao", nome: "Limpeza de Colchão", icon: Bed, desc: "Tratamento antialérgico profundo para noites de sono saudáveis." },
  { id: "auto-interna", nome: "Estética Automotiva", icon: Car, desc: "Higienização completa de bancos, teto e carpetes do seu veículo." },
  { id: "impermeabilizacao", nome: "Impermeabilização", icon: Sparkles, desc: "Proteção avançada contra líquidos e sujeiras do dia a dia." },
  { id: "pos-obra", nome: "Limpeza Pós-Obra", icon: HardHat, desc: "Remoção técnica de resíduos finos, gesso e pintura após reformas." },
];

export function NeighborhoodPage({ 
  citySlug, 
  neighborhoodSlug, 
  onBack, 
  onStartBooking,
  onNavigate
}: NeighborhoodPageProps) {
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [loading, setLoading] = useState(true);
  const [otherNeighborhoods, setOtherNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await NeighborhoodService.getNeighborhoodBySlug(citySlug, neighborhoodSlug);
      setNeighborhood(data);
      
      const all = await NeighborhoodService.getNeighborhoods();
      // Filtrar bairros da mesma cidade (ou da outra) para linkagem interna
      setOtherNeighborhoods(all.filter(n => n.slug !== neighborhoodSlug).slice(0, 8));
      
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    loadData();
  }, [citySlug, neighborhoodSlug]);

  // SEO e Meta Tags
  useEffect(() => {
    if (!neighborhood) return;
    
    const neighborhoodName = neighborhood.name;
    const cityName = neighborhood.city;
    const title = `Higienização de Sofá no Bairro ${neighborhoodName} em ${cityName} MG — Auto Limpeza Pro`;
    const description = `Especialistas em higienização de sofás, colchões e estética automotiva no bairro ${neighborhoodName}, ${cityName}. Atendimento rápido, produtos antialérgicos e garantia total. Agende agora!`;
    
    const prevTitle = document.title;
    document.title = title;

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

    const restoreDesc = setMeta("description", description);

    // JSON-LD LocalBusiness + AreaServed
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "neighborhood-jsonld";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Higienização de Estofados",
      "provider": {
        "@type": "LocalBusiness",
        "name": COMPANY_INFO.nome,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressRegion": "MG"
        }
      },
      "areaServed": {
        "@type": "Place",
        "name": `${neighborhoodName}, ${cityName}`
      },
      "description": description
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      restoreDesc();
      document.getElementById("neighborhood-jsonld")?.remove();
    };
  }, [neighborhood]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!neighborhood) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center p-6 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-xl font-bold text-white mb-2">Bairro não localizado</h2>
        <p className="text-sm text-muted-foreground mb-6">Não encontramos informações específicas para esta região no momento.</p>
        <button onClick={onBack} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Voltar ao início</button>
      </div>
    );
  }

  const cityName = neighborhood.city;
  const neighborhoodName = neighborhood.name;

  return (
    <div className="min-h-screen bg-[#020817] pb-32">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/5 safe-top">
        <div className="px-5 py-4 flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{cityName} • MG</p>
            <h1 className="text-sm font-bold text-white truncate">{neighborhoodName}</h1>
          </div>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-12">
        {/* Headline SEO */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <MapPin className="h-3 w-3" /> Atendimento no {neighborhoodName}
          </div>
          <h2 className="text-3xl font-black text-white leading-[1.1] tracking-tight">
            Higienização de Sofá no Bairro <span className="text-primary italic">{neighborhoodName}</span> em {cityName}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Procurando por limpeza de estofados profissional em {cityName}? A {COMPANY_INFO.nome} é especialista em devolver a saúde e beleza ao seu lar, atendendo com rapidez e excelência em todo o bairro {neighborhoodName}.
          </p>
          <button 
            onClick={() => onStartBooking()}
            className="w-full h-14 bg-primary rounded-2xl flex items-center justify-center gap-3 text-white font-black text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <Calendar className="h-5 w-5" /> Agendar Visita Técnica
          </button>
        </section>

        {/* Serviços */}
        <section className="space-y-5">
          <h3 className="text-xs font-black text-primary uppercase tracking-widest">Serviços Disponíveis</h3>
          <div className="grid gap-3">
            {SERVICOS.map((s) => (
              <button 
                key={s.id} 
                onClick={() => onStartBooking(s.id)}
                className="w-full flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{s.nome}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground self-center" />
              </button>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section className="bg-primary/5 border-y border-white/5 -mx-5 px-5 py-12 space-y-8">
          <div className="text-center space-y-2">
             <h3 className="text-2xl font-black text-white">Por que somos referência em {cityName}?</h3>
             <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">Tecnologia, segurança e compromisso com o resultado.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CheckCircle2, title: "Produtos Antialérgicos", desc: "Seguro para pets e crianças", color: "text-blue-400" },
              { icon: Star, title: "Equipe Certificada", desc: "Técnicos especialistas", color: "text-indigo-400" },
              { icon: ShieldCheck, title: "Garantia de 7 Dias", desc: "Satisfação total ou ajuste", color: "text-emerald-400" },
              { icon: Zap, title: "Atendimento Rápido", desc: "Chegamos em minutos", color: "text-amber-400" }
            ].map((item, i) => (
              <div key={i} className="bg-[#020817] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <item.icon className={cn("h-6 w-6", item.color)} />
                <p className="text-[11px] font-bold text-white leading-tight">{item.title}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prova Local */}
        <section className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-white/10 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <h3 className="font-black text-xl text-white">Atendimento Diário no {neighborhoodName}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Já atendemos mais de 250 residências apenas no bairro <span className="text-white font-bold">{neighborhoodName}</span> este ano. Conhecemos bem a região e garantimos pontualidade e discrição no atendimento.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020817] bg-muted flex items-center justify-center text-[10px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Vizinhos satisfeitos na região</p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog / Dicas Relacionadas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Dicas de Especialista</h3>
            <button onClick={() => onNavigate("/blog")} className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              Ver Blog <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
             <button 
               onClick={() => onNavigate("/blog/como-limpar-sofa-suede")}
               className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-left active:scale-[0.98] transition"
             >
               <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                 <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80" alt="Blog" className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="text-xs font-bold text-white line-clamp-1">Como manter seu sofá limpo por mais tempo</p>
                 <p className="text-[10px] text-muted-foreground mt-1">Dicas práticas para o dia a dia no {neighborhoodName}.</p>
               </div>
             </button>
          </div>
        </section>

        {/* FAQ Local */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-white uppercase tracking-widest">Dúvidas Frequentes</h3>
          </div>
          <div className="space-y-3">
            {[
              { q: `A Auto Limpeza Pro atende no bairro ${neighborhoodName}?`, a: `Sim! Temos equipes dedicadas que atendem diariamente no ${neighborhoodName} e em toda a cidade de ${cityName}.` },
              { q: `Quanto custa a limpeza de sofá em ${neighborhoodName}?`, a: `Os valores dependem do tamanho e tecido, mas nossos serviços começam em R$ 180. Solicite um orçamento instantâneo pelo WhatsApp.` },
              { q: `Quanto tempo demora o serviço em ${cityName}?`, a: `Uma higienização padrão leva entre 1h30 e 2h30, dependendo do estado do estofado.` },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-sm font-bold text-white">{item.q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Linkagem Interna */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-widest">Outras Regiões Atendidas</h3>
          <div className="grid grid-cols-2 gap-2">
            {otherNeighborhoods.map((n) => (
              <button 
                key={n.id}
                onClick={() => onNavigate(`/bairro/${n.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}/${n.slug}`)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-muted-foreground hover:text-white transition-all text-center"
              >
                {n.name}
              </button>
            ))}
          </div>
        </section>

        {/* CTA WhatsApp */}
        <section className="pt-8">
           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-5">
             <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
               <MessageSquare className="h-8 w-8 text-white" />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl font-black text-white">Falar com Especialista</h3>
               <p className="text-xs text-muted-foreground">Tire suas dúvidas e receba um orçamento personalizado para o bairro {neighborhoodName}.</p>
             </div>
             <a 
               href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Olá! Estou no bairro ${neighborhoodName} em ${cityName} e gostaria de um orçamento para higienização.`)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full h-14 bg-emerald-500 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
             >
               <Phone className="h-5 w-5" /> WhatsApp Direto
             </a>
           </div>
        </section>
      </main>

      {/* Rodapé SEO */}
      <footer className="mt-20 px-5 py-10 border-t border-white/5 bg-white/2">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest text-center">
              Auto Limpeza Pro • Especialistas em Higienização Local
            </p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => onNavigate("/blog")} className="text-[10px] font-bold text-muted-foreground uppercase hover:text-primary transition-colors">Blog</button>
             <button onClick={() => onNavigate("/mapa-do-site")} className="text-[10px] font-bold text-muted-foreground uppercase hover:text-primary transition-colors">Mapa do Site</button>
             <button onClick={() => onNavigate("/")} className="text-[10px] font-bold text-muted-foreground uppercase hover:text-primary transition-colors">Início</button>
          </div>
          <p className="text-[9px] text-muted-foreground text-center leading-relaxed">
            Atendimento especializado em Vespasiano, São José da Lapa e toda a região metropolitana norte de BH. <br />
            © 2026 Auto Limpeza Pro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}