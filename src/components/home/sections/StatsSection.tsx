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
        <GlassCard 
          key={i} 
          className="p-4 flex flex-col items-center text-center gap-2"
        >
          <stat.icon className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(31,177,249,0.5)]" />
          <div>
            <p className="text-sm font-black text-white">{stat.label}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{stat.sub}</p>
          </div>
        </GlassCard>
      ))}
    </motion.section>
  );
}
