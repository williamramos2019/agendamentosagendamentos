import { Home, Plus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onNewBooking?: () => void;
}

const COMPANY_WHATSAPP = "5531980252882";

export function MobileNav({ currentPath, onNavigate, onNewBooking }: MobileNavProps) {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Olá! Vim pelo site da Auto Limpeza Pro e gostaria de tirar uma dúvida.");
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-card/95 backdrop-blur-lg border-t border-border safe-bottom pointer-events-auto">
      <div className="flex items-center justify-around py-2 relative">
        <button
          onClick={() => onNavigate("/")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[80px]",
            currentPath === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn("relative p-1.5 rounded-xl transition-all", currentPath === "/" && "bg-primary/10")}>
            <Home className={cn("h-6 w-6", currentPath === "/" && "scale-110")} strokeWidth={currentPath === "/" ? 2.5 : 2} />
          </div>
          <span className={cn("text-[10px] font-medium", currentPath === "/" && "font-semibold")}>Início</span>
        </button>

        {/* Center FAB — Agendar */}
        <button
          onClick={onNewBooking}
          aria-label="Novo agendamento"
          className="flex flex-col items-center justify-center -mt-7 mx-1"
        >
          <div className="w-14 h-14 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-salon-lg active:scale-95 transition-all border-4 border-background">
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-semibold text-foreground mt-1">Agendar</span>
        </button>

        <button
          onClick={openWhatsApp}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[80px] text-muted-foreground hover:text-foreground"
        >
          <div className="relative p-1.5 rounded-xl transition-all">
            <MessageCircle className="h-6 w-6" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium">WhatsApp</span>
        </button>
      </div>
    </nav>
  );
}
