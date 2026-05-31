import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFAB() {
  const whatsappUrl = "https://wa.me/5531980252882?text=Olá! Gostaria de um orçamento para higienização.";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 group"
    >
      <MessageSquare className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-white text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
        Chamar no WhatsApp
      </span>
    </motion.a>
  );
}