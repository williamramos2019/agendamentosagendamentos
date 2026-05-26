import { useState, useEffect } from "react";
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
import { SiteMapPage } from "@/pages/SiteMapPage";
import { BlogListPage } from "@/pages/BlogListPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { useAppState } from "@/hooks/useAppState";
import { useCustomerLocation } from "@/hooks/useCustomerLocation";
import { useVisitTracking } from "@/hooks/useVisitTracking";
import { sendAdminNotification } from "@/lib/notifications";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { LeadsPage } from "@/pages/LeadsPage";
import { BlogManagementPage } from "@/pages/admin/BlogManagementPage";
import { NeighborhoodPage } from "@/pages/NeighborhoodPage";
import { ClientAppointmentPage } from "@/pages/ClientAppointmentPage";
import { ReminderService } from "@/services/ReminderService";

const ADMIN_ROUTES = new Set(["/admin", "/agenda", "/caixa", "/vendas", "/perfil", "/financas", "/analytics", "/leads", "/admin/blog"]);
const PUBLIC_PROTECTED_ROUTES = new Set(["/meu-agendamento"]);

const Index = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminAuthenticated());
  const [plansOpen, setPlansOpen] = useState(false);
  const [plansInitialId, setPlansInitialId] = useState<string | undefined>(undefined);
  const { location: customerLocation, status: locationStatus } = useCustomerLocation();
  
  // Handle token in URL for direct access to appointment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const action = urlParams.get('action');

    // Handle both ?token=... and ?action=appointment/view&token=...
    if (token || (action === 'appointment/view' && token)) {
      setCurrentPath("/meu-agendamento");
    }

    // Listen for back/forward navigation
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useVisitTracking(currentPath);

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

  const goToRoute = (path: string) => {
    if (!isAdmin && ADMIN_ROUTES.has(path)) {
      setShowAdminLogin(true);
      return;
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const goToAdminRoute = (path: string) => {
    goToRoute(path);
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

  if (currentPath === "/analytics") {
    return <AnalyticsPanel onBack={() => setCurrentPath("/admin")} />;
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

  if (currentPath === "/leads") {
    return <LeadsPage onBack={() => setCurrentPath("/admin")} />;
  }

  if (currentPath === "/admin/blog") {
    return <BlogManagementPage onBack={() => setCurrentPath("/admin")} />;
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

  if (currentPath === "/meu-agendamento") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      return (
        <ClientAppointmentPage 
          token={token} 
          onBack={() => {
            // Remove token from URL and go home
            window.history.pushState({}, '', '/');
            setCurrentPath("/");
          }} 
        />
      );
    }
  }

  // Blog — lista de artigos
  if (currentPath === "/dicas" || currentPath === "/blog") {
    return (
      <BlogListPage
        onBack={() => setCurrentPath("/")}
        onOpenPost={(slug) => setCurrentPath(`/blog/${slug}`)}
      />
    );
  }

  // Blog — artigo individual (cross-linking)
  if (currentPath.startsWith("/dicas/") || currentPath.startsWith("/blog/")) {
    const isBlog = currentPath.startsWith("/blog/");
    const slug = isBlog ? currentPath.slice("/blog/".length) : currentPath.slice("/dicas/".length);
    
    return (
      <BlogPostPage
        slug={slug}
        onBack={() => goToRoute("/blog")}
        onOpenPost={(s) => goToRoute(`/blog/${s}`)}
        onStartBooking={(serviceId) => {
          goToRoute("/");
          startBooking(serviceId);
        }}
      />
    );
  }

  // SEO — Páginas de Bairro
  if (currentPath.startsWith("/bairro/")) {
    const parts = currentPath.split("/");
    const citySlug = parts[2];
    const neighborhoodSlug = parts[3];
    
    return (
      <NeighborhoodPage
        citySlug={citySlug}
        neighborhoodSlug={neighborhoodSlug}
        onBack={() => goToRoute("/mapa-do-site")}
        onStartBooking={startBooking}
        onNavigate={goToRoute}
      />
    );
  }

  // Mapa do site (SEO)
  if (currentPath === "/mapa-do-site") {
    return (
      <SiteMapPage
        onBack={() => goToRoute("/")}
        onStartBooking={(serviceId) => {
          goToRoute("/");
          startBooking(serviceId);
        }}
        onNavigate={goToRoute}
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
        onOpenSiteMap={() => goToRoute("/mapa-do-site")}
      />

      <MobileNav
        currentPath={currentPath}
        onNavigate={goToRoute}
        onNewBooking={() => startBooking()}
      />

      {bookingOpen && (
        <SmartBookingWizard
          onClose={() => setBookingOpen(false)}
          onConfirm={async (appt) => {
            const result = await addAppointment(appt);
            sendAdminNotification({
              title: "Novo agendamento recebido!",
              body: `${appt.client} • ${appt.services.join(", ")} • ${appt.date} às ${appt.time}`,
              tag: `booking-${Date.now()}`,
            });
            return result;
          }}
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
