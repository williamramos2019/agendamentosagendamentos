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
    <div className="flex flex-col min-h-screen bg-[#090F15] text-white">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <header className="sticky top-0 z-50 bg-[#090F15]/90 backdrop-blur-md border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
               <span className="text-xl">💧</span>
             </div>
             <div>
               <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Bem-vindo à</p>
               <h1 className="text-sm font-black text-white">Auto Limpeza Pro</h1>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/autolimpezapro/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold">
              WhatsApp
            </a>
          </div>
        </header>

        <motion.section variants={itemVariants} className="px-5 pt-8 pb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] font-bold text-success uppercase">Atende hoje • Resposta em menos de 5 min</span>
            </div>

            <h2 className="text-4xl font-black leading-tight uppercase text-white mb-2">
              Higienização<br />
              <span className="text-primary">profissional</span><br />
              <span className="text-2xl">em minutos</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8">Estofados · Automotiva · Pós-obra · Equipe local certificada</p>

            <motion.button 
              onClick={() => onStartBooking()}
              className="w-full bg-primary text-[#090F15] py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-sm shadow-lg mb-4"
            >
              <Calendar className="w-5 h-5" />
              Agendar Agora
            </motion.button>
            
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">{customerLocation?.city || "SJ Lapa · Vespasiano e região"}</p>
        </motion.section>

        <StatsSection variants={itemVariants} />
        <SocialProofToast variants={itemVariants} />

        <motion.section variants={itemVariants} className="px-5 pt-8">
          <button 
            onClick={() => setShowLeadModal(true)}
            className="w-full bg-card/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase">Orçamento por formulário</p>
                <p className="text-[10px] text-muted-foreground">Resposta em até 1h · Sem compromisso</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
        
        <HomeFooter onOpenSiteMap={onOpenSiteMap} onOpenAdmin={onOpenAdmin} />
        <LeadCaptureModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
      </motion.div>
    </div>
  );
}