import { useState } from "react";
import { 
  MapPin, 
  ChevronRight, 
  MessageSquare,
  Instagram
} from "lucide-react";
import { motion } from "framer-motion";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { LeadCaptureModal } from "./LeadCaptureModal";

// Sub-components
import { HomeHeader } from "./sections/HomeHeader";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { ServicesGrid } from "./sections/ServicesGrid";
import { ReviewsSection } from "./sections/ReviewsSection";
import { ProcessSection } from "./sections/ProcessSection";
import { ComparisonSection } from "./sections/ComparisonSection";
import { SatisfactionBanner } from "./sections/SatisfactionBanner";
import { CoverageSection } from "./sections/CoverageSection";
import { HomeFooter } from "./sections/HomeFooter";
import { DifferentialsSection } from "./sections/DifferentialsSection";
import { SocialProofToast } from "./sections/SocialProofToast";

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
        <HomeHeader onOpenAdmin={onOpenAdmin} />

        <HeroSection 
          customerLocation={customerLocation} 
          onStartBooking={onStartBooking} 
          variants={itemVariants} 
        />

        {/* Location Info */}
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

        <StatsSection variants={itemVariants} />

        <SocialProofToast variants={itemVariants} />

        {/* Lead Budget Card */}
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

        <ServicesGrid 
          onStartBooking={onStartBooking} 
          onOpenSiteMap={onOpenSiteMap} 
          variants={itemVariants} 
        />

        <DifferentialsSection variants={itemVariants} />

        <ProcessSection variants={itemVariants} />

        <ComparisonSection variants={itemVariants} />

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

        <HomeFooter onOpenSiteMap={onOpenSiteMap} onOpenAdmin={onOpenAdmin} />

        <LeadCaptureModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
      </motion.div>
    </div>
  );
}
