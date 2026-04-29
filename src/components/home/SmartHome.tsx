import { Sparkles, Sofa, Bed, Car, HardHat, Armchair, ArrowRight, Calendar, MapPin, Clock, ShieldCheck, Star, Phone } from "lucide-react";
import type { Appointment } from "@/hooks/useAppState";

interface SmartHomeProps {
  appointments: Appointment[];
  onStartBooking: (serviceId?: string) => void;
  onOpenAgenda: () => void;
}

const QUICK_SERVICES = [
  { id: "sofa", icon: Sofa, name: "Sofá", from: 180 },
  { id: "colchao", icon: Bed, name: "Colchão", from: 130 },
  { id: "cadeiras", icon: Armchair, name: "Cadeiras", from: 70 },
  { id: "auto-interna", icon: Car, name: "Automotivo", from: 200 },
  { id: "auto-polimento", icon: Sparkles, name: "Polimento", from: 380 },
  { id: "pos-obra", icon: HardHat, name: "Pós-Obra", from: 18 },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateBR(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Hoje";
  if (d.toDateString() === tomorrow.toDateString()) return "Amanhã";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", weekday: "short" });
}

const STATUS_COLORS = {
  pending: "bg-warning/15 text-warning border-warning/30",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
} as const;

const STATUS_LABELS = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
} as const;

export function SmartHome({ appointments, onStartBooking, onOpenAgenda }: SmartHomeProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const upcoming = appointments
    .filter((a) => a.date >= todayStr && a.status !== "cancelled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header / Hero */}
      <header className="px-5 pt-8 pb-6 safe-top">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-salon">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">CleanPro</p>
              <p className="font-bold text-foreground leading-tight">Agenda Smart</p>
            </div>
          </div>
          <a
            href="https://wa.me/5511999990000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground"
            aria-label="Falar no WhatsApp"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 mb-4">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary">Equipe verificada • pagamento após o serviço</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Higienização profissional <span className="text-gradient">agendada em minutos</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Escolha o serviço, confirme o horário e receba a equipe no endereço informado.
        </p>
      </header>

      {/* CTA principal */}
      <section className="px-5">
        <button
          onClick={() => onStartBooking()}
          className="w-full p-5 rounded-3xl gradient-primary text-primary-foreground shadow-salon-lg active:scale-[0.98] transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Calendar className="h-7 w-7" />
          </div>
          <div className="flex-1 text-left">
              <p className="text-sm opacity-90">Comece agora</p>
            <p className="text-xl font-bold">Agendar Higienização</p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0" />
        </button>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border">
            <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-[10px] font-medium text-foreground text-center">Técnicos<br />treinados</p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border">
            <Star className="h-5 w-5 text-warning" />
            <p className="text-[10px] font-medium text-foreground text-center">4.9 / 5<br />avaliação</p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border">
            <Clock className="h-5 w-5 text-accent" />
              <p className="text-[10px] font-medium text-foreground text-center">Sem pagar<br />antes</p>
          </div>
        </div>
      </section>

      {/* Catálogo rápido */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Nossos serviços</h2>
          <button onClick={() => onStartBooking()} className="text-sm text-primary font-semibold">
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => onStartBooking(s.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:border-primary/40 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center leading-tight">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">desde {formatBRL(s.from)}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Próximos agendamentos */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Seus agendamentos</h2>
          {appointments.length > 0 && (
            <button onClick={onOpenAgenda} className="text-sm text-primary font-semibold">
              Ver agenda
            </button>
          )}
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">Nenhum agendamento ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Toque em "Agendar Higienização" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <button
                key={apt.id}
                onClick={onOpenAgenda}
                className="w-full p-4 rounded-2xl bg-card border border-border text-left hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{apt.services.join(", ")}</p>
                    <p className="text-sm text-muted-foreground truncate">{apt.client}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[apt.status]} shrink-0`}>
                    {STATUS_LABELS[apt.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {formatDateBR(apt.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {apt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {apt.duration} min
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Como funciona */}
      <section className="px-5 mt-7">
        <h2 className="text-lg font-bold text-foreground mb-3">Como funciona</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Escolha o serviço", d: "Sofá, colchão, automotivo ou pós-obra" },
            { n: "2", t: "Defina dia e horário", d: "Agenda com disponibilidade em 24h" },
            { n: "3", t: "Equipe vai até você", d: "Pagamento só após o serviço pronto" },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                {step.n}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{step.t}</p>
                <p className="text-xs text-muted-foreground">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
