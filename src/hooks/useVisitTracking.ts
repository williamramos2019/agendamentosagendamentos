import { useEffect, useRef } from "react";
import { AnalyticsService } from "@/services/AnalyticsService";

const TRACKED_PATHS_KEY = "cleanpro_tracked_paths_v2";

export function useVisitTracking(currentPath: string) {
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPath.current === currentPath) return;
    lastTrackedPath.current = currentPath;

    // Filter out admin routes from public tracking
    const isAdminRoute = 
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/agenda") ||
      currentPath.startsWith("/caixa") ||
      currentPath.startsWith("/vendas") ||
      currentPath.startsWith("/financas") ||
      currentPath.startsWith("/perfil") ||
      currentPath.startsWith("/analytics");

    if (isAdminRoute) return;

    // Prevent duplicate pageviews in same session
    try {
      const tracked: string[] = JSON.parse(sessionStorage.getItem(TRACKED_PATHS_KEY) ?? "[]");
      if (tracked.includes(currentPath)) return;
      tracked.push(currentPath);
      sessionStorage.setItem(TRACKED_PATHS_KEY, JSON.stringify(tracked));
    } catch {
      // ignore storage errors
    }

    AnalyticsService.trackVisit(currentPath);
  }, [currentPath]);
}
