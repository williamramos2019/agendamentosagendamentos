import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ServicesSection() {
  const services = [
    {
      id: "sofa",
      title: "Higienização de Sofás",
      description: "Limpeza profunda com extração de sujeira, ácaros e bactérias. Seu sofá renovado e seguro.",
      icon: "🛋️",
      price: "180"
    },
    {
      id: "auto",
      title: "Estética Automotiva",
      description: "Higienização interna completa de veículos, incluindo bancos, teto, carpetes e painéis.",
      icon: "🚗",
      price: "200"
    },
    {
      id: "colchao",
      title: "Limpeza de Colchões",
      description: "Tratamento antialérgico completo para uma noite de sono saudável e revitalizante.",
      icon: "🛏️",
      price: "130"
    },
    {
      id: "tapete",
      title: "Lavagem de Tapetes",
      description: "Remoção de manchas e odores com produtos que preservam as fibras do seu tapete.",
      icon: "🧶",
      price: "90"
    }
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">O que fazemos</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">Nossos Serviços de Elite</h2>
          <p className="text-muted-foreground font-medium">Oferecemos o que há de mais moderno em limpeza técnica para sua casa ou empresa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <span className="text-6xl block group-hover:scale-110 transition-transform duration-500">{service.icon}</span>
                <div className="space-y-3">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">{service.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{service.description}</p>
                </div>
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">A partir de</p>
                  <p className="text-2xl font-black text-white">R$ {service.price}</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-8 rounded-2xl group/btn hover:bg-primary hover:text-black font-black uppercase text-[10px] tracking-widest h-12" asChild>
                <Link to={`/agendamento?s=${service.id}`}>
                  Ver detalhes
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}