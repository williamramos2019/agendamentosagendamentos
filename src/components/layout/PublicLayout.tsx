import { MobileNav } from "./MobileNav";
import { SmartBookingWizard } from "@/components/booking/SmartBookingWizard";
import { useBooking } from "@/hooks/useBooking";
import { useAppointments } from "@/hooks/useAppointments";
import { useCustomerLocation } from "@/hooks/useCustomerLocation";
import { sendAdminNotification } from "@/lib/notifications";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingChat } from "@/components/booking/BookingChat";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { isBookingOpen, selectedServiceId, startBooking, closeBooking } = useBooking();
  const { addAppointment } = useAppointments();
  const { location: customerLocation } = useCustomerLocation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleConfirmBooking = async (appt: any) => {
    const result = await addAppointment(appt);
    sendAdminNotification({
      title: "Novo agendamento recebido!",
      body: `${appt.client} • ${appt.services.join(", ")} • ${appt.date} às ${appt.time}`,
      tag: `booking-${Date.now()}`,
    });
    return result;
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 pb-20">
      <BookingChat />
      
      {children}

      <MobileNav 
        currentPath={pathname}
        onNavigate={(path) => navigate(path)}
        onNewBooking={() => startBooking()}
      />

      {isBookingOpen && (
        <SmartBookingWizard
          onClose={closeBooking}
          onConfirm={handleConfirmBooking}
          initialServiceId={selectedServiceId}
          customerLocation={customerLocation}
        />
      )}
    </div>
  );
}
