import { ArrowLeft, MapPin, Phone, Sofa, Bed, Car, HardHat, Sparkles, Bell, Calendar, ShieldCheck, Star } from "lucide-react";
import { useEffect } from "react";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { requestNotificationPermission, getNotificationPermission } from "@/lib/pwa";
import { toast } from "sonner";

interface SiteMapPageProps {
  onBack: () => void;
  onStartBooking: (serviceId?: string) => void;
}

const CIDADES = [
  {
    nome: "São José da Lapa",
    bairros: [
      "Centro",
      "Bom Pastor",
      "Várzea",
      "Camargos",
      "Bandeirantes",
      "Cachoeirinha",
      "Industrial",
      "Vargem das Flores",
      "Santa Cruz",
      "Bela Vista",
      "Jardim Atlântico",
      "Recanto Verde",
    ],
  },
  {
    nome: "Vespasiano",
    bairros: [
      "Centro",
      "Nova Pampulha",
      "Caieiras",
      "Morro Alto",
      "Vespasiano Industrial",
      "Solar do Barreiro",
      "Marimbá",
      "Santa Clara",
      "Jardim das Alterosas",
      "Vila Esportiva",
      "Cristina",
      "Sevilha",
      "Vila Esperança",
      "Gávea",
      "Vila Aeroporto",
    ],
  },
];

const SERVICOS_SEO = [
  {
    id: "sofa",
    nome: "Higienização de Sofá",
    icon: Sofa,
    desc: "Limpeza profunda de sofás de tecido, suede, veludo e couro. Remoção de ácaros, manchas e odores.",
  },
  {
    id: "colchao",
    nome: "Higienização de Colchão",
    icon: Bed,
    desc: "Limpeza antialérgica para colchões de solteiro, casal, queen e king. Elimina ácaros e bactérias.",
  },
  {
    id: "auto-interna",
    nome: "Estética Automotiva Interna",
    icon: Car,
    desc: "Higienização interna automotiva: bancos, teto, carpete, painel e portas. Carro como novo.",
  },
  {
    id: "pos-obra",
    nome: "Limpeza Pós-Obra",
    icon: HardHat,
    desc: "Limpeza pesada após reformas e construção: remoção de cimento, tinta, poeira fina e resíduos.",
  },
  {
    id: "impermeabilizacao",
    nome: "Impermeabilização de Estofados",
    icon: Sparkles,
    desc: "Proteção que repele líquidos e manchas, prolongando a vida útil do seu estofado.",
  },
];

export function SiteMapPage({ onBack, onStartBooking }: SiteMapPageProps) {
  // Atualiza o <title> e meta description dinamicamente para SEO
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "Mapa do Site — Auto Limpeza Pro | São José da Lapa e Vespasiano";

    const setMeta = (name: string, content: string, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector<HTMLMetaElement>(sel);
      if (!tag) {
        tag = document.createElement("meta");
        if (prop) tag.setAttribute("property", name);
        else tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.content;
      tag.content = content;
      return () => {
        tag!.content = prev;
      };
    };

    const restoreDesc = setMeta(
      "description",
      "Mapa do site Auto Limpeza Pro: serviços de higienização de estofados, sofás, colchões, automotiva e pós-obra em São José da Lapa, Vespasiano e principais bairros da região metropolitana de Belo Horizonte.",
    );

    // JSON-LD: ItemList com serviços + áreas atendidas
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "sitemap-jsonld";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Serviços Auto Limpeza Pro",
      itemListElement: SERVICOS_SEO.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.nome,
          description: s.desc,
          provider: { "@type": "LocalBusiness", name: COMPANY_INFO.nome },
          areaServed: CIDADES.map((c) => ({
            "@type": "City",
            name: c.nome,
          })),
        },
      })),
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      restoreDesc();
      document.getElementById("sitemap-jsonld")?.remove();
    };
  }, []);

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    if (result === "granted") {
      toast.success("Notificações ativadas!", {
        description: "Você receberá lembretes dos seus agendamentos.",
      });
    } else if (result === "denied") {
      toast.error("Permissão negada", {
        description: "Habilite nas configurações do navegador.",
      });
    } else if (result === "unsupported") {
      toast.error("Não suportado neste dispositivo");
    }
  };

  const notifState = getNotificationPermission();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border safe-top">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Mapa do Site
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Tudo que oferecemos e onde atendemos
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 pt-5 space-y-7">
        {/* Hero SEO */}
        <section>
          <h2 className="text-2xl font-extrabold text-foreground leading-tight">
            Higienização profissional em{" "}
            <span className="text-gradient">São José da Lapa</span> e{" "}
            <span className="text-gradient">Vespasiano</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            A {COMPANY_INFO.nome} é especialista em higienização de estofados,
            estética automotiva e limpeza pós-obra. Atendemos toda a região
            metropolitana de Belo Horizonte, com equipe local, produtos
            antialérgicos e equipamentos profissionais.
          </p>
        </section>

        {/* Notificações PWA */}
        {notifState === "default" && (
          <section className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/30 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  Ative as notificações
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lembretes de horário, confirmações e promoções da sua região.
                </p>
                <button
                  onClick={handleEnableNotifications}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  Ativar notificações
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Páginas principais */}
        <section>
          <h3 className="text-base font-bold text-foreground mb-3">
            Páginas principais
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border text-left active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Início
              </span>
            </button>
            <button
              onClick={() => onStartBooking()}
              className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border text-left active:scale-95 transition"
            >
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Agendar serviço
              </span>
            </button>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(
                "Olá! Quero um orçamento da Auto Limpeza Pro.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border active:scale-95 transition"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                WhatsApp
              </span>
            </a>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Garantia 7 dias
              </span>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section>
          <h3 className="text-base font-bold text-foreground mb-3">
            Nossos serviços
          </h3>
          <div className="space-y-2">
            {SERVICOS_SEO.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => onStartBooking(s.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary/40 active:scale-[0.98] transition text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {s.nome}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Cidades e bairros */}
        <section>
          <h3 className="text-base font-bold text-foreground mb-1">
            Áreas de atendimento
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Atendemos as principais cidades e bairros da região metropolitana
            norte de Belo Horizonte.
          </p>
          <div className="space-y-3">
            {CIDADES.map((c) => (
              <article
                key={c.nome}
                className="rounded-2xl bg-card border border-border p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-bold text-foreground">{c.nome}</h4>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {c.bairros.length} bairros
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.bairros.map((b) => (
                    <button
                      key={b}
                      onClick={() => onStartBooking()}
                      className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-foreground hover:bg-primary/20 transition"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Diferenciais SEO-rich */}
        <section className="rounded-2xl bg-card border border-border p-4">
          <h3 className="text-base font-bold text-foreground mb-3">
            Por que escolher a {COMPANY_INFO.nome}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Star className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <span>+2.500 clientes atendidos com nota 4.9/5.</span>
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Produtos antialérgicos seguros para crianças e pets.
              </span>
            </li>
            <li className="flex gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>
                Equipe local treinada — São José da Lapa, Vespasiano e região.
              </span>
            </li>
            <li className="flex gap-2">
              <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Agendamento online em minutos, com integração ao Google Agenda.
              </span>
            </li>
          </ul>
        </section>

        <p className="text-[10px] text-muted-foreground text-center pt-4">
          {COMPANY_INFO.nome} • {COMPANY_INFO.regiao} •{" "}
          {COMPANY_INFO.telefone}
        </p>
      </main>
    </div>
  );
}
