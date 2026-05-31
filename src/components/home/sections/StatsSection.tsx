import { motion } from "framer-motion";
import { Users, Star, Award, ShieldCheck } from "lucide-react";

export function StatsSection() {
  const stats = [
    { icon: Users, label: "2.500+", sub: "Clientes Atendidos" },
    { icon: Star, label: "4.9 ★", sub: "Avaliação Google" },
    { icon: Award, label: "8 anos", sub: "Experiência" },
    { icon: ShieldCheck, label: "100%", sub: "Garantia Total" }
  ];

  return (
    <section className="py-20 bg-white/[0.02] border-y border-white/5">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}