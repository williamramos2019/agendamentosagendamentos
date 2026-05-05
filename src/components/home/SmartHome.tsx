import { Sparkles, Sofa, Bed, Car, CarFront, HardHat, Armchair, ArrowRight, Calendar, Clock, ShieldCheck, Star, Phone, MapPin, Baby, BedDouble, Utensils, LayoutDashboard, Map } from "lucide-react";
import type { CustomerLocation } from "@/hooks/useCustomerLocation";
import { PlansHighlight } from "@/components/plans/PlansHighlight";
import { NotificationsBanner } from "@/components/pwa/NotificationsBanner";
import logoAutoLimpeza from "@/assets/auto-limpeza-pro-logo.jpg";
import mascote from "@/assets/mascote-auto-limpeza-pro.png";

interface SmartHomeProps {
  onStartBooking: (serviceId?: string) => void;
  customerLocation?: CustomerLocation | null;
  locationStatus: "idle" | "requesting" | "allowed" | "denied" | "unavailable";
  onOpenAdmin?: () => void;
  onOpenPlans?: () => void;
  onOpenSiteMap?: () => void;
}

const QUICK_SERVICES = [
  { id: "sofa", icon: Sofa, name: "Sofá", from: 180 },
  { id: "poltrona", icon: Armchair, name: "Poltrona", from: 110 },
  { id: "colchao", icon: Bed, name: "Colchão", from: 130 },
  { id: "colchao-infantil", icon: BedDouble, name: "Colchão infantil", from: 90 },
  { id: "tapete", icon: LayoutDashboard, name: "Tapete", from: 90 },
  { id: "cadeiras", icon: Utensils, name: "Cadeiras", from: 70 },
  { id: "bebe-conforto", icon: Baby, name: "Bebê conforto", from: 100 },
  { id: "cadeirinha-auto", icon: CarFront, name: "Cadeirinha auto", from: 120 },
  { id: "auto-interna", icon: Car, name: "Automóvel", from: 200 },
  { id: "impermeabilizacao", icon: Sparkles, name: "Impermeabilização", from: 160 },
  { id: "pos-obra", icon: HardHat, name: "Pós-obra", from: 18 },
];

export function SmartHome({ onStartBooking, customerLocation, locationStatus, onOpenAdmin, onOpenPlans, onOpenSiteMap }: SmartHomeProps) {
  const locationText = customerLocation
    ? `${customerLocation.city ?? "Localização detectada"}${customerLocation.state ? `, ${customerLocation.state}` : ""} • ${customerLocation.distanceKm} km`
    : locationStatus === "requesting"
      ? "Buscando sua localização para facilitar o agendamento..."
      : "Permita a localização para preencher o endereço automaticamente";

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header / Hero */}
      <header className="px-5 pt-8 pb-6 safe-top">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-salon overflow-hidden">
              <img
                src={logoAutoLimpeza}
                alt="Auto Limpeza Pro - Higienização de estofados e estética automotiva"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">Bem-vindo à</p>
              <p className="font-bold text-foreground leading-tight">Auto Limpeza Pro</p>
            </div>
          </div>
          <a
            href="https://wa.me/5531980252882?text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20higieniza%C3%A7%C3%A3o."
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground"
            aria-label="Falar no WhatsApp"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>

        {/* Hero com mascote */}
        <div className="relative mb-5 rounded-3xl bg-gradient-to-br from-primary/15 via-card to-accent/10 border border-primary/20 shadow-salon-lg overflow-hidden p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 mb-2">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary">SJ Lapa, Vespasiano e região</span>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground leading-tight">
                Higienização <span className="text-gradient">profissional</span> em minutos
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5">
                Estofados, automotiva e pós-obra.
              </p>
            </div>
            <img
              src={mascote}
              alt="Mascote Auto Limpeza Pro"
              className="w-36 h-36 sm:w-40 sm:h-40 object-contain shrink-0 drop-shadow-[0_8px_20px_rgba(14,165,255,0.35)]"
              loading="eager"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-card border border-border p-3">
          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">{locationText}</p>
        </div>
      </header>

      <NotificationsBanner />

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
              <p className="text-[10px] font-medium text-foreground text-center">2.500+<br />clientes</p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border">
            <Star className="h-5 w-5 text-warning" />
            <p className="text-[10px] font-medium text-foreground text-center">4.9 / 5<br />avaliação</p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border">
            <Clock className="h-5 w-5 text-accent" />
              <p className="text-[10px] font-medium text-foreground text-center">8+ anos<br />experiência</p>
          </div>
        </div>
      </section>

      {/* Funil de decisão */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">O que você precisa limpar?</h2>
          <button onClick={() => onStartBooking()} className="text-sm text-primary font-semibold">
            Agendar
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
                <p className="text-[10px] text-muted-foreground">orçar agora</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Planos de assinatura */}
      {onOpenPlans && <PlansHighlight onOpenPlans={onOpenPlans} />}

      {/* Como funciona */}
      <section className="px-5 mt-7">
        <h2 className="text-lg font-bold text-foreground mb-3">Do pedido à limpeza</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Escolha em poucos toques", d: "Sofá, colchão, tapete, automóvel ou pós-obra" },
            { n: "2", t: "Receba orçamento rápido", d: "Sem cadastro e com poucos cliques" },
            { n: "3", t: "Equipe local vai até você", d: "São José da Lapa, Vespasiano e bairros próximos" },
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

      {/* Mapa do site (SEO + atalho) */}
      {onOpenSiteMap && (
        <section className="px-5 mt-7">
          <button
            onClick={onOpenSiteMap}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Map className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-foreground">Mapa do site</p>
              <p className="text-[11px] text-muted-foreground">
                Serviços, cidades e bairros atendidos
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>
      )}

      {/* Discreet admin entry */}
      {onOpenAdmin && (
        <div className="px-5 mt-8 flex justify-center">
          <button
            onClick={onOpenAdmin}
            className="text-[10px] text-muted-foreground/60 hover:text-primary flex items-center gap-1 py-2"
            aria-label="Acesso administrativo"
          >
            <ShieldCheck className="h-3 w-3" />
            <span>área restrita</span>
          </button>
        </div>
      )}
    </div>
  );
}
