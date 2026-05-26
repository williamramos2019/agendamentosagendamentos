import { MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/config/whatsappTemplate";

export function FloatingWhatsApp() {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Olá! Vim pelo site da Auto Limpeza Pro e gostaria de um orçamento premium.");
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-24 right-4 z-[55] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
      aria-label="Falar no WhatsApp"
    >
      <MessageSquare className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
      </span>
    </button>
  );
}
