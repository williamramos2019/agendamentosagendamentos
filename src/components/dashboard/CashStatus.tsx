import { Lock, Unlock, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CashStatusProps {
  isOpen: boolean;
  openedAt?: string | null;
  openingBalance?: number;
  currentBalance?: number;
  onOpenCash?: () => void;
  onViewDetails?: () => void;
}

export function CashStatus({ 
  isOpen, 
  openedAt, 
  openingBalance = 0, 
  currentBalance = 0,
  onOpenCash,
  onViewDetails 
}: CashStatusProps) {
  return (
    <div className="px-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className={cn(
        "rounded-2xl p-4 border transition-all duration-200",
        isOpen 
          ? "bg-success/5 border-success/20" 
          : "bg-muted/50 border-border"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isOpen ? "bg-success/10" : "bg-muted"
            )}>
              {isOpen ? (
                <Unlock className="h-5 w-5 text-success" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
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

          {isOpen ? (
            <button 
              onClick={onViewDetails}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Detalhes
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <Button size="sm" onClick={onOpenCash}>
              Abrir Caixa
            </Button>
          )}
        </div>

        {isOpen && (
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Abertura</p>
              <p className="font-semibold text-foreground">
                R$ {openingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Saldo Atual</p>
              <p className="font-bold text-success">
                R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
