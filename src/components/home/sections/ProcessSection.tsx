import { motion } from "framer-motion";
import { PROCESS_STEPS } from "@/config/home-data";

interface ProcessSectionProps {
  variants: any;
}

export function ProcessSection({ variants }: ProcessSectionProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-16 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(31,177,249,0.3)]">Processo</p>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">Do pedido à limpeza</h3>
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-[2.25rem] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
        
        {PROCESS_STEPS.map((p, i) => (
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
  );
}
