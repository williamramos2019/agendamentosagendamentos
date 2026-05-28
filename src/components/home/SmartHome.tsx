import { useState, useEffect } from "react";
import { Sparkles, Sofa, Bed, Car, CarFront, HardHat, Armchair, ArrowRight, Calendar, Clock, ShieldCheck, Star, Phone, MapPin, Baby, BedDouble, Utensils, LayoutDashboard, Map, Instagram, CheckCircle2, Zap, MessageSquare, Shield, FileText, HelpCircle } from "lucide-react";

import type { CustomerLocation } from "@/hooks/useCustomerLocation";
import { PlansHighlight } from "@/components/plans/PlansHighlight";
import { NotificationsBanner } from "@/components/pwa/NotificationsBanner";
import { LeadCaptureModal } from "./LeadCaptureModal";
import logoAutoLimpeza from "@/assets/auto-limpeza-pro-logo.jpg";
import mascote from "@/assets/mascote-auto-limpeza-pro.png";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { Footer } from "@/components/layout/Footer";

interface SmartHomeProps {
  onStartBooking: (serviceId?: string) => void;
  customerLocation?: CustomerLocation | null;
  locationStatus: "idle" | "requesting" | "allowed" | "denied" | "unavailable";
  onOpenAdmin?: () => void;
  onOpenPlans?: () => void;
  onOpenSiteMap?: () => void;
  onNavigate?: (path: string) => void;
}

const QUICK_SERVICES = [
  { id: "sofa", icon: Sofa, name: "Sofá", from: 180, tag: "Mais pedido", tagColor: "bg-cyan-400 text-slate-900", textColor: "text-cyan-400" },
  { id: "auto-interna", icon: Car, name: "Automóvel", from: 200, tag: "Estética", tagColor: "bg-violet-400 text-slate-900", textColor: "text-violet-400" },
  { id: "colchao", icon: Bed, name: "Colchão", from: 130 },
  { id: "poltrona", icon: Armchair, name: "Poltrona", from: 110 },
  { id: "impermeabilizacao", icon: Sparkles, name: "Impermeabilização", from: 160, tag: "Premium", tagColor: "bg-orange-400 text-slate-900", textColor: "text-orange-400" },
  { id: "tapete", icon: LayoutDashboard, name: "Tapete", from: 90 },
  { id: "cadeiras", icon: Utensils, name: "Cadeiras", from: 70 },
  { id: "bebe-conforto", icon: Baby, name: "Bebê conforto", from: 100, tag: "Infantil", tagColor: "bg-emerald-400 text-slate-900", textColor: "text-emerald-400" },
  { id: "cadeirinha-auto", icon: CarFront, name: "Cadeirinha auto", from: 120 },
  { id: "colchao-infantil", icon: BedDouble, name: "Colchão infantil", from: 90 },
  { id: "pos-obra", icon: HardHat, name: "Pós-obra", from: 300 },
];


const TESTIMONIALS = [
  { name: "Ana Beatriz M.", location: "Vespasiano", rating: 5, text: "Serviço impecável! O sofá ficou novo em folha. Profissional e pontual. Recomendo sem dúvida!", date: "2 semanas atrás" },
  { name: "Carlos Henrique", location: "São José da Lapa", rating: 5, text: "Interior do carro completamente renovado. Manchas antigas sumiram. Melhor serviço de estética da região!", date: "1 mês atrás" },
  { name: "Fernanda L.", location: "Ribeirão das Neves", rating: 5, text: "Limpeza pós-obra perfeita, antes do prazo combinado. Equipe educada, cuidadosa e muito eficiente.", date: "3 semanas atrás" },
  { name: "Ricardo Santos", location: "Lagoa Santa", rating: 5, text: "O colchão ficou cheiroso e extremamente limpo. Estavam com umas manchas amarelas que saíram tudo. Nota 10!", date: "1 semana atrás" },
  { name: "Mariana Costa", location: "Pedro Leopoldo", rating: 5, text: "Excelente atendimento desde o primeiro contato no WhatsApp. O técnico foi muito caprichoso com meu sofá de linho.", date: "4 dias atrás" },
  { name: "Paulo Oliveira", location: "Confins", rating: 5, text: "Contratei para a higienização das cadeiras de jantar e fiquei surpreso com o resultado. Parecem novas!", date: "1 mês atrás" },
  { name: "Juliana Mendes", location: "Vespasiano", rating: 5, text: "Melhor investimento que fiz. Meu tapete persa foi tratado com muito cuidado e a cor voltou a ser vibrante.", date: "2 meses atrás" },
  { name: "Marcos Vinícius", location: "Santa Luzia", rating: 5, text: "O serviço de impermeabilização é excelente. Derrubamos café no sofá ontem e não manchou nada!", date: "3 semanas atrás" },
  { name: "Beatriz Soares", location: "Matozinhos", rating: 5, text: "Fiquei muito satisfeita com a limpeza do bebê conforto e da cadeirinha. Segurança e higiene para meu filho.", date: "5 dias atrás" },
  { name: "Roberto Almeida", location: "São José da Lapa", rating: 5, text: "Profissionais muito educados e o serviço de estética automotiva interna superou minhas expectativas.", date: "2 semanas atrás" },
  { name: "Clara Fonseca", location: "Vespasiano", rating: 5, text: "Minha poltrona de amamentação estava bem suja e agora está impecável. Recomendo muito o trabalho deles.", date: "1 semana atrás" },
  { name: "André Luiz", location: "Lagoa Santa", rating: 5, text: "Rápido, prático e eficiente. O agendamento pelo site facilitou muito minha vida. Parabéns pela organização.", date: "3 dias atrás" },
  { name: "Patrícia Lima", location: "Pedro Leopoldo", rating: 5, text: "Limpeza de tapetes nota mil! Buscaram e entregaram no prazo, tudo muito bem embalado e limpinho.", date: "6 dias atrás" },
];

const RECENT_BOOKINGS = [
  { name: "Carlos", location: "São José da Lapa", service: "Automóvel" },
  { name: "Mariana", location: "Vespasiano", service: "Sofá 3 lugares" },
  { name: "Roberto", location: "Lagoa Santa", service: "Colchão King" },
  { name: "Juliana", location: "Pedro Leopoldo", service: "Impermeabilização" },
];

export function SmartHome({ onStartBooking, customerLocation, locationStatus, onOpenAdmin, onOpenPlans, onOpenSiteMap, onNavigate }: SmartHomeProps) {
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
        <header className="px-5 py-6 safe-top flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-white/5">
              <img src={logoAutoLimpeza} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary leading-none">Bem-vindo à</p>
              <p className="font-black text-white leading-tight mt-0.5">Auto Limpeza Pro</p>
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
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-5 -mx-5">
            {QUICK_SERVICES.map((s) => {
              const Icon = s.icon;
              const tagColor = "tagColor" in s ? s.tagColor : "";
              return (
                <button
                  key={s.id}
                  onClick={() => onStartBooking(s.id)}
                  className="flex flex-col items-center gap-3 pt-8 pb-6 px-4 rounded-[32px] bg-white/5 border border-white/5 hover:border-primary/30 transition-all relative group active:scale-95 shrink-0 w-[140px] snap-start shadow-xl"
                >
                  {s.tag && (
                    <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg ${tagColor} border border-white/10`}>
                      {s.tag}
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${"textColor" in s ? s.textColor : "text-primary"}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className={`text-[13px] font-black mb-1 leading-tight ${"textColor" in s ? s.textColor : "text-white"}`}>{s.name}</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">a partir R${s.from}</p>
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
 

         {/* Strategic Blog Entry Point */}
         <section className="px-5 mt-16">
           <div className="bg-gradient-to-br from-primary/15 to-accent/5 rounded-[32px] p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
             <div className="relative z-10 max-w-[200px]">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Conteúdo Premium</p>
               <h2 className="text-xl font-black text-white leading-tight mb-4 uppercase tracking-tighter">Portal de Dicas & Notícias</h2>
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed mb-6">
                 Saúde, cuidados com estofados e novidades da região de SJ Lapa.
               </p>
               <button 
                 onClick={() => window.open("https://blogatolimpezapro.lovable.app", "_blank")}
                 className="flex items-center gap-2 bg-primary text-[#020817] px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
               >
                 Acessar Blog <ArrowRight className="h-3 w-3" />
               </button>
             </div>
             <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 group-hover:opacity-50 transition-opacity">
               <img 
                 src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80" 
                 alt="Blog Preview" 
                 className="w-full h-full object-cover scale-110 rotate-3 group-hover:rotate-0 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#020817]/40 to-[#020817]" />
             </div>
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
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic">"{t.text}"</p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[10px] text-muted-foreground">{t.date}</span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Cliente Verificado
                  </div>
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

        {/* Footer / Links Legais */}
        <footer className="px-5 mt-16 pt-10 pb-10 border-t border-white/5 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">A Empresa</h3>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate?.("/blog")} className="text-xs text-muted-foreground hover:text-primary transition-colors">Blog & Dicas</button></li>
                <li><button onClick={() => onOpenPlans?.()} className="text-xs text-muted-foreground hover:text-primary transition-colors">Planos Mensais</button></li>
                <li><button onClick={() => onOpenSiteMap?.()} className="text-xs text-muted-foreground hover:text-primary transition-colors">Mapa do Site</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Suporte</h3>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate?.("/faq")} className="text-xs text-muted-foreground hover:text-primary transition-colors">Dúvidas Frequentes</button></li>
                <li><button onClick={() => onNavigate?.("/politica-de-privacidade")} className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacidade</button></li>
                <li><button onClick={() => onNavigate?.("/termos-de-uso")} className="text-xs text-muted-foreground hover:text-primary transition-colors">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/autolimpezapro/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-emerald-400 transition-all">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              © 2026 Auto Limpeza Pro. Todos os direitos reservados.<br />
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </footer>

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
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
