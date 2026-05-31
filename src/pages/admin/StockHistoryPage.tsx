import { useState, useEffect } from "react";
import { ArrowLeft, Search, History, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/InventoryService";
import { StockMovement, InventoryProduct } from "@/core/types";
import { useNavigate } from "react-router-dom";

export default function StockHistoryPage() {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMovements(inventoryService.getMovements());
    setProducts(inventoryService.getProducts());
  }, []);

  const filteredMovements = movements.filter(m => {
    const product = products.find(p => p.id === m.productId);
    const search = searchQuery.toLowerCase();
    return (product?.name.toLowerCase().includes(search) || 
            product?.code.toLowerCase().includes(search) ||
            m.reason.toLowerCase().includes(search));
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">Histórico</h1>
            <p className="text-xs text-muted-foreground">{movements.length} movimentações</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por produto ou motivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredMovements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhuma movimentação encontrada</p>
            </div>
          ) : (
            filteredMovements.map(m => {
              const product = products.find(p => p.id === m.productId);
              const isEntry = m.type === 'entry';
              
              return (
                <div 
                  key={m.id}
                  className="p-4 rounded-2xl bg-card border border-border flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1",
                    isEntry ? "bg-emerald-500/10" : "bg-amber-500/10"
                  )}>
                    {isEntry ? (
                      <ArrowUpRight className={cn("h-5 w-5", "text-emerald-500")} />
                    ) : (
                      <ArrowDownLeft className={cn("h-5 w-5", "text-amber-500")} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground truncate">{product?.name}</p>
                      <span className={cn(
                        "text-sm font-black",
                        isEntry ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {isEntry ? "+" : "-"}{m.quantity}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{m.reason}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase">
                        <Calendar className="h-3 w-3" />
                        {new Date(m.date).toLocaleDateString('pt-BR')} • {new Date(m.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase">
                        <Tag className="h-3 w-3" />
                        {product?.code}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
