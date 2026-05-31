import { useState } from "react";
import { useCustomerLocation } from "@/hooks/useCustomerLocation";
import { useVisitTracking } from "@/hooks/useVisitTracking";
import { SplashScreen } from "@/components/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { SmartHome } from "@/components/home/SmartHome";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPath] = useState(window.location.pathname);
  const { location: customerLocation, status: locationStatus } = useCustomerLocation();

  useVisitTracking(currentPath);

  return (
    <PublicLayout>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <SmartHome
        onStartBooking={() => {}} 
        customerLocation={customerLocation}
        locationStatus={locationStatus}
        onOpenAdmin={() => window.location.href = "/admin"}
        onOpenPlans={() => {}}
        onOpenSiteMap={() => {}}
        onNavigate={() => {}}
      />
    </PublicLayout>
  );
}
