import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sale } from "@/hooks/useAppState";
import { QuickSaleModal } from "@/components/sales/QuickSaleModal";
import { CaixaPage } from "@/pages/CaixaPage";
import { VendasPage } from "@/pages/VendasPage";
import { AgendaPage } from "@/pages/AgendaPage";
import { PerfilPage } from "@/pages/PerfilPage";
import FinancasPage from "@/pages/FinancasPage";
import { SmartHome } from "@/components/home/SmartHome";
import { SmartBookingWizard } from "@/components/booking/SmartBookingWizard";
import { useAppState } from "@/hooks/useAppState";

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);

  const {
    sales,
    addSale,
    cashState,
    currentCashBalance,
    openCash,
    closeCash,
    addCashOperation,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getAppointmentsByDate,
    isDarkMode,
    setIsDarkMode,
  } = useAppState();

  const handleConfirmSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    addSale(saleData);
  };

  const startBooking = (serviceId?: string) => {
    setBookingService(serviceId);
    setBookingOpen(true);
  };

  // ==================== ROUTES ====================

  if (currentPath === "/caixa") {
    return (
      <>
        <CaixaPage 
          onBack={() => setCurrentPath("/")}
          cashState={cashState}
          currentBalance={currentCashBalance}
          onOpenCash={openCash}
          onCloseCash={closeCash}
          onAddOperation={addCashOperation}
        />
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} onNewBooking={() => startBooking()} />
      </>
    );
  }

  if (currentPath === "/vendas") {
    return (
      <>
        <VendasPage 
          onBack={() => setCurrentPath("/")} 
          onNewSale={() => setIsSaleModalOpen(true)}
          sales={sales}
        />
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} onNewBooking={() => startBooking()} />
        <QuickSaleModal 
          isOpen={isSaleModalOpen}
          onClose={() => setIsSaleModalOpen(false)}
          onConfirmSale={handleConfirmSale}
        />
      </>
    );
  }

  if (currentPath === "/agenda") {
    return (
      <>
        <AgendaPage 
          onBack={() => setCurrentPath("/")}
          appointments={appointments}
          onAddAppointment={addAppointment}
          onUpdateStatus={updateAppointmentStatus}
          getAppointmentsByDate={getAppointmentsByDate}
        />
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} onNewBooking={() => startBooking()} />
        {bookingOpen && (
          <SmartBookingWizard
            onClose={() => setBookingOpen(false)}
            onConfirm={(appt) => addAppointment(appt)}
            initialServiceId={bookingService}
          />
        )}
      </>
    );
  }

  if (currentPath === "/perfil") {
    return (
      <>
        <PerfilPage 
          onBack={() => setCurrentPath("/")}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} onNewBooking={() => startBooking()} />
      </>
    );
  }

  if (currentPath === "/financas" || openExpenseModal) {
    return (
      <>
        <FinancasPage 
          onBack={() => {
            setCurrentPath("/");
            setOpenExpenseModal(false);
          }} 
          openExpenseOnMount={openExpenseModal}
        />
        <MobileNav 
          currentPath={currentPath === "/financas" ? "/financas" : "/"} 
          onNavigate={(path) => {
            setOpenExpenseModal(false);
            setCurrentPath(path);
          }}
          onNewBooking={() => startBooking()}
        />
      </>
    );
  }

  // ==================== HOME ====================
  return (
    <>
      <SmartHome
        appointments={appointments}
        onStartBooking={(serviceId) => startBooking(serviceId)}
        onOpenAgenda={() => setCurrentPath("/agenda")}
      />

      <MobileNav
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        onNewBooking={() => startBooking()}
      />

      {bookingOpen && (
        <SmartBookingWizard
          onClose={() => setBookingOpen(false)}
          onConfirm={(appt) => addAppointment(appt)}
          initialServiceId={bookingService}
        />
      )}
    </>
  );
};

export default Index;
