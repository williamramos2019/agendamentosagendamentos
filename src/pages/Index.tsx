import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { CashStatus } from "@/components/dashboard/CashStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DailyGoal } from "@/components/dashboard/DailyGoal";
import { Sale } from "@/hooks/useAppState";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { QuickSaleModal } from "@/components/sales/QuickSaleModal";
import { CaixaPage } from "@/pages/CaixaPage";
import { VendasPage } from "@/pages/VendasPage";
import { AgendaPage } from "@/pages/AgendaPage";
import { PerfilPage } from "@/pages/PerfilPage";
import { useAppState } from "@/hooks/useAppState";

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [showOpenCashModal, setShowOpenCashModal] = useState(false);
  const [openingBalanceInput, setOpeningBalanceInput] = useState("");
  
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

  const handleConfirmSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
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
          onOpenCash={() => setShowOpenCashModal(true)}
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

      {/* Open Cash Modal */}
      {showOpenCashModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <h2 className="font-bold text-lg mb-4">Abrir Caixa</h2>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor Inicial</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={openingBalanceInput}
                onChange={(e) => setOpeningBalanceInput(e.target.value.replace(/[^\d,]/g, ''))}
                className="w-full h-14 px-4 rounded-xl bg-muted border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => {
                setShowOpenCashModal(false);
                setOpeningBalanceInput("");
              }}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => {
                const value = parseFloat(openingBalanceInput.replace(',', '.')) || 0;
                openCash(value);
                setShowOpenCashModal(false);
                setOpeningBalanceInput("");
                toast.success("Caixa aberto com sucesso!");
              }}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
