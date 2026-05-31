import { Home, Plus, MessageCircle, Map as MapIcon, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { AnalyticsService } from "@/services/AnalyticsService";

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onNewBooking?: () => void;
}

const COMPANY_WHATSAPP = COMPANY_INFO.whatsapp;

export function MobileNav({ currentPath, onNavigate, onNewBooking }: MobileNavProps) {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Olá! Vim pelo site da Auto Limpeza Pro e gostaria de tirar uma dúvida.");
    AnalyticsService.trackEvent("whatsapp_click", { location: "mobile_nav" });
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${msg}`, "_blank");
  };

  const isHome = currentPath === "/";
  const isBlog = currentPath === "/blog" || currentPath === "/dicas" || currentPath === "/homebase-news" || currentPath.startsWith("/blog/") || currentPath.startsWith("/dicas/");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] glass-premium safe-bottom pointer-events-auto flex justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-4xl flex items-center justify-around py-3 relative">
        <button
          onClick={() => onNavigate("/")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
            isHome ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn("relative p-1.5 rounded-xl transition-all", isHome && "bg-primary/10")}>
            <Home className={cn("h-6 w-6", isHome && "scale-110")} strokeWidth={isHome ? 2.5 : 2} />
          </div>
          <span className={cn("text-[10px] font-medium", isHome && "font-semibold")}>Início</span>
        </button>

        <button
          onClick={() => window.open("https://blogatolimpezapro.lovable.app", "_blank")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
            isBlog ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn("relative p-1.5 rounded-xl transition-all", isBlog && "bg-primary/10")}>
            <BookOpen className={cn("h-6 w-6", isBlog && "scale-110")} strokeWidth={isBlog ? 2.5 : 2} />
          </div>
          <span className={cn("text-[10px] font-medium", isBlog && "font-semibold")}>Dicas</span>
        </button>

        {/* Center FAB — Agendar */}
        <button
          onClick={onNewBooking}
          aria-label="Novo agendamento"
          className="flex flex-col items-center justify-center -mt-7 mx-1"
        >
          <div className="w-14 h-14 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-salon-lg active:scale-95 transition-all border-4 border-[#090F15] relative group">
            <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-20 animate-pulse" />
            <Plus className="h-7 w-7 relative z-10" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black text-foreground mt-1 uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Agendar</span>
        </button>

        <button
          onClick={openWhatsApp}
          className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px] text-muted-foreground hover:text-foreground"
        >
          <div className="relative p-1.5 rounded-xl transition-all">
            <MessageCircle className="h-6 w-6" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium">WhatsApp</span>
        </button>

        <button
          onClick={() => onNavigate("/mapa-do-site")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
            currentPath === "/mapa-do-site" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn("relative p-1.5 rounded-xl transition-all", currentPath === "/mapa-do-site" && "bg-primary/10")}>
            <MapIcon className={cn("h-6 w-6", currentPath === "/mapa-do-site" && "scale-110")} strokeWidth={currentPath === "/mapa-do-site" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-medium">Mapa</span>
        </button>
      </div>
    </nav>
  );
}
