import { useState, useEffect } from "react";
import { X, Search, User, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InventoryProduct, Collaborator } from "@/core/types";
import { inventoryService } from "@/services/InventoryService";
import { toast } from "sonner";

interface PPEAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PPEAssignmentModal({ isOpen, onClose, onSuccess }: PPEAssignmentModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchCollaborator, setSearchCollaborator] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCollaborators(inventoryService.getCollaborators().filter(c => c.isActive));
      setProducts(inventoryService.getProducts().filter(p => p.category === 'EPI' && p.quantity > 0));
      setStep(1);
      setSelectedCollaborator(null);
      setSelectedProduct(null);
    }
  }, [isOpen]);

  const filteredCollaborators = collaborators.filter(c => 
    c.name.toLowerCase().includes(searchCollaborator.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
    p.code.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedCollaborator && selectedProduct) {
      try {
        inventoryService.deliverPPE(selectedCollaborator, selectedProduct);
        toast.success("EPI entregue com sucesso!");
        onSuccess();
      } catch (error) {
        toast.error("Erro ao registrar entrega");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-background w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Entregar EPI</h2>
            <p className="text-xs text-muted-foreground">
              {step === 1 ? "Selecione o Colaborador" : "Selecione o EPI"}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar colaborador..."
                  value={searchCollaborator}
                  onChange={(e) => setSearchCollaborator(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                {filteredCollaborators.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCollaborator(c.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      selectedCollaborator === c.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      selectedCollaborator === c.id ? "bg-primary/20" : "bg-muted"
                    )}>
                      <User className={cn("h-5 w-5", selectedCollaborator === c.id ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                    {selectedCollaborator === c.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar EPI..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      selectedProduct === p.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      selectedProduct === p.id ? "bg-primary/20" : "bg-muted"
                    )}>
                      <ShieldCheck className={cn("h-5 w-5", selectedProduct === p.id ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.quantity} disponíveis</p>
                    </div>
                    {selectedProduct === p.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-card">
          <div className="flex gap-3">
            {step === 2 && (
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
            )}
            <Button 
              className="flex-1 h-14 rounded-2xl font-bold"
              disabled={step === 1 ? !selectedCollaborator : !selectedProduct}
              onClick={() => {
                if (step === 1) setStep(2);
                else handleConfirm();
              }}
            >
              {step === 1 ? "Próximo" : "Confirmar Entrega"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
