import { useState } from "react";
import { 
  MapPin, 
  ChevronRight, 
  MessageSquare,
  Instagram,
  ShieldCheck,
  Calendar,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { LeadCaptureModal } from "./LeadCaptureModal";

// Sub-components (Restricted to sections only)
import { StatsSection } from "./sections/StatsSection";
import { SocialProofToast } from "./sections/SocialProofToast";
import { ServicesGrid } from "./sections/ServicesGrid";
import { ReviewsSection } from "./sections/ReviewsSection";
import { ProcessSection } from "./sections/ProcessSection";
import { SatisfactionBanner } from "./sections/SatisfactionBanner";
import { CoverageSection } from "./sections/CoverageSection";
import { HomeFooter } from "./sections/HomeFooter";
import { DifferentialsSection } from "./sections/DifferentialsSection";


interface SmartHomeProps {
  onStartBooking: (serviceId?: string) => void;
  customerLocation?: any;
  locationStatus?: any;
  onOpenAdmin?: () => void;
  onOpenPlans?: () => void;
  onOpenSiteMap?: () => void;
  onNavigate?: (path: string) => void;
}

export function SmartHome({ 
  onStartBooking, 
  customerLocation, 
  onOpenAdmin,
  onOpenSiteMap,
}: SmartHomeProps) {
  const [showLeadModal, setShowLeadModal] = useState(false);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090F15] text-white pb-32">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Header Consolidado */}
        <header className="sticky top-0 z-50 bg-[#090F15]/90 backdrop-blur-md border-b border-white/10 px-5 py-3 flex items-center justify-between">
          <button onClick={onOpenAdmin} className="flex items-center gap-3 active:scale-95 transition-transform group">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] leading-none mb-0.5">Bem-vindo à</p>
              <h1 className="text-sm font-black tracking-tight text-white">Auto Limpeza Pro</h1>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/autolimpezapro/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FFB300] via-[#FF0050] to-[#5000FF]">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-[#25D366]/20">
              WhatsApp
            </a>
          </div>
        </header>

        {/* Hero Consolidado */}
        <motion.section variants={itemVariants} className="px-5 pt-8 pb-12 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold text-success uppercase tracking-wider">Atende hoje • Resposta em menos de 5 min</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">{customerLocation?.address || customerLocation?.city || "SJ Lapa · Vespasiano e região"}</span>
              </div>
              <h2 className="text-5xl font-black leading-tight tracking-tight uppercase text-white">
                Higienização<br />
                <span className="text-primary">profissional</span><br />
                <span className="text-3xl font-bold">em minutos</span>
              </h2>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartBooking()}
              className="w-full bg-primary text-[#090F15] p-1.5 rounded-2xl flex items-center justify-between group transition-all shadow-lg shadow-primary/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center">
                  <Calendar className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Comece agora, sem cadastro</p>
                  <p className="text-xl font-black leading-none uppercase tracking-tighter">Agendar Agora</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mr-1">
                <ArrowRight className="w-6 h-6" />
              </div>
            </motion.button>
            
            <div className="absolute top-10 right-[-40px] w-64 h-64 pointer-events-none md:right-10 md:w-96 md:h-96">
              <picture>
                <source srcSet="/mascote.webp" type="image/webp" />
                <img src="/mascote.png" alt="Mascote" className="w-full h-full object-contain relative z-10" />
              </picture>
            </div>
          </div>
        </motion.section>


        <StatsSection variants={itemVariants} />
        <SocialProofToast variants={itemVariants} />



        {/* Location Info */}
        <motion.section variants={itemVariants} className="px-5">
          <div className="bg-card/30 border border-white/5 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary/70" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Local de atendimento</p>
              <p className="text-sm font-medium text-white/90">{customerLocation?.address || customerLocation?.city || "São José da Lapa, Vespasiano e região"}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </motion.section>


        {/* Lead Budget Card */}
        <motion.section variants={itemVariants} className="px-5 pt-8">
          <button 
            onClick={() => setShowLeadModal(true)}
            className="w-full bg-card/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase tracking-tight">Orçamento por formulário</p>
                <p className="text-[11px] text-muted-foreground font-medium">Resposta em até 1h · Sem compromisso</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        </motion.section>

        <ServicesGrid 
          onStartBooking={onStartBooking} 
          onOpenSiteMap={onOpenSiteMap} 
          variants={itemVariants} 
        />

        <DifferentialsSection variants={itemVariants} />

        <ProcessSection variants={itemVariants} />

        <ReviewsSection variants={itemVariants} />


        <SatisfactionBanner 
          onStartBooking={() => onStartBooking()} 
          variants={itemVariants} 
        />

        <CoverageSection variants={itemVariants} />

        {/* Final CTA Buttons */}
        <motion.section variants={itemVariants} className="px-5 pt-12 grid grid-cols-1 gap-3">
          <motion.a 
            whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.06)" }}
            href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de agendar uma higienização.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between group"


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
            className="bg-card/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between group"
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

        <HomeFooter onOpenSiteMap={onOpenSiteMap} onOpenAdmin={onOpenAdmin} />

        <LeadCaptureModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
      </motion.div>
    </div>
  );
}
