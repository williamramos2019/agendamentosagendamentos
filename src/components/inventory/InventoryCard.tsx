import { InventoryProduct } from "@/core/types";
import { cn } from "@/lib/utils";
import { Package, ShieldCheck, AlertTriangle, Plus } from "lucide-react";

interface InventoryCardProps {
  product: InventoryProduct;
  onEdit: () => void;
}

export function InventoryCard({ product, onEdit }: InventoryCardProps) {
  const isLowStock = product.quantity <= product.minQuantity;

  return (
    <button 
      onClick={onEdit}
      className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all text-left"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        product.category === 'EPI' ? "bg-blue-500/10" : "bg-emerald-500/10"
      )}>
        {product.category === 'EPI' ? (
          <ShieldCheck className={cn("h-6 w-6", "text-blue-500")} />
        ) : (
          <Package className={cn("h-6 w-6", "text-emerald-500")} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {product.code}
          </span>
          {isLowStock && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase">
              <AlertTriangle className="h-3 w-3" />
              Baixo
            </span>
          )}
        </div>
        <p className="font-bold text-foreground truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.category}</p>
      </div>

      <div className="text-right">
        <p className={cn(
          "text-lg font-black",
          isLowStock ? "text-amber-500" : "text-foreground"
        )}>
          {product.quantity}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase font-medium">unidades</p>
      </div>
    </button>
  );
}
