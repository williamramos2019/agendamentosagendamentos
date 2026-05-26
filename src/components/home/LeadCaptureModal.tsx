import { useState } from "react";
import { Send, User, Phone, MessageSquare, X } from "lucide-react";
import { leadRepository } from "@/repositories/LeadRepository";
import { toast } from "sonner";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Por favor, preencha nome e telefone.");
      return;
    }

    setLoading(true);
    try {
      await leadRepository.create({
        name,
        phone,
        source: "Orçamento Rápido (Home)",
        email: ""
      });

      toast.success("Solicitação enviada!", {
        description: "Em instantes entraremos em contato."
      });
      onClose();
      setName("");
      setPhone("");
      setMessage("");
    } catch (error) {
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <header className="p-6 pb-2 flex items-center justify-between">
          <h2 className="text-xl font-black text-foreground">Orçamento Rápido</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition">
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground mb-4">
            Preencha seus dados e receba um orçamento em menos de 5 minutos via WhatsApp.
          </p>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Seu Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(31) 99999-9999"
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">O que deseja limpar? (Opcional)</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Sofá 3 lugares e colchão..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black flex items-center justify-center gap-2 shadow-salon active:scale-[0.98] transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {loading ? "Enviando..." : "Receber Orçamento agora"}
          </button>
        </form>
      </div>
    </div>
  );
}
