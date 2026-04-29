import { useState } from "react";
import { X, Scissors, ShoppingBag, CreditCard, Banknote, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Sale, SaleItem } from "@/hooks/useAppState";

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSale?: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
}

type SaleType = "service" | "product";
type PaymentMethod = "cash" | "credit" | "debit" | "pix";

const services = [
  { id: "1", name: "Higienização Sofá 2 Lugares", price: 180 },
  { id: "2", name: "Higienização Sofá 3 Lugares", price: 240 },
  { id: "3", name: "Higienização Colchão Casal", price: 200 },
  { id: "4", name: "Lavagem Interna Automotiva", price: 250 },
  { id: "5", name: "Polimento + Cristalização", price: 450 },
  { id: "6", name: "Higienização de Cadeiras (un)", price: 35 },
  { id: "7", name: "Limpeza Pós-Obra (m²)", price: 18 },
];

const products = [
  { id: "p1", name: "Protetor de Tecido (frasco)", price: 65 },
  { id: "p2", name: "Cera de Carnaúba", price: 89 },
  { id: "p3", name: "Kit Higienização Couro", price: 149 },
  { id: "p4", name: "Aromatizante Automotivo", price: 35 },
];

const paymentMethods = [
  { id: "cash", name: "Dinheiro", icon: Banknote },
  { id: "credit", name: "Crédito", icon: CreditCard },
  { id: "debit", name: "Débito", icon: CreditCard },
  { id: "pix", name: "PIX", icon: Smartphone },
];

export function QuickSaleModal({ isOpen, onClose, onConfirmSale }: QuickSaleModalProps) {
  const [saleType, setSaleType] = useState<SaleType>("service");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("pix");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const items = saleType === "service" ? services : products;
  
  const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
  const total = selectedItemsData.reduce((acc, item) => acc + item.price, 0);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const resetModal = () => {
    setStep(1);
    setSelectedItems([]);
    setSaleType("service");
    setSelectedPayment("pix");
  };

  const handleConfirm = () => {
    if (onConfirmSale && selectedItemsData.length > 0) {
      onConfirmSale({
        items: selectedItemsData,
        total,
        paymentMethod: selectedPayment,
        type: saleType,
      });
      toast.success(`Venda de R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} registrada!`);
    }
    resetModal();
    onClose();
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 z-[70] bg-background rounded-t-3xl border-t border-border shadow-salon-lg animate-slide-in-bottom max-h-[85vh] flex flex-col mb-[72px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-bold text-lg text-foreground">Nova Venda</h2>
            <p className="text-xs text-muted-foreground">
              {step === 1 && "Selecione os itens"}
              {step === 2 && "Forma de pagamento"}
              {step === 3 && "Confirmar venda"}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Select Items */}
        {step === 1 && (
          <>
            {/* Type Toggle */}
            <div className="p-4 pb-2">
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => { setSaleType("service"); setSelectedItems([]); }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    saleType === "service" 
                      ? "bg-card text-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )}
                >
                  <Scissors className="h-4 w-4" />
                  Serviços
                </button>
                <button
                  onClick={() => { setSaleType("product"); setSelectedItems([]); }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    saleType === "product" 
                      ? "bg-card text-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Produtos
                </button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all duration-200",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border bg-card hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm text-foreground">{item.name}</p>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-primary font-bold mt-1">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const isSelected = selectedPayment === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <span className="font-medium text-foreground">{method.name}</span>
                    {isSelected && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-muted/50 rounded-2xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Resumo da Venda</h3>
              
              <div className="space-y-2">
                {selectedItemsData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium text-foreground">
                      R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Pagamento</span>
                  <span className="font-medium text-foreground">
                    {paymentMethods.find(m => m.id === selectedPayment)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep(prev => (prev - 1) as 1 | 2)}
              >
                Voltar
              </Button>
            )}
            <Button 
              className="flex-1"
              disabled={selectedItems.length === 0}
              onClick={() => {
                if (step < 3) {
                  setStep(prev => (prev + 1) as 2 | 3);
                } else {
                  handleConfirm();
                }
              }}
            >
              {step === 3 ? "Confirmar Venda" : "Continuar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}