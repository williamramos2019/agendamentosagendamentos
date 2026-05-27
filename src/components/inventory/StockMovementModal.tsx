import { useState, useEffect } from "react";
import { X, Plus, Minus, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InventoryProduct } from "@/core/types";
import { inventoryService } from "@/services/InventoryService";
import { toast } from "sonner";

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: InventoryProduct | null;
}

export function StockMovementModal({ isOpen, onClose, onSuccess, product }: StockMovementModalProps) {
  const [type, setType] = useState<'entry' | 'exit'>('entry');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setReason("");
      setType('entry');
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    try {
      inventoryService.updateStock(product.id, quantity, type, reason || (type === 'entry' ? 'Entrada manual' : 'Saída manual'));
      toast.success("Estoque atualizado com sucesso!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao atualizar estoque");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-background w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Ajustar Estoque</h2>
            <p className="text-xs text-muted-foreground">{product.name} ({product.code})</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selector */}
          <div className="flex gap-3">
            <button
              onClick={() => setType('entry')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl border-2 transition-all",
                type === 'entry' 
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" 
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              <Plus className="h-5 w-5" />
              <span className="font-bold">Entrada</span>
            </button>
            <button
              onClick={() => setType('exit')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl border-2 transition-all",
                type === 'exit' 
                  ? "border-amber-500 bg-amber-500/10 text-amber-600" 
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              <Minus className="h-5 w-5" />
              <span className="font-bold">Saída</span>
            </button>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Quantidade</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center active:scale-95 transition-transform"
              >
                <Minus className="h-6 w-6" />
              </button>
              <div className="flex-1 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
                <span className="text-2xl font-black">{quantity}</span>
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Motivo (Opcional)</label>
            <textarea
              placeholder="Ex: Compra de fornecedor, perda, uso interno..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-2xl bg-muted border border-border p-4 h-24 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="bg-blue-500/5 rounded-2xl p-4 flex gap-3 border border-blue-500/10">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700/80 leading-relaxed">
              Esta ação irá alterar o saldo atual de <strong>{product.quantity}</strong> para <strong>{type === 'entry' ? product.quantity + quantity : Math.max(0, product.quantity - quantity)}</strong> unidades.
            </p>
          </div>
        </div>

        <div className="p-6 pt-2">
          <Button 
            onClick={handleConfirm}
            className="w-full h-14 rounded-2xl text-lg font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Confirmar Ajuste"}
          </Button>
        </div>
      </div>
    </div>
  );
}
