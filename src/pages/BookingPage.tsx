import { PublicLayout } from "@/components/layout/PublicLayout";
import { BookingWizard } from "@/components/booking/BookingWizard";

export default function BookingPage() {
  return (
    <PublicLayout 
      title="Agendamento Online | Auto Limpeza Pro" 
      description="Agende sua higienização profissional em poucos cliques. Escolha o serviço, data e local."
    >
      <section className="pt-40 pb-32">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Reserva Rápida</p>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">Agendar Serviço</h1>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">
              Processo simplificado em 5 etapas para sua comodidade.
            </p>
          </div>

          <BookingWizard />
        </div>
      </section>
    </PublicLayout>
  );
}