import { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, Package, AlertTriangle, History, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/InventoryService";
import { InventoryProduct } from "@/core/types";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import { StockMovementModal } from "@/components/inventory/StockMovementModal";
import { useNavigate } from "react-router-dom";

export default function StockPage() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin");
  const onNavigate = (path: string) => navigate(path);

  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "EPI" | "Produto">("all");
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  useEffect(() => {
    setProducts(inventoryService.getProducts());
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === "all" || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const lowStockCount = products.filter(p => p.quantity <= p.minQuantity).length;

  const handleUpdateStock = () => {
    setProducts(inventoryService.getProducts());
    setIsMovementModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">Estoque</h1>
            <p className="text-xs text-muted-foreground">{products.length} itens cadastrados</p>
          </div>
          <button 
            onClick={() => onNavigate("/historico-estoque")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <History className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-500">{lowStockCount} itens com estoque baixo</p>
              <p className="text-xs text-amber-500/80">Necessário reposição em breve.</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
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
            onClick={() => setFilter("EPI")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "EPI" 
                ? "gradient-primary text-primary-foreground shadow-salon" 
                : "bg-muted text-muted-foreground"
            )}
          >
            EPIs
          </button>
          <button
            onClick={() => setFilter("Produto")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "Produto" 
                ? "gradient-primary text-primary-foreground shadow-salon" 
                : "bg-muted text-muted-foreground"
            )}
          >
            Produtos
          </button>
        </div>

        {/* List */}
        <div className="grid gap-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <InventoryCard 
                key={product.id} 
                product={product} 
                onEdit={() => {
                  setSelectedProduct(product);
                  setIsMovementModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button 
          onClick={() => {
            setSelectedProduct(null);
            setIsMovementModalOpen(true);
          }}
          className="h-14 w-14 rounded-full shadow-lg p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <StockMovementModal 
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSuccess={handleUpdateStock}
        product={selectedProduct}
      />
    </div>
  );
}
