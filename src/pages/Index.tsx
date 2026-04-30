import { useState } from "react";
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
import { AdminLogin, isAdminAuthenticated } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { SubscriptionPlans } from "@/components/plans/SubscriptionPlans";
import { useAppState } from "@/hooks/useAppState";
import { useCustomerLocation } from "@/hooks/useCustomerLocation";

const ADMIN_ROUTES = new Set(["/admin", "/agenda", "/caixa", "/vendas", "/perfil", "/financas"]);

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminAuthenticated());
  const [plansOpen, setPlansOpen] = useState(false);
  const [plansInitialId, setPlansInitialId] = useState<string | undefined>(undefined);
  const { location: customerLocation, status: locationStatus } = useCustomerLocation();

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

  const requestAdmin = () => {
    if (isAdminAuthenticated()) {
      setIsAdmin(true);
      setCurrentPath("/admin");
    } else {
      setShowAdminLogin(true);
    }
  };

  const goToAdminRoute = (path: string) => {
    if (!isAdmin && ADMIN_ROUTES.has(path)) {
      setShowAdminLogin(true);
      return;
    }
    setCurrentPath(path);
  };

  // Gate: redirect protected paths to login if not admin
  if (ADMIN_ROUTES.has(currentPath) && !isAdmin) {
    return (
      <AdminLogin
        onBack={() => {
          setCurrentPath("/");
          setShowAdminLogin(false);
        }}
        onSuccess={() => {
          setIsAdmin(true);
          setShowAdminLogin(false);
        }}
      />
    );
  }

  // ==================== ADMIN PANEL ====================
  if (currentPath === "/admin") {
    const today = new Date().toISOString().split("T")[0];
    const todaySalesCount = sales.filter((s) => {
      const d = new Date(s.createdAt).toISOString().split("T")[0];
      return d === today;
    }).length;
    const pending = appointments.filter((a) => a.status === "pending").length;

    return (
      <AdminPanel
        onBack={() => setCurrentPath("/")}
        onNavigate={goToAdminRoute}
        onLogout={() => {
          setIsAdmin(false);
          setCurrentPath("/");
        }}
        stats={{
          totalAppointments: appointments.length,
          pendingAppointments: pending,
          todaySales: todaySalesCount,
        }}
      />
    );
  }

  // ==================== ADMIN-ONLY ROUTES ====================

  if (currentPath === "/caixa") {
    return (
      <CaixaPage
        onBack={() => setCurrentPath("/admin")}
        cashState={cashState}
        currentBalance={currentCashBalance}
        onOpenCash={openCash}
        onCloseCash={closeCash}
        onAddOperation={addCashOperation}
      />
    );
  }

  if (currentPath === "/vendas") {
    return (
      <>
        <VendasPage
          onBack={() => setCurrentPath("/admin")}
          onNewSale={() => setIsSaleModalOpen(true)}
          sales={sales}
        />
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
      <AgendaPage
        onBack={() => setCurrentPath("/admin")}
        appointments={appointments}
        onAddAppointment={addAppointment}
        onUpdateStatus={updateAppointmentStatus}
        getAppointmentsByDate={getAppointmentsByDate}
      />
    );
  }

  if (currentPath === "/perfil") {
    return (
      <PerfilPage
        onBack={() => setCurrentPath("/admin")}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  if (currentPath === "/financas" || openExpenseModal) {
    return (
      <FinancasPage
        onBack={() => {
          setCurrentPath("/admin");
          setOpenExpenseModal(false);
        }}
        openExpenseOnMount={openExpenseModal}
      />
    );
  }

  // Tela de Planos (cliente)
  if (plansOpen) {
    return (
      <SubscriptionPlans
        onBack={() => {
          setPlansOpen(false);
          setPlansInitialId(undefined);
        }}
        initialPlanId={plansInitialId}
      />
    );
  }

  // ==================== HOME (cliente) ====================
  return (
    <>
      <SmartHome
        onStartBooking={(serviceId) => startBooking(serviceId)}
        customerLocation={customerLocation}
        locationStatus={locationStatus}
        onOpenAdmin={requestAdmin}
        onOpenPlans={() => setPlansOpen(true)}
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
          customerLocation={customerLocation}
        />
      )}

      {showAdminLogin && (
        <AdminLogin
          onBack={() => setShowAdminLogin(false)}
          onSuccess={() => {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setCurrentPath("/admin");
          }}
        />
      )}
    </>
  );
};

export default Index;
