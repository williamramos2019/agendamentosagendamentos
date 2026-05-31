import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Ana Beatriz M.",
      city: "Vespasiano",
      text: "Serviço impecável! O sofá ficou novo em folha. Profissional e pontual. Recomendo sem dúvida!",
      initials: "AB"
    },
    {
      name: "Carlos Henrique",
      city: "São José da Lapa",
      text: "Interior do carro completamente renovado. Manchas antigas sumiram. Melhor serviço de estética da região!",
      initials: "CH"
    },
    {
      name: "Fernanda L.",
      city: "Ribeirão das Neves",
      text: "Limpeza pós-obra perfeita, antes do prazo combinado. Equipe educada, cuidadosa e muito eficiente.",
      initials: "FL"
    }
  ];

  return (
    <section className="py-32 bg-white/[0.02] overflow-hidden">
      <div className="container mx-auto px-5">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Depoimentos</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">O que nossos <span className="text-primary italic">clientes</span> dizem</h2>
          </div>
          <div className="bg-black/20 border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-black text-white leading-none">4.9/5</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Média no Google</p>
            </div>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 hover:bg-white/[0.07] transition-all relative group"
            >
              <MessageSquare className="absolute top-10 right-10 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
              
              <div className="flex text-yellow-500 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>

              <p className="text-lg text-white/80 font-medium italic leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight">{review.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{review.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}