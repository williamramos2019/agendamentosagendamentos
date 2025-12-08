import { Scissors, ShoppingBag, ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "service" | "product" | "expense" | "income";
  description: string;
  amount: number;
  time: string;
  client?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "service",
    description: "Corte + Escova",
    amount: 120,
    time: "14:30",
    client: "Maria Silva"
  },
  {
    id: "2",
    type: "product",
    description: "Shampoo Profissional",
    amount: 89,
    time: "13:45",
    client: "Ana Santos"
  },
  {
    id: "3",
    type: "expense",
    description: "Fornecedor - Produtos",
    amount: -450,
    time: "11:00"
  },
  {
    id: "4",
    type: "service",
    description: "Coloração Completa",
    amount: 280,
    time: "10:15",
    client: "Julia Costa"
  },
];

function TransactionIcon({ type }: { type: Transaction["type"] }) {
  const iconClasses = "h-5 w-5";
  
  switch (type) {
    case "service":
      return (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Scissors className={cn(iconClasses, "text-primary")} />
        </div>
      );
    case "product":
      return (
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <ShoppingBag className={cn(iconClasses, "text-accent")} />
        </div>
      );
    case "expense":
      return (
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <ArrowDownLeft className={cn(iconClasses, "text-destructive")} />
        </div>
      );
    case "income":
      return (
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
          <ArrowUpRight className={cn(iconClasses, "text-success")} />
        </div>
      );
  }
}

export function RecentTransactions() {
  return (
    <div className="px-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Últimas Movimentações</h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          Ver tudo
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2">
        {mockTransactions.map((transaction) => (
          <button
            key={transaction.id}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-salon transition-all duration-200"
          >
            <TransactionIcon type={transaction.type} />
            
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm">
                {transaction.description}
              </p>
              {transaction.client && (
                <p className="text-xs text-muted-foreground">{transaction.client}</p>
              )}
            </div>

            <div className="text-right">
              <p className={cn(
                "font-semibold text-sm",
                transaction.amount >= 0 ? "text-success" : "text-destructive"
              )}>
                {transaction.amount >= 0 ? "+" : ""}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{transaction.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
