import { useState } from "react";
import { ArrowLeft, Search, Filter, Scissors, ShoppingBag, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Sale {
  id: string;
  type: "service" | "product";
  items: string[];
  client: string;
  total: number;
  paymentMethod: string;
  date: string;
  time: string;
  employee?: string;
}

const mockSales: Sale[] = [
  {
    id: "1",
    type: "service",
    items: ["Corte Feminino", "Escova"],
    client: "Maria Silva",
    total: 140,
    paymentMethod: "PIX",
    date: "Hoje",
    time: "14:30",
    employee: "Ana"
  },
  {
    id: "2",
    type: "product",
    items: ["Shampoo 300ml", "Condicionador 300ml"],
    client: "Julia Costa",
    total: 87,
    paymentMethod: "Crédito",
    date: "Hoje",
    time: "13:15"
  },
  {
    id: "3",
    type: "service",
    items: ["Coloração Completa"],
    client: "Fernanda Lima",
    total: 280,
    paymentMethod: "Débito",
    date: "Hoje",
    time: "11:00",
    employee: "Carla"
  },
  {
    id: "4",
    type: "service",
    items: ["Manicure", "Pedicure"],
    client: "Patrícia Souza",
    total: 80,
    paymentMethod: "Dinheiro",
    date: "Ontem",
    time: "16:45",
    employee: "Bia"
  },
  {
    id: "5",
    type: "service",
    items: ["Hidratação"],
    client: "Camila Rocha",
    total: 90,
    paymentMethod: "PIX",
    date: "Ontem",
    time: "10:30",
    employee: "Ana"
  },
];

interface VendasPageProps {
  onBack: () => void;
  onNewSale: () => void;
}

export function VendasPage({ onBack, onNewSale }: VendasPageProps) {
  const [filter, setFilter] = useState<"all" | "service" | "product">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSales = mockSales.filter(sale => {
    const matchesFilter = filter === "all" || sale.type === filter;
    const matchesSearch = sale.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const todaySales = filteredSales.filter(s => s.date === "Hoje");
  const yesterdaySales = filteredSales.filter(s => s.date === "Ontem");

  const totalToday = todaySales.reduce((acc, s) => acc + s.total, 0);
  const totalSalesCount = todaySales.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">Vendas</h1>
            <p className="text-xs text-muted-foreground">{totalSalesCount} vendas hoje</p>
          </div>
          <Button size="sm" onClick={onNewSale}>
            Nova Venda
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Today Stats */}
        <div className="gradient-primary rounded-2xl p-4 shadow-salon animate-fade-in">
          <div className="flex items-center gap-3 text-primary-foreground">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Vendas de Hoje</p>
              <p className="text-2xl font-bold">R$ {totalToday.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por cliente ou serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "all" 
                ? "gradient-primary text-primary-foreground shadow-salon" 
                : "bg-muted text-muted-foreground"
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("service")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "service" 
                ? "gradient-primary text-primary-foreground shadow-salon" 
                : "bg-muted text-muted-foreground"
            )}
          >
            <Scissors className="h-4 w-4" />
            Serviços
          </button>
          <button
            onClick={() => setFilter("product")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "product" 
                ? "gradient-primary text-primary-foreground shadow-salon" 
                : "bg-muted text-muted-foreground"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            Produtos
          </button>
        </div>

        {/* Sales List */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {todaySales.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Hoje</h3>
              </div>
              <div className="space-y-2">
                {todaySales.map((sale) => (
                  <SaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            </div>
          )}

          {yesterdaySales.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Ontem</h3>
              </div>
              <div className="space-y-2">
                {yesterdaySales.map((sale) => (
                  <SaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SaleCard({ sale }: { sale: Sale }) {
  return (
    <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-salon transition-all text-left">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        sale.type === "service" ? "bg-primary/10" : "bg-accent/10"
      )}>
        {sale.type === "service" ? (
          <Scissors className="h-5 w-5 text-primary" />
        ) : (
          <ShoppingBag className="h-5 w-5 text-accent" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {sale.items.join(", ")}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{sale.client}</span>
          <span>•</span>
          <span>{sale.time}</span>
          {sale.employee && (
            <>
              <span>•</span>
              <span>{sale.employee}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-foreground">R$ {sale.total.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">{sale.paymentMethod}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
