import { Crown, ArrowRight, Check } from "lucide-react";

interface PlansHighlightProps {
  onOpenPlans: () => void;
}

export function PlansHighlight({ onOpenPlans }: PlansHighlightProps) {
  return (
    <section className="px-5 mt-7">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">Planos de assinatura</h2>
        <button onClick={onOpenPlans} className="text-sm text-primary font-semibold">
          Ver todos
        </button>
      </div>

      <button
        onClick={onOpenPlans}
        className="w-full text-left rounded-3xl gradient-primary text-primary-foreground p-5 shadow-salon-lg active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Crown className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-90 uppercase tracking-wide font-semibold">Mais escolhido</p>
            <p className="text-xl font-bold">Conforto Plus</p>
            <p className="text-sm opacity-90">Higienização mensal da sua casa</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-3xl font-bold">R$ 249</span>
          <span className="text-xs opacity-80">/ mês</span>
        </div>

        <ul className="space-y-1 mb-4">
          {["1 sofá + 2 colchões/mês", "2 tapetes inclusos", "15% off em serviços extras"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <span className="text-sm font-semibold">Ver planos residenciais e empresariais</span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </button>
    </section>
  );
}
