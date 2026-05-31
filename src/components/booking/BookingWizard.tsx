import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const STEPS = [
  { id: 1, title: "Serviço", icon: Sparkles },
  { id: 2, title: "Detalhes", icon: ShieldCheck },
  { id: 3, title: "Data/Hora", icon: Calendar },
  { id: 4, title: "Endereço", icon: MapPin },
  { id: 5, title: "Finalizar", icon: Check },
];

const SERVICES = [
  { id: "sofa", name: "Higienização de Sofá", icon: "🛋️", price: 180 },
  { id: "auto", name: "Estética Automotiva", icon: "🚗", price: 200 },
  { id: "colchao", name: "Limpeza de Colchão", icon: "🛏️", price: 130 },
  { id: "tapete", name: "Lavagem de Tapetes", icon: "🧶", price: 90 },
  { id: "pos-obra", name: "Limpeza Pós-Obra", icon: "🏗️", price: 300 },
];

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setBaseFormData] = useState<any>({
    service: "",
    details: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const updateData = (fields: any) => setBaseFormData((prev: any) => ({ ...prev, ...fields }));

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        client_name: formData.name,
        client_phone: formData.phone,
        client_address: `${formData.address}, ${formData.city}`,
        services: JSON.stringify([{ id: formData.service, name: SERVICES.find(s => s.id === formData.service)?.name }]),
        date: formData.date,
        time: formData.time,
        status: "pending"
      });

      if (error) throw error;

      setCompleted(true);
      toast.success("Agendamento solicitado!", {
        description: "Recebemos seu pedido. Em breve entraremos em contato."
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao finalizar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 py-20"
      >
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
          <Check className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Pedido Realizado!</h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            Seu agendamento para <strong>{SERVICES.find(s => s.id === formData.service)?.name}</strong> foi enviado com sucesso. Aguarde nosso contato via WhatsApp para confirmar os detalhes.
          </p>
        </div>
        <Button className="rounded-2xl h-16 px-10 font-black uppercase tracking-widest" asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 z-0" />
        {STEPS.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= s.id ? "bg-primary border-primary text-black" : "bg-[#090F15] border-white/10 text-white/30"}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s.id ? "text-primary" : "text-white/20"}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[400px] flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Escolha o serviço</h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">O que você deseja limpar hoje?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { updateData({ service: s.id }); nextStep(); }}
                      className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left ${formData.service === s.id ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(14,165,255,0.1)]" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                    >
                      <span className="text-4xl">{s.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white uppercase tracking-tight leading-none">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1">A partir de R$ {s.price}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/10" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Mais detalhes</h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Descreva brevemente o estado do item</p>
                </div>
                <textarea 
                  value={formData.details}
                  onChange={(e) => updateData({ details: e.target.value })}
                  placeholder="Ex: Sofá de 3 lugares retrátil com algumas manchas de café..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 h-40 focus:outline-none focus:ring-2 focus:ring-primary text-white resize-none"
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Data e Hora</h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Sua preferência de agendamento</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Calendar className="w-3 h-3" /> Data Desejada</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => updateData({ date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-primary" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" /> Turno</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => updateData({ time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-primary"
                    >
                      <option value="">Selecione...</option>
                      <option value="08:00">Manhã (08h às 12h)</option>
                      <option value="13:00">Tarde (13h às 18h)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Dados de Contato</h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Onde faremos o serviço?</p>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={formData.name} onChange={(e) => updateData({ name: e.target.value })} placeholder="Seu Nome" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-primary" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={formData.phone} onChange={(e) => updateData({ phone: e.target.value })} placeholder="WhatsApp" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-primary" />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={formData.address} onChange={(e) => updateData({ address: e.target.value })} placeholder="Endereço Completo" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-primary" />
                  </div>
                  <input value={formData.city} onChange={(e) => updateData({ city: e.target.value })} placeholder="Cidade / Bairro" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-primary" />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Confirmar Pedido</h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Confira se está tudo correto</p>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{SERVICES.find(s => s.id === formData.service)?.icon}</span>
                      <div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Serviço</p>
                        <p className="text-lg font-black text-white uppercase tracking-tight">{SERVICES.find(s => s.id === formData.service)?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Valor Base</p>
                       <p className="text-lg font-black text-primary uppercase tracking-tight">R$ {SERVICES.find(s => s.id === formData.service)?.price}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 text-[11px] font-black uppercase tracking-widest">
                    <div className="space-y-1">
                      <p className="text-muted-foreground opacity-50">Data/Hora</p>
                      <p className="text-white">{formData.date} - {formData.time === "08:00" ? "Manhã" : "Tarde"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground opacity-50">Contato</p>
                      <p className="text-white line-clamp-1">{formData.name}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex gap-4 pt-8 border-t border-white/5">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep} className="flex-1 rounded-2xl h-14 border-white/10 font-bold uppercase tracking-widest">
              <ChevronLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
          )}
          {step < 5 ? (
            <Button 
              disabled={step === 1 && !formData.service}
              onClick={nextStep} 
              className="flex-[2] rounded-2xl h-14 font-black uppercase tracking-widest"
            >
              Continuar <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button 
              disabled={loading}
              onClick={handleFinish} 
              className="flex-[2] rounded-2xl h-14 font-black uppercase tracking-widest shadow-2xl shadow-primary/20"
            >
              {loading ? "Processando..." : "Confirmar Agendamento"}
              <Check className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}