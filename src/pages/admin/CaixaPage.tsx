import { useState } from "react";
import { ArrowLeft, Lock, Unlock, Plus, Minus, ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CashState, CashOperation } from "@/hooks/useAppState";
import { toast } from "sonner";

interface CaixaPageProps {
  onBack: () => void;
  cashState: CashState;
  currentBalance: number;
  onOpenCash: (openingBalance: number) => void;
  onCloseCash: () => void;
  onAddOperation: (type: 'withdrawal' | 'deposit', amount: number, description: string) => void;
}

export function CaixaPage({ 
  onBack, 
  cashState, 
  currentBalance, 
  onOpenCash, 
  onCloseCash, 
  onAddOperation 
}: CaixaPageProps) {
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showOperationModal, setShowOperationModal] = useState<"withdrawal" | "deposit" | null>(null);
  const [openingBalanceInput, setOpeningBalanceInput] = useState("");
  const [operationAmount, setOperationAmount] = useState("");
  const [operationDescription, setOperationDescription] = useState("");
  const [countedAmount, setCountedAmount] = useState("");

  const { isOpen, openedAt, openingBalance, operations } = cashState;

  const totalSales = operations.filter(op => op.type === "sale").reduce((acc, op) => acc + op.amount, 0);
  const totalWithdrawals = operations.filter(op => op.type === "withdrawal").reduce((acc, op) => acc + Math.abs(op.amount), 0);
  const totalDeposits = operations.filter(op => op.type === "deposit").reduce((acc, op) => acc + op.amount, 0);

  const getOperationIcon = (type: CashOperation["type"]) => {
    switch (type) {
      case "sale":
        return <ArrowUpRight className="h-4 w-4 text-success" />;
      case "withdrawal":
        return <ArrowDownLeft className="h-4 w-4 text-destructive" />;
      case "deposit":
        return <Plus className="h-4 w-4 text-primary" />;
      case "expense":
        return <Minus className="h-4 w-4 text-warning" />;
    }
  };

  const handleOpenCash = () => {
    const value = parseFloat(openingBalanceInput.replace(',', '.')) || 0;
    onOpenCash(value);
    setShowOpenModal(false);
    setOpeningBalanceInput("");
    toast.success("Caixa aberto com sucesso!");
  };

  const handleCloseCash = () => {
    const counted = parseFloat(countedAmount.replace(',', '.')) || 0;
    const difference = counted - currentBalance;
    
    if (Math.abs(difference) > 0.01) {
      toast.warning(`Diferença de R$ ${difference.toFixed(2)} no fechamento`);
    } else {
      toast.success("Caixa fechado com sucesso!");
    }
    
    onCloseCash();
    setShowCloseModal(false);
    setCountedAmount("");
  };

  const handleAddOperation = () => {
    const amount = parseFloat(operationAmount.replace(',', '.')) || 0;
    if (amount <= 0) {
      toast.error("Informe um valor válido");
      return;
    }
    if (!operationDescription.trim()) {
      toast.error("Informe uma descrição");
      return;
    }
    
    onAddOperation(showOperationModal!, amount, operationDescription);
    toast.success(showOperationModal === 'withdrawal' ? 'Sangria registrada!' : 'Suprimento registrado!');
    setShowOperationModal(null);
    setOperationAmount("");
    setOperationDescription("");
  };

  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters except comma and dot
    const cleaned = value.replace(/[^\d,]/g, '');
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-foreground">Controle de Caixa</h1>
            <p className="text-xs text-muted-foreground">Hoje, {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Cash Status Card */}
        <div className={cn(
          "rounded-2xl p-5 border-2 transition-all duration-200",
          isOpen ? "border-success/30 bg-success/5" : "border-muted bg-muted/30"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isOpen ? "bg-success/10" : "bg-muted"
              )}>
                {isOpen ? (
                  <Unlock className="h-6 w-6 text-success" />
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  Caixa {isOpen ? "Aberto" : "Fechado"}
                </p>
                {isOpen && openedAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Aberto às {openedAt}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant={isOpen ? "outline" : "default"}
              size="sm"
              onClick={() => isOpen ? setShowCloseModal(true) : setShowOpenModal(true)}
            >
              {isOpen ? "Fechar" : "Abrir"}
            </Button>
          </div>

          {isOpen && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Abertura</p>
                <p className="font-semibold text-foreground">R$ {openingBalance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Saldo Atual</p>
                <p className="font-bold text-2xl text-success">R$ {currentBalance.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {isOpen && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in">
            <div className="bg-card rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground">Vendas</p>
              <p className="font-bold text-success">+R$ {totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground">Sangrias</p>
              <p className="font-bold text-destructive">-R$ {totalWithdrawals.toFixed(2)}</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground">Suprimentos</p>
              <p className="font-bold text-primary">+R$ {totalDeposits.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isOpen && (
          <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Button 
              variant="outline" 
              className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setShowOperationModal("withdrawal")}
            >
              <Minus className="h-4 w-4 mr-2" />
              Sangria
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-primary"
              onClick={() => setShowOperationModal("deposit")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Suprimento
            </Button>
          </div>
        )}

        {/* Operations List */}
        {isOpen && (
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="font-semibold text-foreground mb-3">Movimentações do Dia</h2>
            {operations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nenhuma movimentação ainda</p>
                <p className="text-xs mt-1">Registre uma venda ou operação</p>
              </div>
            ) : (
              <div className="space-y-2">
                {operations.map((op) => (
                  <div
                    key={op.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      op.type === "sale" && "bg-success/10",
                      op.type === "withdrawal" && "bg-destructive/10",
                      op.type === "deposit" && "bg-primary/10"
                    )}>
                      {getOperationIcon(op.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{op.description}</p>
                      <p className="text-xs text-muted-foreground">{op.time}</p>
                    </div>
                    <p className={cn(
                      "font-semibold",
                      op.amount >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {op.amount >= 0 ? "+" : ""}R$ {Math.abs(op.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Closed State */}
        {!isOpen && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Lock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Caixa Fechado</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Abra o caixa para iniciar as operações do dia
            </p>
            <Button onClick={() => setShowOpenModal(true)}>
              Abrir Caixa
            </Button>
          </div>
        )}
      </main>

      {/* Open Cash Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <h2 className="font-bold text-lg mb-4">Abrir Caixa</h2>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor Inicial</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={openingBalanceInput}
                onChange={(e) => setOpeningBalanceInput(formatCurrency(e.target.value))}
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowOpenModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleOpenCash}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Cash Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom max-h-[70vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Fechar Caixa</h2>
            
            <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Abertura</span>
                <span className="font-medium">R$ {openingBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendas</span>
                <span className="font-medium text-success">+R$ {totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sangrias</span>
                <span className="font-medium text-destructive">-R$ {totalWithdrawals.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suprimentos</span>
                <span className="font-medium text-primary">+R$ {totalDeposits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold">Saldo Esperado</span>
                <span className="font-bold text-lg">R$ {currentBalance.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor Contado</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={countedAmount}
                onChange={(e) => setCountedAmount(formatCurrency(e.target.value))}
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCloseModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleCloseCash}>
                Fechar Caixa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Operation Modal */}
      {showOperationModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <h2 className="font-bold text-lg mb-4">
              {showOperationModal === "withdrawal" ? "Sangria" : "Suprimento"}
            </h2>
            
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={operationAmount}
                onChange={(e) => setOperationAmount(formatCurrency(e.target.value))}
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Descrição</label>
              <input
                type="text"
                placeholder="Motivo da operação"
                value={operationDescription}
                onChange={(e) => setOperationDescription(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowOperationModal(null)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAddOperation}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
