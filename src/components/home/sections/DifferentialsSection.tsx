import { motion } from "framer-motion";
import { DIFFERENTIALS } from "@/config/home-data";

interface DifferentialsSectionProps {
  variants: any;
}

export function DifferentialsSection({ variants }: DifferentialsSectionProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-16 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Diferenciais</p>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">Por que escolher a Auto Limpeza Pro?</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DIFFERENTIALS.map((item, i) => (
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
  );
}
