import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICE_CITIES } from "@/config/home-data";

interface CoverageSectionProps {
  variants: any;
}

export function CoverageSection({ variants }: CoverageSectionProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-20 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Cobertura</p>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">Nossa área de atendimento</h3>
      </div>

      <div className="bg-card/30 border border-white/5 rounded-3xl p-6 space-y-6">
        <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
           <MapPin className="w-12 h-12 text-primary/40 animate-bounce" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#090F15] to-transparent opacity-60" />
           <Button variant="outline" className="absolute bottom-4 bg-black/50 border-white/10 text-white text-[10px] font-black uppercase tracking-widest h-8" asChild>
             <a href="https://maps.google.com/?q=São+José+da+Lapa,MG" target="_blank" rel="noopener noreferrer">Ver no Google Maps</a>
           </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SERVICE_CITIES.map((city) => (
            <span key={city} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors">
              {city}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
