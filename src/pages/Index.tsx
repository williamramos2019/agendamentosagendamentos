import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { CashStatus } from "@/components/dashboard/CashStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DailyGoal } from "@/components/dashboard/DailyGoal";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { QuickSaleModal } from "@/components/sales/QuickSaleModal";

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isCashOpen, setIsCashOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        salonName="Bella Beauty" 
        userName="Ana" 
        notificationCount={3} 
      />

      <main className="space-y-6 py-4">
        <QuickStats />
        
        <CashStatus 
          isOpen={isCashOpen}
          openedAt="08:30"
          openingBalance={200}
          currentBalance={1450}
          onOpenCash={() => setIsCashOpen(true)}
        />

        <DailyGoal 
          current={1250}
          goal={2000}
        />

        <QuickActions 
          onNewSale={() => setIsSaleModalOpen(true)}
        />

        <RecentTransactions />
      </main>

      <FloatingActionButton onClick={() => setIsSaleModalOpen(true)} />

      <MobileNav 
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />

      <QuickSaleModal 
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />
    </div>
  );
};

export default Index;
