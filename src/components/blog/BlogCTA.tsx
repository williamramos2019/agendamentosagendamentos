import { MessageSquare, Calendar, MapPin } from "lucide-react";
import { COMPANY_INFO } from "@/config/whatsappTemplate";
import { cn } from "@/lib/utils";

interface BlogCTAProps {
  onStartBooking?: (serviceId?: string) => void;
  variant?: "inline" | "footer";
  className?: string;
}

export function BlogCTA({ onStartBooking, variant = "inline", className }: BlogCTAProps) {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Olá! Li o artigo no blog da Auto Limpeza Pro e gostaria de solicitar um orçamento.");
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${msg}`, "_blank");
  };

  if (variant === "footer") {
    return (
      <div className={cn("mt-12 p-6 rounded-3xl bg-secondary/30 border border-border text-center space-y-4", className)}>
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-black text-foreground">
          Atendemos São José da Lapa, Vespasiano e região
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Levamos a higienização profissional até você com data e hora marcada.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <button 
            onClick={openWhatsApp}
            className="w-full h-12 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <MessageSquare className="h-5 w-5" /> Falar no WhatsApp
          </button>
          <button 
            onClick={() => onStartBooking?.()}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Calendar className="h-5 w-5" /> Agendar Online
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("my-10 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20 relative overflow-hidden", className)}>
      <div className="relative z-10">
        <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Dica de Especialista</p>
        <h4 className="text-base font-extrabold text-foreground mb-3 leading-tight">
          Solicite um orçamento agora no WhatsApp
        </h4>
        <button 
          onClick={openWhatsApp}
          className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <MessageSquare className="h-4 w-4" /> Solicitar Orçamento Grátis
        </button>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
        <MessageSquare className="h-24 w-24 text-primary" />
      </div>
    </div>
  );
}
