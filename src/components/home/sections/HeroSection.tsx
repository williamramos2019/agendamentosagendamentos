import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "../LeadCaptureForm";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full opacity-30" />

      <div className="container mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Atendimento hoje em São José da Lapa</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight uppercase text-white">
                Higienização<br />
                <span className="text-primary italic">profissional</span><br />
                <span className="text-3xl md:text-5xl">no conforto do seu lar</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                Seu estofado novo, limpo e cheiroso em poucas horas. Utilizamos tecnologia de ponta para remover 99.9% de fungos e bactérias.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-black uppercase shadow-2xl shadow-primary/20 group" asChild>
                <Link to="/agendamento">
                  Agendar Agora
                  <Calendar className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Garantia de 7 dias
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Satisfação 100% garantida</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6 pt-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5" />
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-1 font-black text-xs uppercase tracking-widest">
                4.9/5 estrelas • 120+ avaliações
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <LeadCaptureForm inline />
            
            {/* Mascot float decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 pointer-events-none hidden md:block animate-float">
              <picture>
                <source srcSet="/mascote.webp" type="image/webp" />
                <img src="/mascote.png" alt="Mascote" className="w-full h-full object-contain" />
              </picture>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}