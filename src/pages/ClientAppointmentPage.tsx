import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft, CheckCircle2, XCircle, Clock4, MessageSquare } from "lucide-react";
import { appointmentRepository } from "@/repositories/AppointmentRepository";
import { Appointment } from "@/core/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ClientAppointmentPageProps {
  token: string;
  onBack: () => void;
}

const COMPANY_WHATSAPP = "5531980252882";

export function ClientAppointmentPage({ token, onBack }: ClientAppointmentPageProps) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await appointmentRepository.getByToken(token);
        if (!data) {
          toast.error("Agendamento não encontrado.");
          onBack();
          return;
        }
        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast.error("Erro ao carregar agendamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [token, onBack]);

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Olá! Gostaria de falar sobre meu agendamento (${appointment?.services.join(", ")}) do dia ${appointment?.date} às ${appointment?.time}.`);
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] p-5 safe-top">
        <header className="flex items-center gap-4 mb-8">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-48" />
        </header>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!appointment) return null;

  const getStatusDisplay = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmado", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 };
      case "pending":
        return { label: "Aguardando", color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock4 };
      case "completed":
        return { label: "Concluído", color: "text-primary", bg: "bg-primary/10", icon: CheckCircle2 };
      case "cancelled":
        return { label: "Cancelado", color: "text-red-400", bg: "bg-red-500/10", icon: XCircle };
      default:
        return { label: status, color: "text-white", bg: "bg-white/10", icon: Clock4 };
    }
  };

  const status = getStatusDisplay(appointment.status);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#020817] pb-32 flex flex-col items-center">
      <div className="w-full max-w-2xl px-5 pt-8 safe-top">
        <header className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-black text-white">Meu Agendamento</h1>
        </header>

        <Card className="bg-[#0F172A] border-white/5 rounded-[32px] p-6 mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex items-center justify-between mb-8">
            <div className={`px-4 py-1.5 rounded-full ${status.bg} border border-white/5 flex items-center gap-2`}>
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">#{appointment.id.slice(0, 8)}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cliente</p>
                <p className="text-base font-bold text-white">{appointment.client}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Data</p>
                  <p className="text-base font-bold text-white">{appointment.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Horário</p>
                  <p className="text-base font-bold text-white">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Endereço</p>
                <p className="text-sm font-medium text-white leading-relaxed">{appointment.address || "Endereço não informado"}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Serviços Contratados</p>
              <div className="flex flex-wrap gap-2">
                {appointment.services.map((service, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-white">
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={openWhatsApp}
            className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#1eb956] text-white font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <MessageSquare className="h-5 w-5" />
            Dúvidas? Fale Conosco
          </Button>
          
          <Button 
            variant="outline"
            onClick={onBack}
            className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 active:scale-[0.98] transition-all"
          >
            Voltar para o início
          </Button>
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground font-medium leading-relaxed px-10">
          Precisa cancelar ou reagendar? Por favor, entre em contato via WhatsApp com pelo menos 24h de antecedência.
        </p>
      </div>
    </div>
  );
}