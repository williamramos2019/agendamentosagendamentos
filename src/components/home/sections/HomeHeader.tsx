import { ShieldCheck, Instagram, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/config/whatsappTemplate";

interface HomeHeaderProps {
  onOpenAdmin?: () => void;
}

export function HomeHeader({ onOpenAdmin }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#090F15]/80 backdrop-blur-md border-b border-white/10 px-5 py-3 flex items-center justify-between">
      <button onClick={onOpenAdmin} className="flex items-center gap-3 active:scale-95 transition-transform group">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden group-hover:bg-primary/20 transition-colors">

           <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] leading-none mb-0.5">Bem-vindo à</p>
          <h1 className="text-sm font-black tracking-tight text-white group-hover:text-primary transition-colors">Auto Limpeza Pro</h1>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <a 
          href="https://www.instagram.com/autolimpezapro/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FFB300] via-[#FF0050] to-[#5000FF] active:scale-90 transition-transform"
        >
          <Instagram className="w-5 h-5 text-white" />
        </a>
        <a 
          href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
