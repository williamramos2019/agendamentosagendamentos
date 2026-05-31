import { motion } from "framer-motion";
import { Users, Star, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface StatsSectionProps {
  variants: any;
}

export function StatsSection({ variants }: StatsSectionProps) {
  const stats = [
    { icon: Users, label: "2.500+", sub: "Clientes" },
    { icon: Star, label: "4.9 ★", sub: "No Google" },
    { icon: Award, label: "8 anos", sub: "Experiência" }
  ];

  return (
    <motion.section variants={variants} className="px-5 pt-8 grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-card/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center gap-2"
        >
          <stat.icon className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-black text-white">{stat.label}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{stat.sub}</p>
          </div>
        </div>
      ))}
    </motion.section>
  );
}
