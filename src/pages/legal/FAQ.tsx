import { useState } from "react";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search } from "lucide-react";

interface LegalPageProps {
  onBack: () => void;
}

const FAQS = [
  {
    q: "Quanto tempo demora a secagem?",
    a: "O tempo médio de secagem varia entre 4 a 12 horas, dependendo do tipo de tecido e da ventilação do local. Utilizamos máquinas de alta sucção que removem até 90% da umidade."
  },
  {
    q: "Quais produtos vocês utilizam?",
    a: "Utilizamos apenas produtos profissionais biodegradáveis e antialérgicos, certificados pela ANVISA. São seguros para crianças, pets e pessoas com sensibilidade respiratória."
  },
  {
    q: "Vocês atendem em quais cidades?",
    a: "Atendemos São José da Lapa, Vespasiano, Pedro Leopoldo, Matozinhos, Lagoa Santa, Ribeirão das Neves e regiões próximas."
  },
  {
    q: "É necessário tirar o móvel do lugar?",
    a: "Não é necessário. Nossos técnicos cuidam da movimentação leve se for preciso para acessar todas as partes do estofado."
  },
  {
    q: "A impermeabilização protege contra tudo?",
    a: "A impermeabilização cria uma película protetora que repele líquidos, evitando que penetrem nas fibras. Ela protege contra água, sucos, café e refrigerantes, mas não protege contra substâncias oleosas ou pastosas."
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Aceitamos PIX, cartões de crédito (parcelamos em até 3x sem juros) e débito."
  }
];

export function FAQ({ onBack }: LegalPageProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 pb-20">
      <header className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/5 safe-top">
        <div className="px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" /> Dúvidas Frequentes
          </h1>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-6 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar dúvida..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary/50 transition-colors text-sm"
          />
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div 
              key={i}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left active:bg-white/5 transition-colors"
              >
                <span className="text-sm font-bold text-white">{faq.q}</span>
                {openIdx === i ? (
                  <ChevronUp className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openIdx === i && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
