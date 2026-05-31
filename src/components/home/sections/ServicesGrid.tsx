import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SERVICES } from "@/config/home-data";

interface ServicesGridProps {
  onStartBooking: (serviceId?: string) => void;
  onOpenSiteMap?: () => void;
  variants: any;
}

export function ServicesGrid({ onStartBooking, onOpenSiteMap, variants }: ServicesGridProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-12 space-y-6">
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
  );
}
