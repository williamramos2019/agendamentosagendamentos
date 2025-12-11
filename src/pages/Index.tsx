import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { CashStatus } from "@/components/dashboard/CashStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DailyGoal } from "@/components/dashboard/DailyGoal";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { QuickSaleModal, NewSale } from "@/components/sales/QuickSaleModal";
import { CaixaPage } from "@/pages/CaixaPage";
import { VendasPage } from "@/pages/VendasPage";
import { AgendaPage } from "@/pages/AgendaPage";
import { PerfilPage } from "@/pages/PerfilPage";
import { useAppState } from "@/hooks/useAppState";

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  
  const {
    sales,
    todayRevenue,
    todayServices,
    averageTicket,
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

  const handleConfirmSale = (saleData: NewSale) => {
    addSale(saleData);
  };

  // Render the appropriate page based on currentPath
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
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} />
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
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} />
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
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} />
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
        <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} />
      </>
    );
  }

  // Default: Dashboard
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        salonName="Bella Beauty" 
        userName="Ana" 
        notificationCount={3} 
      />

      <main className="space-y-6 py-4">
        <QuickStats 
          todayRevenue={todayRevenue}
          todayServices={todayServices}
          averageTicket={averageTicket}
          receivables={0}
        />
        
        <CashStatus 
          isOpen={cashState.isOpen}
          openedAt={cashState.openedAt || undefined}
          openingBalance={cashState.openingBalance}
          currentBalance={currentCashBalance}
          onOpenCash={() => openCash(200)}
          onViewDetails={() => setCurrentPath("/caixa")}
        />

        <DailyGoal 
          current={todayRevenue}
          goal={2000}
        />

        <QuickActions 
          onNewSale={() => setIsSaleModalOpen(true)}
          onNewService={() => setIsSaleModalOpen(true)}
          onClients={() => setCurrentPath("/agenda")}
        />

        <RecentTransactions 
          sales={sales}
          onViewAll={() => setCurrentPath("/vendas")}
        />
      </main>

      <FloatingActionButton onClick={() => setIsSaleModalOpen(true)} />

      <MobileNav 
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />

      <QuickSaleModal 
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onConfirmSale={handleConfirmSale}
      />
    </div>
  );
};

export default Index;
