import { useMemo, useState } from "react";
import { ArrowLeft, Check, MessageCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import { SUBSCRIPTION_PLANS, COMPANY_WHATSAPP, type PlanAudience, type SubscriptionPlan } from "@/data/subscriptionPlans";
import { toast } from "@/hooks/use-toast";

interface SubscriptionPlansProps {
  onBack: () => void;
  initialPlanId?: string;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z.string().trim().min(8, "Telefone inválido").max(20),
  address: z.string().trim().min(5, "Informe o endereço").max(200),
  email: z.string().trim().email("E-mail inválido").max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export function SubscriptionPlans({ onBack, initialPlanId }: SubscriptionPlansProps) {
  const [audience, setAudience] = useState<PlanAudience>(() => {
    const initial = SUBSCRIPTION_PLANS.find((p) => p.id === initialPlanId);
    return initial?.audience ?? "residencial";
  });
  const [selected, setSelected] = useState<SubscriptionPlan | null>(
    SUBSCRIPTION_PLANS.find((p) => p.id === initialPlanId) ?? null
  );
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "", notes: "" });
  const [sending, setSending] = useState(false);

  const plans = useMemo(
    () => SUBSCRIPTION_PLANS.filter((p) => p.audience === audience),
    [audience]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast({ title: "Escolha um plano", description: "Selecione um plano antes de enviar.", variant: "destructive" });
      return;
    }
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({ title: "Verifique os dados", description: result.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSending(true);

    const data = result.data;
    const lines = [
      `*Nova solicitação de assinatura*`,
      ``,
      `*Plano:* ${selected.name} (${selected.audience === "residencial" ? "Residencial" : "Empresarial"})`,
      `*Valor:* R$ ${selected.price.toLocaleString("pt-BR")} / mês`,
      `*Frequência:* ${selected.frequency}`,
      ``,
      `*Cliente:* ${data.name}`,
      `*Telefone:* ${data.phone}`,
      `*Endereço:* ${data.address}`,
      data.email ? `*E-mail:* ${data.email}` : null,
      data.notes ? `*Observações:* ${data.notes}` : null,
      ``,
      `Enviado pelo app Auto Limpeza Pro`,
    ].filter(Boolean) as string[];

    const message = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${COMPANY_WHATSAPP}?text=${message}`;

    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      toast({ title: "Pedido enviado!", description: "Continue a conversa no WhatsApp para finalizar." });
      setSending(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border safe-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground leading-tight">Planos de Assinatura</h1>
            <p className="text-xs text-muted-foreground">Higienização recorrente com desconto</p>
          </div>
        </div>

        {/* Audience tabs */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted">
            {(["residencial", "empresarial"] as PlanAudience[]).map((a) => (
              <button
                key={a}
                onClick={() => {
                  setAudience(a);
                  setSelected(null);
                }}
                className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                  audience === a
                    ? "bg-primary text-primary-foreground shadow-salon"
                    : "text-muted-foreground"
                }`}
              >
                {a === "residencial" ? "Residencial" : "Empresarial"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Plans */}
      <section className="px-4 pt-4 space-y-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected?.id === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan)}
              className={`w-full text-left rounded-3xl border-2 transition-all p-5 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-salon"
                  : plan.highlight
                  ? "border-primary/40 bg-card"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  plan.highlight ? "gradient-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                    {plan.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-foreground">
                  R$ {plan.price.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-muted-foreground">/ mês</span>
                <span className="ml-auto text-xs font-medium text-primary">{plan.frequency}</span>
              </div>

              <ul className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary/20 text-xs font-semibold text-primary text-center">
                  ✓ Plano selecionado
                </div>
              )}
            </button>
          );
        })}
      </section>

      {/* Form */}
      <section className="px-4 mt-6">
        <div className="rounded-3xl bg-card border border-border p-5">
          <h2 className="font-bold text-foreground mb-1">Seus dados</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Preencha para receber a confirmação no WhatsApp
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Nome completo *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:border-primary outline-none"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">WhatsApp *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="tel"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:border-primary outline-none"
                placeholder="(31) 99999-9999"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Endereço *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                autoComplete="street-address"
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:border-primary outline-none"
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">E-mail (opcional)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                maxLength={120}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:border-primary outline-none"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Observações (opcional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:border-primary outline-none resize-none"
                placeholder="Alguma informação extra..."
              />
            </div>

            {selected && (
              <div className="rounded-xl bg-primary/10 border border-primary/30 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Plano escolhido</p>
                <p className="font-bold text-foreground">
                  {selected.name} — R$ {selected.price.toLocaleString("pt-BR")}/mês
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={sending || !selected}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
              {selected ? "Enviar pedido pelo WhatsApp" : "Selecione um plano acima"}
            </button>
            <p className="text-[10px] text-muted-foreground text-center">
              Você será redirecionado para o WhatsApp com todos os dados preenchidos.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
