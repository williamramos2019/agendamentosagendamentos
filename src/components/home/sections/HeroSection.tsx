import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  customerLocation?: any;
  onStartBooking: () => void;
  variants: any;
}

export function HeroSection({ customerLocation, onStartBooking, variants }: HeroSectionProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-8 pb-12 relative overflow-hidden">
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

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartBooking()}
          className="w-full bg-primary text-[#090F15] p-1.5 rounded-[2rem] flex items-center justify-between group transition-all shadow-salon-lg relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Comece agora, sem cadastro</p>
              <p className="text-xl font-black leading-none uppercase tracking-tighter">Agendar Agora</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mr-1 relative z-10 group-hover:bg-black/10 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </div>
        </motion.button>
        
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
  );
}
