import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { COMPARISON_ROWS } from "@/config/home-data";

interface ComparisonSectionProps {
  variants: any;
}

export function ComparisonSection({ variants }: ComparisonSectionProps) {
  return (
    <motion.section variants={variants} className="px-5 pt-16 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">O Diferencial</p>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">Por que somos a sua melhor escolha</h3>
      </div>

      <div className="glass-premium rounded-[2rem] overflow-hidden shadow-salon border-primary/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recurso</th>
              <th className="p-4 text-[10px] font-black uppercase text-primary tracking-widest text-center">Auto Limpeza</th>
              <th className="p-4 text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest text-center">Comum</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold">
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="p-4 text-white uppercase tracking-tighter">{row.label}</td>
                <td className="p-4 text-center">
                  <CheckCircle2 className="w-4 h-4 text-primary mx-auto drop-shadow-[0_0_8px_rgba(31,177,249,0.5)]" />
                </td>
                <td className="p-4 text-center opacity-20">
                  {row.common ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : <div className="w-4 h-4 mx-auto border-2 border-white/20 rounded-full" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-primary/10 text-center">
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Tecnologia e Qualidade em cada detalhe</p>
        </div>
      </div>
    </motion.section>
  );
}
