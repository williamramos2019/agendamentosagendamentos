import { useState, useEffect } from "react";
import { Sparkles, Sofa, Bed, Car, CarFront, HardHat, Armchair, ArrowRight, Calendar, Clock, ShieldCheck, Star, Phone, MapPin, Baby, BedDouble, Utensils, LayoutDashboard, Map, Instagram, CheckCircle2, Zap, MessageSquare } from "lucide-react";

import type { CustomerLocation } from "@/hooks/useCustomerLocation";
import { PlansHighlight } from "@/components/plans/PlansHighlight";
import { NotificationsBanner } from "@/components/pwa/NotificationsBanner";
import { LeadCaptureModal } from "./LeadCaptureModal";
import logoAutoLimpeza from "@/assets/auto-limpeza-pro-logo.jpg";
import mascote from "@/assets/mascote-auto-limpeza-pro.png";
import { COMPANY_INFO } from "@/config/whatsappTemplate";

interface SmartHomeProps {
  onStartBooking: (serviceId?: string) => void;
  customerLocation?: CustomerLocation | null;
  locationStatus: "idle" | "requesting" | "allowed" | "denied" | "unavailable";
  onOpenAdmin?: () => void;
  onOpenPlans?: () => void;
  onOpenSiteMap?: () => void;
}

const QUICK_SERVICES = [
  { id: "sofa", icon: Sofa, name: "Sofá", from: 180, tag: "Mais pedido", highlight: true },
  { id: "colchao", icon: Bed, name: "Colchão", from: 130, tag: "Popular", highlight: true },
  { id: "auto-interna", icon: Car, name: "Automóvel", from: 200, tag: "Mais vendido", highlight: true },
  { id: "poltrona", icon: Armchair, name: "Poltrona", from: 110 },
  { id: "colchao-infantil", icon: BedDouble, name: "Colchão infantil", from: 90 },
  { id: "tapete", icon: LayoutDashboard, name: "Tapete", from: 90 },
  { id: "cadeiras", icon: Utensils, name: "Cadeiras", from: 70 },
  { id: "bebe-conforto", icon: Baby, name: "Bebê conforto", from: 100, tag: "Infantil" },
  { id: "cadeirinha-auto", icon: CarFront, name: "Cadeirinha auto", from: 120 },
  { id: "impermeabilizacao", icon: Sparkles, name: "Impermeabilização", from: 160, tag: "Premium" },
  { id: "pos-obra", icon: HardHat, name: "Pós-obra", from: 300 },
];

const TESTIMONIALS = [
  { name: "Ana Beatriz M.", location: "Vespasiano", rating: 5, text: "Serviço impecável! O sofá ficou novo em folha. Profissional e pontual. Recomendo sem dúvida!", date: "2 semanas atrás" },
  { name: "Carlos Henrique", location: "São José da Lapa", rating: 5, text: "Interior do carro completamente renovado. Manchas antigas sumiram. Melhor serviço de estética da região!", date: "1 mês atrás" },
  { name: "Fernanda L.", location: "Ribeirão das Neves", rating: 5, text: "Limpeza pós-obra perfeita, antes do prazo combinado. Equipe educada, cuidadosa e muito eficiente.", date: "3 semanas atrás" },
];

const RECENT_BOOKINGS = [
  { name: "Carlos", location: "São José da Lapa", service: "Automóvel" },
  { name: "Mariana", location: "Vespasiano", service: "Sofá 3 lugares" },
  { name: "Roberto", location: "Lagoa Santa", service: "Colchão King" },
  { name: "Juliana", location: "Pedro Leopoldo", service: "Impermeabilização" },
];

export function SmartHome({ onStartBooking, customerLocation, locationStatus, onOpenAdmin, onOpenPlans, onOpenSiteMap }: SmartHomeProps) {
  const [recentBookingIdx, setRecentBookingIdx] = useState(0);
  const [showRecent, setShowRecent] = useState(true);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowRecent(false);
      setTimeout(() => {
        setRecentBookingIdx((prev) => (prev + 1) % RECENT_BOOKINGS.length);
        setShowRecent(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentRecent = RECENT_BOOKINGS[recentBookingIdx];

  const locationText = customerLocation
    ? `${customerLocation.city ?? "Localização detectada"}${customerLocation.state ? `, ${customerLocation.state}` : ""} • ${customerLocation.distanceKm} km`
    : locationStatus === "requesting"
      ? "Buscando sua localização para facilitar o agendamento..."
      : "São José da Lapa, Vespasiano e região";

  return (
    <div className="min-h-screen bg-[#020817] pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col">
        {/* Header */}
        <header className="px-5 pt-8 pb-4 safe-top flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center overflow-hidden">
              <img src={logoAutoLimpeza} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Bem-vindo à</p>
              <p className="font-bold text-sm text-foreground">Auto Limpeza Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/autolimpezapro/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white active:scale-90 transition-transform">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de um orçamento.")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center text-white active:scale-90 transition-transform">
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-5 pt-4">
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Atende hoje
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary whitespace-nowrap">
              Resposta em menos de 5 min
            </div>
          </div>

          <div className="relative flex items-end">
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-1.5 text-primary mb-2">
                <MapPin className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">SJ Lapa · Vespasiano e região</span>
              </div>
              <h1 className="text-3xl font-black text-white leading-[1.1] mb-2">
                Higienização <br />
                <span className="text-primary italic">profissional</span> <br />
                em minutos
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Estofados · Automotiva · Pós-obra <br />
                Equipe local certificada
              </p>
            </div>
            <div className="absolute right-2 bottom-0 w-[42%] max-w-[260px] z-10">
              <img 
                src={mascote} 
                alt="Mascote" 
                className="w-full h-auto drop-shadow-[0_0_30px_rgba(14,165,255,0.4)] origin-bottom" 
              />
            </div>
          </div>
        </section>

        {/* Recent Booking Notification */}
        <section className="px-5 h-12 mb-2">
          <div className={`h-full flex items-center gap-3 px-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 ${showRecent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[11px] text-muted-foreground">
              <span className="font-black text-white">{currentRecent.name}</span> de <span className="text-white">{currentRecent.location}</span> acabou de agendar <span className="font-bold text-primary">{currentRecent.service}</span>
            </p>
          </div>
        </section>

        {/* Primary Booking Bar */}

        <section className="px-5 mt-4">
          <button
            onClick={() => onStartBooking()}
            className="w-full h-16 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] active:scale-[0.98] transition-all flex items-center gap-4 px-4 text-white relative overflow-hidden group shadow-[0_8px_30px_rgba(14,165,255,0.3)]"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[10px] font-bold uppercase opacity-80 leading-none mb-1">Comece agora, sem cadastro</p>
              <p className="text-lg font-black tracking-tight leading-none">Agendar Agora</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
          
          <div className="flex items-center gap-2 mt-3 px-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <p className="text-[11px] text-muted-foreground font-medium">{locationText}</p>
          </div>
        </section>

        <NotificationsBanner />

        {/* Why Choose Us */}
        <section className="px-5 mt-10 grid grid-cols-2 gap-3">
          {[
            { icon: CheckCircle2, title: "Produtos antialérgicos", desc: "Certificados e seguros", color: "text-blue-400" },
            { icon: Star, title: "Equipe certificada", desc: "Treinamento constante", color: "text-indigo-400" },
            { icon: ShieldCheck, title: "Garantia total", desc: "Refazemos se precisar", color: "text-emerald-400" },
            { icon: Zap, title: "Resposta em 5 min", desc: "Sempre disponível", color: "text-amber-400" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">{item.title}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Services Grid */}
        <section className="px-5 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary">Serviços</h2>
            <button onClick={() => onStartBooking()} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <p className="text-xl font-black text-white mb-5 leading-tight">O que você precisa limpar?</p>
          
          <div className="grid grid-cols-3 gap-3">
            {QUICK_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => onStartBooking(s.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all relative overflow-hidden group active:scale-95 ${
                    s.highlight 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(14,165,255,0.15)] scale-[1.02] z-10" 
                    : "bg-secondary/50 border-white/5 hover:border-primary/50"
                  }`}
                >
                  {s.tag && (
                    <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                      s.highlight ? "bg-primary text-white" : "bg-primary/20 text-primary"
                    }`}>
                      {s.tag}
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    s.highlight ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-white mb-0.5 leading-tight">{s.name}</p>
                    <p className={`text-[9px] ${s.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      a partir R${s.from}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Process Section */}
        <section className="px-5 mt-12 bg-white/5 border-y border-white/10 py-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Processo</p>
           <h2 className="text-2xl font-black text-white mb-8">Do pedido à limpeza</h2>
           <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:to-primary/20">
             {[
               { t: "Escolha em poucos toques", d: "Sofá, colchão, tapete, automóvel ou pós-obra" },
               { t: "Receba orçamento rápido", d: "Sem cadastro. Resposta em menos de 5 minutos" },
               { t: "Equipe local vai até você", d: "São José da Lapa, Vespasiano e bairros próximos" },
             ].map((step, i) => (
               <div key={i} className="flex items-start gap-6 pl-1.5 relative z-10">
                 <div className="w-7 h-7 rounded-full bg-[#020817] border-2 border-primary flex items-center justify-center text-[10px] font-black text-primary shadow-[0_0_15px_rgba(14,165,255,0.4)]">
                   {i + 1}
                 </div>
                 <div className="flex-1">
                   <p className="font-bold text-white text-sm mb-1">{step.t}</p>
                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">{step.d}</p>
                 </div>
               </div>
             ))}
           </div>
         </section>
 
         {/* Testimonials */}
         <section className="px-5 mt-12">
           <div className="flex items-center justify-between mb-4">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Avaliações</p>
                <h2 className="text-xl font-black text-white">O que dizem no Google</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <span className="text-xl font-black text-white">4.9</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">120+ avaliações</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="min-w-[280px] bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3 h-3 grayscale opacity-50" />
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Google</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Commitment */}
        <section className="px-5 mt-10">
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Nosso compromisso</p>
              <h2 className="text-2xl font-black text-white mb-2">100% Satisfação Garantida</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">
                Não ficou satisfeito? Refazemos o serviço sem custo adicional. Sua confiança é nossa prioridade.
              </p>
              <button onClick={() => onStartBooking()} className="px-5 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black flex items-center gap-2 transition-colors">
                Agendar com confiança <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
        </section>

        {/* Coverage */}
        <section className="px-5 mt-12 pb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Cobertura</p>
          <h2 className="text-xl font-black text-white mb-6">Nossa área de atendimento</h2>
          <div className="flex flex-wrap gap-2">
            {["São José da Lapa", "Vespasiano", "Ribeirão das Neves", "Pedro Leopoldo", "Matozinhos", "Lagoa Santa"].map((city, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-muted-foreground hover:text-white hover:border-primary transition-all">
                <MapPin className="h-3 w-3 text-primary" />
                {city}
              </div>
            ))}
          </div>
        </section>

        {/* Footer Blocks */}
        <section className="px-5 mb-10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 flex flex-col gap-4 hover:bg-emerald-500/20 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[13px] font-black text-white leading-tight">Orçamento rápido</p>
                <p className="text-[10px] text-emerald-400/80 font-bold">Respondemos em minutos</p>
              </div>
            </button>
            <a href="https://www.instagram.com/autolimpezapro/" target="_blank" rel="noopener noreferrer" className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-5 flex flex-col gap-4 hover:bg-purple-500/20 transition-all group active:scale-[0.98]">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]">
                <Instagram className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[13px] font-black text-white leading-tight">Siga no Instagram</p>
                <p className="text-[10px] text-purple-400/80 font-bold">@autolimpezapro</p>
              </div>
            </a>
          </div>

          <button
            onClick={onOpenSiteMap}
            className="w-full h-20 rounded-3xl bg-[#0F172A] border border-white/5 flex items-center gap-4 px-5 hover:border-primary/50 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Map className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] font-black text-white leading-tight">Mapa do site</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Serviços, cidades e bairros atendidos</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>

        {/* Discreet admin entry */}
        {onOpenAdmin && (
          <div className="px-5 mb-20 flex justify-center">
            <button
              onClick={onOpenAdmin}
              className="text-[10px] text-muted-foreground/40 hover:text-primary flex items-center gap-1 py-4 uppercase tracking-widest font-bold"
              aria-label="Acesso administrativo"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>área restrita</span>
            </button>
          </div>
        )}
      </div>

      <LeadCaptureModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </div>
  );
}