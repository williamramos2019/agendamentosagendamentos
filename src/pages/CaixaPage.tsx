import { useState } from "react";
import { ArrowLeft, Lock, Unlock, Plus, Minus, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CashOperation {
  id: string;
  type: "sale" | "withdrawal" | "deposit" | "expense";
  description: string;
  amount: number;
  time: string;
}

const mockOperations: CashOperation[] = [
  { id: "1", type: "sale", description: "Corte + Escova", amount: 120, time: "14:30" },
  { id: "2", type: "sale", description: "Coloração", amount: 280, time: "13:15" },
  { id: "3", type: "withdrawal", description: "Sangria", amount: -200, time: "12:00" },
  { id: "4", type: "sale", description: "Manicure", amount: 35, time: "11:30" },
  { id: "5", type: "deposit", description: "Suprimento", amount: 100, time: "09:00" },
];

interface CaixaPageProps {
  onBack: () => void;
}

export function CaixaPage({ onBack }: CaixaPageProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showOperationModal, setShowOperationModal] = useState<"withdrawal" | "deposit" | null>(null);
  const [openingBalance] = useState(200);
  const [operations] = useState(mockOperations);

  const totalSales = operations.filter(op => op.type === "sale").reduce((acc, op) => acc + op.amount, 0);
  const totalWithdrawals = operations.filter(op => op.type === "withdrawal").reduce((acc, op) => acc + Math.abs(op.amount), 0);
  const totalDeposits = operations.filter(op => op.type === "deposit").reduce((acc, op) => acc + op.amount, 0);
  const currentBalance = openingBalance + totalSales - totalWithdrawals + totalDeposits;

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
                {isOpen && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Aberto às 08:30</span>
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom safe-bottom">
            <h2 className="font-bold text-lg mb-4">Abrir Caixa</h2>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor Inicial</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowOpenModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => { setIsOpen(true); setShowOpenModal(false); }}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Cash Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom safe-bottom">
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
                placeholder="R$ 0,00"
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCloseModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => { setIsOpen(false); setShowCloseModal(false); }}>
                Fechar Caixa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Operation Modal */}
      {showOperationModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom safe-bottom">
            <h2 className="font-bold text-lg mb-4">
              {showOperationModal === "withdrawal" ? "Sangria" : "Suprimento"}
            </h2>
            
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Descrição</label>
              <input
                type="text"
                placeholder="Motivo da operação"
                className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowOperationModal(null)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => setShowOperationModal(null)}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
