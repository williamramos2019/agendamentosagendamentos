import { Home, ShoppingBag, Wallet, Calendar, User, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Início", path: "/" },
  { icon: ShoppingBag, label: "Vendas", path: "/vendas" },
  { icon: PiggyBank, label: "Finanças", path: "/financas" },
  { icon: Calendar, label: "Agenda", path: "/agenda" },
  { icon: User, label: "Perfil", path: "/perfil" },
];

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function MobileNav({ currentPath, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-card/95 backdrop-blur-lg border-t border-border safe-bottom pointer-events-auto">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon 
                  className={cn(
                    "h-6 w-6 transition-all duration-200",
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
