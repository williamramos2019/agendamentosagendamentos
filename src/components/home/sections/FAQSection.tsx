import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FAQSection() {
  const faqs = [
    {
      question: "Quanto tempo demora o serviço?",
      answer: "Em média, a higienização de um sofá de 3 lugares leva entre 1h30 e 2h30, dependendo do grau de sujidade."
    },
    {
      question: "Quanto tempo para secar?",
      answer: "Graças ao nosso sistema de extração industrial, a secagem completa ocorre entre 4 a 12 horas, dependendo da ventilação do local e do tipo de tecido."
    },
    {
      question: "Vocês atendem em quais cidades?",
      answer: "Atendemos São José da Lapa, Vespasiano, Pedro Leopoldo, Confins e toda a região metropolitana de Belo Horizonte."
    },
    {
      question: "Os produtos são seguros para pets e crianças?",
      answer: "Sim! Utilizamos apenas produtos biodegradáveis e antialérgicos, com certificações de segurança, totalmente seguros para sua família e seus animais de estimação."
    }
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-8 sticky top-32">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Suporte</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">Dúvidas <span className="text-primary italic">Frequentes</span></h2>
            <p className="text-lg text-muted-foreground font-medium max-w-md">
              Ainda tem alguma pergunta? Confira as respostas para as dúvidas mais comuns de nossos clientes.
            </p>
            <div className="pt-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                <p className="text-sm font-bold text-white uppercase tracking-tight">Precisa de ajuda imediata?</p>
                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Fale agora com um especialista</p>
                <a href="https://wa.me/5531980252882" className="inline-block text-primary font-black uppercase text-xl hover:underline">
                  (31) 98025-2882
                </a>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl"
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/5 bg-white/[0.02] rounded-2xl px-6">
                  <AccordionTrigger className="text-left font-black uppercase tracking-tight text-sm md:text-base py-6 hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}