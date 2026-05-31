import { motion } from "framer-motion";

interface SatisfactionBannerProps {
  onStartBooking: () => void;
  variants: any;
}

export function SatisfactionBanner({ onStartBooking, variants }: SatisfactionBannerProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-12">
      <div className="bg-primary rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#090F15]">
            Garantia de Qualidade
          </div>
          <h4 className="text-3xl font-black text-[#090F15] uppercase tracking-tighter leading-none">100% Satisfação Garantida</h4>
          <p className="text-xs font-bold text-[#090F15]/70 max-w-[240px] mx-auto">
            Não ficou satisfeito? Refazemos o serviço sem custo adicional. Sua confiança é nossa prioridade.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartBooking}
          className="w-full bg-[#090F15] text-white py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all relative z-10"
        >
          Agendar com confiança
        </motion.button>
      </div>
    </motion.section>
  );
}
