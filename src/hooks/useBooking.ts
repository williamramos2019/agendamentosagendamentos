import { useState, useCallback } from "react";

export function useBooking() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const startBooking = useCallback((serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
    setSelectedServiceId(undefined);
  }, []);

  return {
    isBookingOpen,
    selectedServiceId,
    startBooking,
    closeBooking
  };
}
