import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Users, Globe, Smartphone, MousePointerClick, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getApiUrl } from "@/config/api";

interface AnalyticsPanelProps {
  onBack: () => void;
}

interface Visit {
  id: string;
  session_id: string;
  path: string;
  source_category: string;
  source_name: string | null;
  device_type: string | null;
  browser: string | null;
  created_at: string;
}

interface ConversionEvent {
  id: string;
  session_id: string;
  event_name: string;
  event_data: string;
  created_at: string;
}

interface AnalyticsData {
  visits: Visit[];
  events: ConversionEvent[];
  summary: {
    total_appointments: number;
    total_leads: number;
  };
}

type Range = "today" | "7d" | "30d" | "all";

const RANGE_LABELS: Record<Range, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
  all: "Tudo",
};

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direto",
  search: "Busca",
  social: "Redes sociais",
  messaging: "Mensageiros",
  referral: "Outros sites",
  internal: "Interno",
};

export function AnalyticsPanel({ onBack }: AnalyticsPanelProps) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("7d");

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('analytics'));
      if (!response.ok) throw new Error('Falha ao carregar analytics');
      const data = await response.json();
      setVisits(data as Visit[]);
    } catch (error) {
      toast.error("Erro ao carregar dados de analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff =
      range === "today" ? new Date().setHours(0, 0, 0, 0)
      : range === "7d" ? now - 7 * 86400000
      : range === "30d" ? now - 30 * 86400000
      : 0;
    return visits.filter((v) => new Date(v.created_at).getTime() >= cutoff);
  }, [visits, range]);

  const stats = useMemo(() => {
    const sessions = new Set(filtered.map((v) => v.session_id));
    const sources = new Map<string, number>();
    const sourceNames = new Map<string, number>();
    const devices = new Map<string, number>();
    const pages = new Map<string, number>();

    filtered.forEach((v) => {
      sources.set(v.source_category, (sources.get(v.source_category) ?? 0) + 1);
      const sn = v.source_name ?? "(direto)";
      sourceNames.set(sn, (sourceNames.get(sn) ?? 0) + 1);
      const dev = v.device_type ?? "outro";
      devices.set(dev, (devices.get(dev) ?? 0) + 1);
      pages.set(v.path, (pages.get(v.path) ?? 0) + 1);
    });

    const sortedEntries = (m: Map<string, number>) =>
      Array.from(m.entries()).sort((a, b) => b[1] - a[1]);

    return {
      pageviews: filtered.length,
      visitors: sessions.size,
      sources: sortedEntries(sources),
      sourceNames: sortedEntries(sourceNames).slice(0, 6),
      devices: sortedEntries(devices),
      pages: sortedEntries(pages).slice(0, 6),
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-base text-foreground">Analytics do site</h1>
          </div>
          <button onClick={fetchVisits} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center" aria-label="Atualizar">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                range === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-card border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Users className="h-4 w-4" /> Visitantes únicos
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.visitors}</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <MousePointerClick className="h-4 w-4" /> Pageviews
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.pageviews}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Section icon={<Globe className="h-4 w-4" />} title="De onde vieram">
          {stats.sources.length === 0 ? (
            <Empty />
          ) : (
            <BarList items={stats.sources.map(([k, v]) => [SOURCE_LABELS[k] ?? k, v])} total={stats.pageviews} />
          )}
        </Section>

        <Section icon={<Globe className="h-4 w-4" />} title="Origens detalhadas">
          {stats.sourceNames.length === 0 ? <Empty /> : <BarList items={stats.sourceNames} total={stats.pageviews} />}
        </Section>

        <Section icon={<MousePointerClick className="h-4 w-4" />} title="Páginas mais vistas">
          {stats.pages.length === 0 ? <Empty /> : <BarList items={stats.pages} total={stats.pageviews} />}
        </Section>

        <Section icon={<Smartphone className="h-4 w-4" />} title="Dispositivos">
          {stats.devices.length === 0 ? <Empty /> : <BarList items={stats.devices} total={stats.pageviews} />}
          </Section>
        </div>
      </main>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        {icon} {title}
      </h2>
      <div className="rounded-2xl bg-card border border-border p-4">{children}</div>
    </div>
  );
}

function BarList({ items, total }: { items: Array<[string, number]>; total: number }) {
  return (
    <div className="space-y-2">
      {items.map(([label, value]) => {
        const pct = total > 0 ? Math.round((value / total) * 100) : 0;
        return (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground truncate pr-2">{label}</span>
              <span className="text-muted-foreground tabular-nums">{value} · {pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-muted-foreground text-center py-4">Sem dados ainda neste período.</p>;
}
