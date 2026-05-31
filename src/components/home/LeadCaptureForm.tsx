import { useState } from "react";
import { Send, User, Phone, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadCaptureForm({ inline = false }: { inline?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Por favor, preencha nome e telefone.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name,
        phone,
        source: inline ? "Hero Form" : "Modal Form",
        status: "new"
      });

      if (error) throw error;

      toast.success("Solicitação enviada!", {
        description: "Em instantes entraremos em contato via WhatsApp."
      });
      
      setName("");
      setPhone("");
      setCity("");
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const containerClass = inline 
    ? "bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl" 
    : "space-y-4";

  return (
    <form onSubmit={handleSubmit} className={containerClass}>
      {inline && (
        <div className="mb-6 space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Orçamento Grátis
          </h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Receba em menos de 5 minutos</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo" 
            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-primary/50"
          />
        </div>

        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <Input 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="WhatsApp (com DDD)" 
            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-primary/50"
          />
        </div>

        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <Input 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cidade / Bairro" 
            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:ring-primary/50"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-4"
        >
          {loading ? "Enviando..." : "Receber Orçamento Agora"}
          <Send className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <p className="mt-4 text-[9px] text-center text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
        Seus dados estão protegidos • Atendimento 100% seguro
      </p>
    </form>
  );
}