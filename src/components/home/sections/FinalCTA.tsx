import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full opacity-30" />
      
      <div className="container mx-auto px-5 relative z-10">
        <div className="bg-primary rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center space-y-10 shadow-2xl shadow-primary/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-black/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#090F15]">
              Pronto para transformar sua casa?
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-[#090F15] uppercase tracking-tighter leading-[0.9] max-w-4xl mx-auto">
              Garanta já sua higienização com quem entende do assunto
            </h2>
            <p className="text-lg md:text-xl font-bold text-[#090F15]/70 max-w-2xl mx-auto italic">
              "A diferença entre uma limpeza comum e uma higienização profissional está nos detalhes e no cuidado com sua saúde."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Button size="lg" className="bg-[#090F15] text-white hover:bg-black rounded-3xl h-20 px-12 text-xl font-black uppercase shadow-2xl transition-all group w-full md:w-auto" asChild>
              <Link to="/agendamento">
                Agendar Agora
                <Calendar className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
            <div className="flex flex-col items-center md:items-start text-[#090F15]">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5" />
                Garantia Incondicional
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Satisfação ou seu dinheiro de volta</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}