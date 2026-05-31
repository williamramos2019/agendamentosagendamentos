import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { REVIEWS } from "@/config/home-data";

interface ReviewsSectionProps {
  variants: any;
}

export function ReviewsSection({ variants }: ReviewsSectionProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-16 space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Avaliações</p>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">O que dizem no Google</h3>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-card/30 border border-white/5 rounded-3xl p-6 text-center space-y-3 mx-4"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-black text-white">4.9</span>
          <div className="flex text-[#FBBC05]">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">120+ avaliações reais</p>
        <div className="flex items-center justify-center gap-2 pt-2 grayscale opacity-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-4" />
        </div>
      </motion.div>

      <div className="flex overflow-x-auto snap-x no-scrollbar gap-4 px-5 pb-4">
        {REVIEWS.map((r, i) => (
          <motion.div 
            whileHover={{ y: -2 }}
            key={i} 
            className="flex-none w-[280px] snap-center bg-card/30 border border-white/5 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary/80 font-black text-xs">
                  {r.initials}
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">{r.city}</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                 <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale" alt="" />
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed italic">"{r.text}"</p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
              </div>
              <span className="text-[9px] text-muted-foreground uppercase font-bold">{r.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
