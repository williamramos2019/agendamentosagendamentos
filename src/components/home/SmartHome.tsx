import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  Award, 
  ChevronRight, 
  Calendar, 
  Instagram, 
  MessageSquare,
  Search,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { LeadCaptureModal } from "./LeadCaptureModal";

interface SmartHomeProps {
  onStartBooking: (serviceId?: string) => void;
  customerLocation?: any;
  locationStatus?: any;
  onOpenAdmin?: () => void;
  onOpenPlans?: () => void;
  onOpenSiteMap?: () => void;
  onNavigate?: (path: string) => void;
}

const SERVICES = [
  { id: "sofa", name: "Sofá", price: "180", badge: "Mais pedido", icon: "🛋️" },
  { id: "auto", name: "Automóvel", price: "200", badge: "Estética", icon: "🚗" },
  { id: "colchao", name: "Colchão", price: "130", icon: "🛏️" },
  { id: "poltrona", name: "Poltrona", price: "110", icon: "💺" },
  { id: "impermeabilizacao", name: "Impermeabilização", price: "160", badge: "Premium", icon: "✨" },
  { id: "tapete", name: "Tapete", price: "90", icon: "🧶" },
  { id: "cadeiras", name: "Cadeiras", price: "70", icon: "🪑" },
  { id: "bebe-conforto", name: "Bebê conforto", price: "100", badge: "Infantil", icon: "👶" },
  { id: "cadeirinha-auto", name: "Cadeirinha auto", price: "120", icon: "🧒" },
  { id: "colchao-infantil", name: "Colchão infantil", price: "90", icon: "🧸" },
  { id: "pos-obra", name: "Pós-obra", price: "300", icon: "🏗️" },
];

const REVIEWS = [
  { name: "Ana Beatriz M.", city: "Vespasiano", text: "Serviço impecável! O sofá ficou novo em folha. Profissional e pontual. Recomendo sem dúvida!", initials: "AB", time: "2 semanas atrás" },
  { name: "Carlos Henrique", city: "São José da Lapa", text: "Interior do carro completamente renovado. Manchas antigas sumiram. Melhor serviço de estética da região!", initials: "CH", time: "1 mês atrás" },
  { name: "Fernanda L.", city: "Ribeirão das Neves", text: "Limpeza pós-obra perfeita, antes do prazo combinado. Equipe educada, cuidadosa e muito eficiente.", initials: "FL", time: "3 semanas atrás" },
  { name: "Roberto A.", city: "Pedro Leopoldo", text: "Impermeabilização do estofado excelente. Qualidade do produto e do serviço é diferenciada. 10/10!", initials: "RA", time: "1 mês atrás" },
  { name: "Juliana S.", city: "Vespasiano", text: "Colchão limpo e sem cheiro. Produto antialérgico fez diferença. Minha filha dormiu muito melhor!", initials: "JS", time: "2 meses atrás" },
  { name: "Marcos R.", city: "São José da Lapa", text: "Equipe muito profissional, chegaram no horário, resultado excelente. Já agendei novamente!", initials: "MR", time: "3 semanas atrás" },
];

export function SmartHome({ 
  onStartBooking, 
  customerLocation, 
  locationStatus,
  onOpenAdmin,
  onOpenPlans,
  onOpenSiteMap,
  onNavigate 
}: SmartHomeProps) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [toastText, setToastText] = useState("Ana de Vespasiano acabou de agendar Sofá");

  useEffect(() => {
    const texts = [
      "Ana de Vespasiano acabou de agendar Sofá",
      "Carlos de SJ Lapa acabou de agendar Estética Automotiva",
      "Fernanda de Neves acabou de agendar Pós-Obra",
      "Roberto de Pedro Leopoldo acabou de agendar Colchão"
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setToastText(texts[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      } as any
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090F15] text-white pb-32 selection:bg-primary selection:text-black">
      {/* Background Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-40" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
      {/* 1. Top bar fixa */}
      <header className="sticky top-0 z-50 glass-premium border-b border-white/5 px-5 py-3 flex items-center justify-between">
        <button onClick={onOpenAdmin} className="flex items-center gap-3 active:scale-95 transition-transform group">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden group-hover:bg-primary/20 transition-colors shadow-salon">
             <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] leading-none mb-0.5">Bem-vindo à</p>
            <h1 className="text-sm font-black tracking-tight text-white group-hover:text-primary transition-colors">Auto Limpeza Pro</h1>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <a 
            href="https://www.instagram.com/autolimpezapro/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FFB300] via-[#FF0050] to-[#5000FF] active:scale-90 transition-transform"
          >
            <Instagram className="w-5 h-5 text-white" />
          </a>
          <a 
            href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            WhatsApp
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <motion.section variants={itemVariants} className="px-5 pt-8 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">Atende hoje • Resposta em menos de 5 min</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <div className="p-1 rounded-md bg-primary/10 drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{customerLocation?.address || customerLocation?.city || "SJ Lapa · Vespasiano e região"}</span>
            </div>
            <h2 className="text-6xl font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-xl">
              Higienização<br />
              <span className="text-primary drop-shadow-[0_0_15px_rgba(31,177,249,0.4)]">profissional</span><br />
              <span className="text-4xl">em minutos</span>
            </h2>
            <div className="flex gap-4 pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estofados</span>
                <span className="w-full h-1 bg-primary/20 rounded-full mt-1 overflow-hidden">
                  <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 1, delay: 0.5 }} className="w-full h-full bg-primary" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Automotiva</span>
                <span className="w-full h-1 bg-primary/20 rounded-full mt-1 overflow-hidden">
                  <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 1, delay: 0.7 }} className="w-full h-full bg-primary" />
                </span>
              </div>
            </div>
          </div>

          {/* 3. CTA principal grande (ciano cheio) */}
          <button 
            onClick={() => onStartBooking()}
            className="w-full bg-primary text-[#090F15] p-1 rounded-[2rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-salon-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Comece agora, sem cadastro</p>
                <p className="text-xl font-black leading-none">Agendar Agora</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mr-1">
              <ArrowRight className="w-6 h-6" />
            </div>
          </button>
          {/* Mascote Hero */}
          <div className="absolute top-10 right-[-40px] w-64 h-64 opacity-50 pointer-events-none md:opacity-100 md:right-10 md:w-96 md:h-96">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full shadow-salon-lg" />
              <picture>
                <source srcSet="/mascote.webp" type="image/webp" />
                <motion.img 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="/mascote.png" 
                  alt="Mascote" 
                  className="w-full h-full object-contain relative z-10" 
                />
              </picture>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. Campo de localização */}
      <motion.section variants={itemVariants} className="px-5">
        <div className="glass-premium rounded-2xl p-4 flex items-center gap-4 shadow-salon transition-all active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Local de atendimento</p>
            <p className="text-sm font-bold">{customerLocation?.address || customerLocation?.city || "São José da Lapa, Vespasiano e região"}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </motion.section>

      {/* 5. Stats (3 cards lado a lado) */}
      <motion.section variants={itemVariants} className="px-5 pt-8 grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: "2.500+", sub: "Clientes" },
          { icon: Star, label: "4.9 ★", sub: "No Google" },
          { icon: Award, label: "8 anos", sub: "Experiência" }
        ].map((stat, i) => (
          <motion.div 
            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)" }}
            key={i} 
            className="glass-premium rounded-2xl p-4 flex flex-col items-center text-center gap-2"
          >
            <stat.icon className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(31,177,249,0.5)]" />
            <div>
              <p className="text-sm font-black text-white">{stat.label}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* 6. Toast de prova social */}
      <motion.section variants={itemVariants} className="px-5 pt-6">
        <div className="glass-premium border-success/10 rounded-full py-2.5 px-6 flex items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
          <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <p className="text-[11px] font-bold text-success/90 uppercase tracking-wide">{toastText}</p>
        </div>
      </motion.section>

      {/* 7. Card "Orçamento por formulário" */}
      <motion.section variants={itemVariants} className="px-5 pt-8">
        <button 
          onClick={() => setShowLeadModal(true)}
          className="w-full glass-premium rounded-2xl p-5 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/[0.06] shadow-salon"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(31,177,249,0.5)]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-white uppercase tracking-tight">Orçamento por formulário</p>
              <p className="text-[11px] text-muted-foreground font-medium">Resposta em até 1h · Sem compromisso</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>
      </motion.section>

      {/* 8. Catálogo de serviços */}
      <motion.section variants={itemVariants} className="px-5 pt-12 space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Serviços</p>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">O que você precisa limpar?</h3>
          </div>
          <button onClick={onOpenSiteMap} className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
            Ver todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {SERVICES.map((s) => (
            <motion.button 
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={s.id}
              onClick={() => onStartBooking(s.id)}
              className="relative aspect-square glass-premium rounded-2xl p-3 flex flex-col items-center justify-center gap-2 group transition-all overflow-hidden shadow-salon hover:shadow-salon-lg"
            >
              {s.badge && (
                <span className="absolute top-2 left-0 right-0 mx-auto w-fit px-2 py-0.5 rounded-full bg-primary text-[#090F15] text-[8px] font-black uppercase tracking-tighter shadow-salon">
                  {s.badge}
                </span>
              )}
              <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">{s.icon}</span>
              <div className="text-center">
                <p className="text-[10px] font-black text-white leading-tight uppercase group-hover:text-primary transition-colors">{s.name}</p>
                <p className="text-[8px] text-muted-foreground font-bold mt-0.5">a partir R${s.price}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* 9. "Por que escolher a Auto Limpeza Pro?" */}
      <motion.section variants={itemVariants} className="px-5 pt-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Diferenciais</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">Por que escolher a Auto Limpeza Pro?</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Produtos antialérgicos", sub: "Certificados e seguros", icon: "🛡️" },
            { title: "Equipe certificada", sub: "Treinamento constante", icon: "👨‍🔧" },
            { title: "Garantia total", sub: "Refazemos se precisar", icon: "✅" },
            { title: "Resposta em 5 min", sub: "Sempre disponível", icon: "⚡" }
          ].map((item, i) => (
            <motion.div 
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)" }}
              key={i} 
              className="glass-premium rounded-2xl p-5 space-y-3 shadow-salon"
            >
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{item.icon}</span>
              <div className="space-y-1">
                <p className="text-xs font-black text-white leading-tight uppercase group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 10. "Processo — Do pedido à limpeza" */}
      <motion.section variants={itemVariants} className="px-5 pt-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Processo</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">Do pedido à limpeza</h3>
        </div>

        <div className="space-y-4 relative">
          {/* Timeline Line */}
          <div className="absolute left-[2.25rem] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
          
          {[
            { step: "1", title: "Escolha em poucos toques", sub: "Sofá, colchão, tapete, automóvel ou pós-obra" },
            { step: "2", title: "Receba orçamento rápido", sub: "Sem cadastro. Resposta em menos de 5 minutos" },
            { step: "3", title: "Equipe local vai até você", sub: "São José da Lapa, Vespasiano e bairros próximos" }
          ].map((p, i) => (
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              key={i} 
              className="glass-premium rounded-2xl p-5 flex items-center gap-5 shadow-salon relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl shadow-[0_0_15px_rgba(31,177,249,0.3)]">
                {p.step}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black text-white uppercase tracking-tight">{p.title}</p>
                <p className="text-[11px] text-muted-foreground font-medium leading-tight">{p.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 10.5. Novo Comparativo Premium */}
      <motion.section variants={itemVariants} className="px-5 pt-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">O Diferencial</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">Por que somos a sua melhor escolha</h3>
        </div>

        <div className="glass-premium rounded-[2rem] overflow-hidden shadow-salon border-primary/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recurso</th>
                <th className="p-4 text-[10px] font-black uppercase text-primary tracking-widest text-center">Auto Limpeza</th>
                <th className="p-4 text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest text-center">Comum</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {[
                { label: "Produtos Certificados", premium: true, common: false },
                { label: "Secagem Ultra-Rápida", premium: true, common: false },
                { label: "Equipe Treinada", premium: true, common: true },
                { label: "Garantia de 7 Dias", premium: true, common: false },
                { label: "Equipamento Italiano", premium: true, common: false }
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="p-4 text-white uppercase tracking-tighter">{row.label}</td>
                  <td className="p-4 text-center">
                    <CheckCircle2 className="w-4 h-4 text-primary mx-auto drop-shadow-[0_0_8px_rgba(31,177,249,0.5)]" />
                  </td>
                  <td className="p-4 text-center opacity-20">
                    {row.common ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : <div className="w-4 h-4 mx-auto border-2 border-white/20 rounded-full" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-primary/10 text-center">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Tecnologia e Qualidade em cada detalhe</p>
          </div>
        </div>
      </motion.section>

      {/* 11. "Avaliações — O que dizem no Google" */}
      <motion.section variants={itemVariants} className="px-5 pt-16 space-y-8 overflow-hidden">
        <div className="text-center space-y-2">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Avaliações</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">O que dizem no Google</h3>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-premium border-white/10 rounded-3xl p-6 text-center space-y-3 mx-4 shadow-salon"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-white">4.9</span>
            <div className="flex text-[#FBBC05] drop-shadow-[0_0_8px_rgba(251,188,5,0.4)]">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">120+ avaliações reais</p>
          <div className="flex items-center justify-center gap-2 pt-2 grayscale opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-4" />
          </div>
        </motion.div>

        <div className="flex overflow-x-auto snap-x no-scrollbar gap-4 px-5 pb-4">
          {REVIEWS.map((r, i) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={i} 
              className="flex-none w-[280px] snap-center glass-premium rounded-2xl p-5 space-y-4 shadow-salon"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{r.city}</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                   <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale" alt="" />
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed italic">"{r.text}"</p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
                </div>
                <span className="text-[9px] text-muted-foreground uppercase font-bold">{r.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 12. Banner "100% Satisfação Garantida" */}
      <motion.section variants={itemVariants} className="px-5 pt-12">
        <div className="bg-primary rounded-[2.5rem] p-8 text-center space-y-6 relative overflow-hidden shadow-salon-lg">
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/30 blur-[60px] rounded-full animate-pulse" />
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#090F15]">
              Nosso compromisso premium
            </div>
            <h4 className="text-3xl font-black text-[#090F15] uppercase tracking-tighter leading-none">100% Satisfação Garantida</h4>
            <p className="text-xs font-bold text-[#090F15]/70 max-w-[240px] mx-auto">
              Não ficou satisfeito? Refazemos o serviço sem custo adicional. Sua confiança é nossa prioridade.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartBooking()}
            className="w-full bg-[#090F15] text-white py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all relative z-10"
          >
            Agendar com confiança
          </motion.button>
        </div>
      </motion.section>

      {/* 13. "Cobertura — Nossa área de atendimento" */}
      <motion.section variants={itemVariants} className="px-5 pt-20 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Cobertura</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">Nossa área de atendimento</h3>
        </div>

        <div className="glass-premium rounded-3xl p-6 space-y-6 shadow-salon">
          <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
             <MapPin className="w-12 h-12 text-primary/40 animate-bounce" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#090F15] to-transparent opacity-60" />
             <Button variant="outline" className="absolute bottom-4 bg-black/50 border-white/10 text-white text-[10px] font-black uppercase tracking-widest h-8" asChild>
               <a href="https://maps.google.com/?q=São+José+da+Lapa,MG" target="_blank" rel="noopener noreferrer">Ver no Google Maps</a>
             </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["São José da Lapa", "Vespasiano", "Ribeirão das Neves", "Pedro Leopoldo", "Matozinhos", "Lagoa Santa"].map((city) => (
              <span key={city} className="px-3 py-1.5 rounded-xl glass-premium text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                {city}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 14. CTA duplo final */}
      <motion.section variants={itemVariants} className="px-5 pt-12 grid grid-cols-1 gap-3">
        <motion.a 
          whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.06)" }}
          href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de agendar uma higienização.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-premium rounded-2xl p-5 flex items-center justify-between group shadow-salon"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-[#25D366] drop-shadow-[0_0_8px_rgba(37,211,102,0.4)]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-white uppercase tracking-tight">Orçamento rápido</p>
              <p className="text-[11px] text-[#25D366] font-black">Respondemos em minutos</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#25D366] transition-colors" />
        </motion.a>
        <motion.a 
          whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.06)" }}
          href="https://www.instagram.com/autolimpezapro/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-premium rounded-2xl p-5 flex items-center justify-between group shadow-salon"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FFB300] via-[#FF0050] to-[#5000FF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-white uppercase tracking-tight">Siga no Instagram</p>
              <p className="text-[11px] text-muted-foreground font-black">@autolimpezapro</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.a>
      </motion.section>

      {/* 15. Link "Mapa do site" */}
      <footer className="px-5 py-12 text-center space-y-8">
        <div className="space-y-2">
          <button onClick={onOpenSiteMap} className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:opacity-80 transition-opacity drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">
            Mapa do site
          </button>
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Serviços, cidades e bairros atendidos</p>
        </div>
        <button 
          onClick={onOpenAdmin}
          className="px-6 py-2 rounded-full border border-white/10 text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:bg-white/5 transition-colors shadow-salon"
        >
          área restrita
        </button>
      </footer>

      <LeadCaptureModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
      </motion.div>
    </div>
  );
}
