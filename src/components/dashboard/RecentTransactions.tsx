import { Scissors, ShoppingBag, ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sale } from "@/hooks/useAppState";

interface Transaction {
  id: string;
  type: "service" | "product" | "expense" | "income";
  description: string;
  amount: number;
  time: string;
  client?: string;
}

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

interface RecentTransactionsProps {
  sales: Sale[];
  onViewAll?: () => void;
}

export function RecentTransactions({ sales, onViewAll }: RecentTransactionsProps) {
  // Convert sales to transactions format
  const transactions: Transaction[] = sales.slice(0, 5).map(sale => ({
    id: sale.id,
    type: sale.type,
    description: sale.items.map(i => i.name).join(", "),
    amount: sale.total,
    time: new Date(sale.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    client: sale.clientName
  }));

  return (
    <div className="px-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Últimas Movimentações</h2>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver tudo
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Nenhuma venda registrada hoje</p>
          <p className="text-xs mt-1">Registre sua primeira venda!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <button
              key={transaction.id}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-salon transition-all duration-200"
            >
              <TransactionIcon type={transaction.type} />
              
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {transaction.description}
                </p>
                {transaction.client && (
                  <p className="text-xs text-muted-foreground">{transaction.client}</p>
                )}
              </div>

              <div className="text-right shrink-0">
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
      )}
    </div>
  );
}