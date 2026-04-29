import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sofa, Bed, Car, CarFront, HardHat, Armchair, MapPin, CalendarDays, Clock, Sparkles, Phone, User, Camera, X, MessageCircle, Baby, BedDouble, Utensils, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "@/hooks/useAppState";
import type { CustomerLocation } from "@/hooks/useCustomerLocation";

interface SmartBookingWizardProps {
  onClose: () => void;
  onConfirm: (appt: Omit<Appointment, "id">) => void;
  initialServiceId?: string;
  customerLocation?: CustomerLocation | null;
}

type ServiceId = "sofa" | "poltrona" | "colchao" | "colchao-infantil" | "tapete" | "cadeiras" | "bebe-conforto" | "cadeirinha-auto" | "auto-interna" | "impermeabilizacao" | "pos-obra";

interface ServiceDef {
  id: ServiceId;
  icon: typeof Sofa;
  name: string;
  short: string;
  unit: "lugares" | "tamanho" | "unidades" | "veículo" | "m²";
  basePrice: number;
  duration: number; // minutos por unidade
  options: { label: string; multiplier: number; extraDuration?: number }[];
}

const SERVICES: ServiceDef[] = [
  {
    id: "sofa",
    icon: Sofa,
    name: "Higienização de Sofá",
    short: "Limpeza profunda do estofado",
    unit: "lugares",
    basePrice: 120,
    duration: 60,
    options: [
      { label: "2 lugares", multiplier: 1.5, extraDuration: 30 },
      { label: "3 lugares", multiplier: 2, extraDuration: 60 },
      { label: "Sofá de canto", multiplier: 2.8, extraDuration: 90 },
      { label: "Retrátil", multiplier: 2.5, extraDuration: 75 },
    ],
  },
  {
    id: "poltrona",
    icon: Armchair,
    name: "Higienização de Poltrona",
    short: "Reclinável, decorativa ou amamentação",
    unit: "unidades",
    basePrice: 110,
    duration: 45,
    options: [
      { label: "Poltrona simples", multiplier: 1 },
      { label: "Poltrona reclinável", multiplier: 1.4, extraDuration: 15 },
      { label: "Poltrona de amamentação", multiplier: 1.3, extraDuration: 15 },
      { label: "Par de poltronas", multiplier: 1.8, extraDuration: 30 },
    ],
  },
  {
    id: "colchao",
    icon: Bed,
    name: "Higienização de Colchão",
    short: "Remove ácaros, fungos e manchas",
    unit: "tamanho",
    basePrice: 130,
    duration: 50,
    options: [
      { label: "Solteiro", multiplier: 1 },
      { label: "Casal", multiplier: 1.5, extraDuration: 20 },
      { label: "Queen", multiplier: 1.8, extraDuration: 30 },
      { label: "King", multiplier: 2, extraDuration: 40 },
    ],
  },
  {
    id: "colchao-infantil",
    icon: BedDouble,
    name: "Higienização de Colchão Infantil",
    short: "Berço, mini-cama e infantil — antialérgico",
    unit: "tamanho",
    basePrice: 90,
    duration: 40,
    options: [
      { label: "Berço", multiplier: 1 },
      { label: "Mini-cama", multiplier: 1.2, extraDuration: 10 },
      { label: "Infantil solteiro", multiplier: 1.4, extraDuration: 15 },
      { label: "Trocador / cabeceira", multiplier: 0.9 },
    ],
  },
  {
    id: "tapete",
    icon: LayoutDashboard,
    name: "Higienização de Tapete",
    short: "Limpeza contra poeira, odores e ácaros",
    unit: "tamanho",
    basePrice: 90,
    duration: 60,
    options: [
      { label: "Pequeno", multiplier: 1 },
      { label: "Médio", multiplier: 1.6, extraDuration: 30 },
      { label: "Grande", multiplier: 2.4, extraDuration: 60 },
      { label: "Sob medida", multiplier: 3, extraDuration: 90 },
    ],
  },
  {
    id: "cadeiras",
    icon: Utensils,
    name: "Higienização de Cadeiras",
    short: "Estofadas, jantar ou escritório",
    unit: "unidades",
    basePrice: 35,
    duration: 15,
    options: [
      { label: "2 cadeiras", multiplier: 2 },
      { label: "4 cadeiras", multiplier: 4 },
      { label: "6 cadeiras", multiplier: 6 },
      { label: "8 cadeiras", multiplier: 8 },
    ],
  },
  {
    id: "bebe-conforto",
    icon: Baby,
    name: "Higienização de Bebê Conforto",
    short: "Limpeza antialérgica e segura para o bebê",
    unit: "unidades",
    basePrice: 100,
    duration: 45,
    options: [
      { label: "Bebê conforto (1 unidade)", multiplier: 1 },
      { label: "Bebê conforto + base", multiplier: 1.3, extraDuration: 15 },
      { label: "2 unidades", multiplier: 1.8, extraDuration: 30 },
    ],
  },
  {
    id: "cadeirinha-auto",
    icon: CarFront,
    name: "Higienização de Cadeirinha Automotiva",
    short: "Cadeira de carro e booster — produtos seguros",
    unit: "unidades",
    basePrice: 120,
    duration: 50,
    options: [
      { label: "Cadeirinha (1 unidade)", multiplier: 1 },
      { label: "Booster / assento elevado", multiplier: 0.8 },
      { label: "2 cadeirinhas", multiplier: 1.8, extraDuration: 30 },
      { label: "Cadeirinha + bebê conforto", multiplier: 1.7, extraDuration: 30 },
    ],
  },
  {
    id: "auto-interna",
    icon: Car,
    name: "Lavagem Interna Automotiva",
    short: "Bancos, teto, carpete e portas",
    unit: "veículo",
    basePrice: 200,
    duration: 120,
    options: [
      { label: "Hatch / Sedan", multiplier: 1 },
      { label: "SUV / Picape", multiplier: 1.3, extraDuration: 30 },
      { label: "Van / Utilitário", multiplier: 1.6, extraDuration: 60 },
    ],
  },
  {
    id: "impermeabilizacao",
    icon: Sparkles,
    name: "Impermeabilização de Estofados",
    short: "Proteção contra líquidos e manchas",
    unit: "tamanho",
    basePrice: 160,
    duration: 60,
    options: [
      { label: "Sofá 2 lugares", multiplier: 1.4, extraDuration: 30 },
      { label: "Sofá 3 lugares", multiplier: 1.8, extraDuration: 45 },
      { label: "Sofá grande", multiplier: 2.5, extraDuration: 75 },
      { label: "Colchão / cabeceira", multiplier: 1.2, extraDuration: 30 },
    ],
  },
  {
    id: "pos-obra",
    icon: HardHat,
    name: "Limpeza Pós-Obra",
    short: "Remoção de poeira fina e resíduos",
    unit: "m²",
    basePrice: 18,
    duration: 4,
    options: [
      { label: "Até 50 m²", multiplier: 50 },
      { label: "50–100 m²", multiplier: 80 },
      { label: "100–200 m²", multiplier: 150 },
      { label: "Acima de 200 m²", multiplier: 220 },
    ],
  },
];

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const BOOKING_TIME_LIMIT_SECONDS = 5 * 60;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function nextDays(count: number) {
  const days: { date: Date; label: string; sub: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const weekday = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const label = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : weekday;
    days.push({ date: d, label, sub: `${day} ${month}` });
  }
  return days;
}

export function SmartBookingWizard({ onClose, onConfirm, initialServiceId, customerLocation }: SmartBookingWizardProps) {
  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [serviceId, setServiceId] = useState<ServiceId | null>((initialServiceId as ServiceId) ?? null);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(customerLocation?.address ?? "");
  const [photo, setPhoto] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(BOOKING_TIME_LIMIT_SECONDS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId) ?? null, [serviceId]);
  const option = useMemo(() => (service && optionIndex !== null ? service.options[optionIndex] : null), [service, optionIndex]);

  const estimatedPrice = useMemo(() => {
    if (!service || !option) return 0;
    return Math.round(service.basePrice * option.multiplier);
  }, [service, option]);

  const estimatedDuration = useMemo(() => {
    if (!service || !option) return 0;
    return service.duration + (option.extraDuration ?? 0);
  }, [service, option]);

  const days = useMemo(() => nextDays(14), []);

  useEffect(() => {
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(BOOKING_TIME_LIMIT_SECONDS - elapsed, 0);
      setSecondsLeft(remaining);

      if (remaining === 0) {
        window.clearInterval(intervalId);
        toast.error("Tempo de agendamento esgotado", {
          description: "Reinicie para garantir horários e valores atualizados.",
        });
        onClose();
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [onClose]);

  const canAdvance = (() => {
    switch (step) {
      case 0: return !!service;
      case 1: return optionIndex !== null;
      case 2: return !!date && !!time;
      case 3: return name.trim().length > 1 && phone.trim().length >= 10 && address.trim().length > 5;
      case 4: return true; // foto opcional
      default: return true;
    }
  })();

  const COMPANY_WHATSAPP = "5531980252882";

  const buildWhatsAppMessage = () => {
    if (!service || !option || !date) return "";
    const dateLabel = date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    const lines = [
      "*Novo orçamento — Auto Limpeza Pro*",
      "",
      `👤 *Cliente:* ${name}`,
      `📱 *WhatsApp:* ${phone}`,
      `📍 *Endereço:* ${address}`,
      customerLocation ? `📏 *Distância:* ${customerLocation.distanceKm} km` : "",
      "",
      `🧼 *Serviço:* ${service.name}`,
      `🔧 *Detalhe:* ${option.label}`,
      `📅 *Data:* ${dateLabel} às ${time}`,
      `⏱️ *Duração estimada:* ${estimatedDuration} min`,
      "",
      `💰 *Valor estimado:* ${formatBRL(estimatedPrice)}`,
      "_(valor pode variar conforme avaliação no local)_",
      "",
      photo ? "📷 *Vou enviar uma foto do item neste chat.*" : "",
      "",
      "Confirma para mim, por favor?",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const buildGoogleCalendarUrl = () => {
    if (!service || !option || !date || !time) return "";
    const [hh, mm] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start.getTime() + estimatedDuration * 60_000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = `${service.name} — Auto Limpeza Pro`;
    const details = [
      `Serviço: ${service.name} (${option.label})`,
      `Cliente: ${name}`,
      `Contato: ${phone}`,
      `Valor estimado: ${formatBRL(estimatedPrice)}`,
      `Duração estimada: ${estimatedDuration} min`,
      "",
      "Agendado pelo site Auto Limpeza Pro",
      "WhatsApp: (31) 98025-2882",
    ].join("\n");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${fmt(start)}/${fmt(end)}`,
      details,
      location: address,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const handleAddToCalendar = () => {
    const url = buildGoogleCalendarUrl();
    if (!url) return;
    window.open(url, "_blank");
    toast.success("Abrindo Google Agenda...", {
      description: "Confirme no app para salvar o lembrete.",
    });
  };

  const handleConfirm = () => {
    if (!service || !option || !date) return;
    const dateStr = date.toISOString().split("T")[0];
    onConfirm({
      time,
      date: dateStr,
      client: name,
      phone,
      address,
      distanceKm: customerLocation?.distanceKm,
      customerLatitude: customerLocation?.latitude,
      customerLongitude: customerLocation?.longitude,
      services: [`${service.name} — ${option.label}${customerLocation ? ` • ${customerLocation.distanceKm} km do atendimento` : ""}`],
      employee: "A definir",
      status: "pending",
      duration: estimatedDuration,
    });
    const msg = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${msg}`, "_blank");
    toast.success("Orçamento enviado!", {
      description: photo
        ? "Anexe a foto no WhatsApp que abrimos para você."
        : `${service.name} em ${date.toLocaleDateString("pt-BR")} às ${time}`,
    });
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Foto muito grande", { description: "Envie uma imagem de até 5MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const stepLabels = ["Serviço", "Detalhes", "Data e hora", "Endereço", "Foto (opcional)", "Confirmação"];
  const totalSteps = stepLabels.length;
  const countdownTone = secondsLeft <= 60 ? "text-warning" : "text-primary";

  return (
    <div className="fixed inset-0 z-[80] bg-background flex flex-col animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Passo {step + 1} de {totalSteps}</span>
              <span className={`font-bold flex items-center gap-1 ${countdownTone}`}>
                <Clock className="h-3.5 w-3.5" /> {formatCountdown(secondsLeft)}
              </span>
            </div>
            <h1 className="font-bold text-base text-foreground">{stepLabels[step]}</h1>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        {/* STEP 0 — Serviço */}
        {step === 0 && (
          <div className="space-y-3 animate-slide-in-bottom">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-foreground">O que vamos higienizar?</h2>
              <p className="text-muted-foreground mt-1">Escolha o tipo de serviço</p>
            </div>
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const active = serviceId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    setOptionIndex(null);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                    active
                      ? "border-primary bg-primary/10 shadow-salon"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.short}</p>
                    <p className="text-xs text-primary mt-1 font-medium">A partir de {formatBRL(s.basePrice)}</p>
                  </div>
                  {active && <Check className="h-5 w-5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 1 — Detalhes */}
        {step === 1 && service && (
          <div className="space-y-4 animate-slide-in-bottom">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-foreground">{service.name}</h2>
              <p className="text-muted-foreground mt-1">Selecione {service.unit === "m²" ? "o tamanho da área" : `o(a) ${service.unit}`}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {service.options.map((opt, idx) => {
                const active = optionIndex === idx;
                const price = Math.round(service.basePrice * opt.multiplier);
                return (
                  <button
                    key={idx}
                    onClick={() => setOptionIndex(idx)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-salon"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{opt.label}</p>
                    <p className="text-sm text-primary font-bold mt-2">{formatBRL(price)}</p>
                  </button>
                );
              })}
            </div>

            {option && (
              <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duração estimada</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {estimatedDuration} min
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Data e hora */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-in-bottom">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Quando você prefere?</h2>
              <p className="text-muted-foreground mt-1">Escolha o melhor dia</p>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {days.map((d) => {
                const active = date?.toDateString() === d.date.toDateString();
                return (
                  <button
                    key={d.date.toISOString()}
                    onClick={() => setDate(d.date)}
                    className={`shrink-0 w-20 py-3 rounded-2xl border-2 text-center transition-all ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <p className={`text-xs font-medium uppercase ${active ? "text-primary" : "text-muted-foreground"}`}>
                      {d.label}
                    </p>
                    <p className={`text-lg font-bold mt-1 ${active ? "text-primary" : "text-foreground"}`}>
                      {d.sub}
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Horários disponíveis
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((t) => {
                  const active = time === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      disabled={!date}
                      className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground disabled:opacity-40"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Endereço/contato */}
        {step === 3 && (
          <form className="space-y-4 animate-slide-in-bottom" autoComplete="on" onSubmit={(e) => e.preventDefault()}>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Onde será o serviço?</h2>
              <p className="text-muted-foreground mt-1">Seu navegador pode preencher tudo automaticamente</p>
            </div>

            <div>
              <label htmlFor="bk-name" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <User className="h-4 w-4" /> Seu nome
              </label>
              <input
                id="bk-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                className="w-full p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="bk-phone" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" /> WhatsApp
              </label>
              <input
                id="bk-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(31) 98025-2882"
                className="w-full p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="bk-address" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Endereço completo
              </label>
              {customerLocation && (
                <p className="text-xs text-primary mb-2">
                  Localização preenchida automaticamente • {customerLocation.distanceKm} km da base de atendimento
                </p>
              )}
              <textarea
                id="bk-address"
                name="street-address"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade"
                rows={3}
                className="w-full p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </form>
        )}

        {/* STEP 4 — Foto opcional */}
        {step === 4 && (
          <div className="space-y-4 animate-slide-in-bottom">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Quer enviar uma foto?</h2>
              <p className="text-muted-foreground mt-1">
                Ajuda nossa equipe a preparar tudo. <span className="text-primary font-medium">Opcional.</span>
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {!photo ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Tirar ou enviar foto</p>
                <p className="text-xs text-muted-foreground">Sofá, colchão, área… até 5MB</p>
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-border">
                <img src={photo} alt="Foto do item" className="w-full aspect-[4/3] object-cover" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-salon"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
                <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur rounded-xl px-3 py-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-xs text-foreground">Foto pronta para enviar pelo WhatsApp</span>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Sem foto também tudo bem — você pode pular e seguir direto para a confirmação.
            </p>
          </div>
        )}

        {/* STEP 5 — Confirmação */}
        {step === 5 && service && option && date && (
          <div className="space-y-4 animate-slide-in-bottom">
            <div className="text-center mb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Tudo certo?</h2>
              <p className="text-muted-foreground mt-1">Revise antes de confirmar</p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <service.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Serviço</p>
                  <p className="font-semibold text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{option.label}</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Data e horário</p>
                  <p className="font-semibold text-foreground">
                    {date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                  </p>
                  <p className="text-sm text-muted-foreground">às {time} • {estimatedDuration} min</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Local e contato</p>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{phone}</p>
                  <p className="text-sm text-muted-foreground mt-1">{address}</p>
                  {customerLocation && (
                    <p className="text-xs text-primary mt-2">Distância estimada: {customerLocation.distanceKm} km</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl gradient-primary p-5 text-primary-foreground shadow-salon-lg">
              <p className="text-sm opacity-90">Valor estimado</p>
              <p className="text-3xl font-bold mt-1">{formatBRL(estimatedPrice)}</p>
              <p className="text-xs opacity-80 mt-2">
                * Valor pode variar conforme avaliação no local. Pagamento após o serviço.
              </p>
            </div>

            {photo && (
              <div className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3">
                <img src={photo} alt="Foto anexada" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Foto anexada</p>
                  <p className="text-xs text-muted-foreground">Lembre-se de enviá-la no chat do WhatsApp.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Action */}
      <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-lg border-t border-border p-4 safe-bottom">
        {step < 5 ? (
          <div className="flex gap-2">
            {step === 4 && !photo && (
              <button
                onClick={() => setStep(step + 1)}
                className="h-14 px-5 rounded-2xl bg-muted text-foreground font-semibold transition-all active:scale-[0.98]"
              >
                Pular
              </button>
            )}
            <button
              onClick={() => canAdvance && setStep(step + 1)}
              disabled={!canAdvance}
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-salon disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {step === 4 && photo ? "Continuar com foto" : "Continuar"} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleConfirm}
              className="w-full h-14 rounded-2xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-salon-lg active:scale-[0.98] transition-all"
            >
              <MessageCircle className="h-5 w-5" /> Enviar orçamento pelo WhatsApp
            </button>
            <button
              onClick={handleAddToCalendar}
              className="w-full h-12 rounded-2xl bg-card border-2 border-border text-foreground font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:border-primary"
            >
              <CalendarDays className="h-5 w-5 text-primary" /> Adicionar à Agenda do Google
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
