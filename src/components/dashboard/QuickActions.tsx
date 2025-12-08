import { Plus, Scissors, ShoppingCart, Receipt, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}

function QuickActionButton({ icon: Icon, label, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95",
        color
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
}

interface QuickActionsProps {
  onNewSale?: () => void;
  onNewService?: () => void;
  onNewExpense?: () => void;
  onClients?: () => void;
  onStock?: () => void;
}

export function QuickActions({ onNewSale, onNewService, onNewExpense, onClients, onStock }: QuickActionsProps) {
  const actions = [
    { 
      icon: Plus, 
      label: "Nova Venda", 
      color: "gradient-primary text-primary-foreground shadow-salon",
      onClick: onNewSale 
    },
    { 
      icon: Scissors, 
      label: "Serviço", 
      color: "bg-secondary text-secondary-foreground",
      onClick: onNewService 
    },
    { 
      icon: Receipt, 
      label: "Despesa", 
      color: "bg-destructive/10 text-destructive",
      onClick: onNewExpense 
    },
    { 
      icon: Users, 
      label: "Clientes", 
      color: "bg-accent/10 text-accent",
      onClick: onClients 
    },
    { 
      icon: Package, 
      label: "Estoque", 
      color: "bg-muted text-muted-foreground",
      onClick: onStock 
    },
  ];

  return (
    <div className="px-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h2 className="text-sm font-semibold text-foreground mb-3">Ações Rápidas</h2>
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-2">
        {actions.map((action) => (
          <QuickActionButton key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
}
