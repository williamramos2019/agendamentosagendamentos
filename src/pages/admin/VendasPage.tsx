import { useState } from "react";
import { ArrowLeft, Search, Scissors, ShoppingBag, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sale } from "@/hooks/useAppState";

interface VendasPageProps {
  onBack: () => void;
  onNewSale: () => void;
  sales?: Sale[];
}

const paymentMethodLabels: Record<string, string> = {
  cash: "Dinheiro",
  credit: "Crédito",
  debit: "Débito",
  pix: "PIX"
};

export function VendasPage({ onBack, onNewSale, sales = [] }: VendasPageProps) {
  const [filter, setFilter] = useState<"all" | "service" | "product">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSales = sales.filter(sale => {
    const matchesFilter = filter === "all" || sale.type === filter;
    const matchesSearch = sale.items.some(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || (sale.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  // Group by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todaySales = filteredSales.filter(s => {
    const saleDate = new Date(s.createdAt);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });

  const yesterdaySales = filteredSales.filter(s => {
    const saleDate = new Date(s.createdAt);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === yesterday.getTime();
  });

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
              <p className="text-2xl font-bold">R$ {totalToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
          {sales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Nenhuma venda registrada</p>
              <p className="text-xs mt-1">Registre sua primeira venda!</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function SaleCard({ sale }: { sale: Sale }) {
  const itemNames = sale.items.map(i => i.name).join(", ");
  const time = new Date(sale.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
          {itemNames}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {sale.clientName && <span>{sale.clientName}</span>}
          {sale.clientName && <span>•</span>}
          <span>{time}</span>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-foreground">R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <p className="text-xs text-muted-foreground">{paymentMethodLabels[sale.paymentMethod] || sale.paymentMethod}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}