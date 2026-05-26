import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "cleanpro_visit_session_v1";
const TRACKED_PATHS_KEY = "cleanpro_tracked_paths_v1";

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function detectSource(referrer: string): { category: string; name: string | null } {
  if (!referrer) return { category: "direct", name: null };
  try {
    const url = new URL(referrer);
    const host = url.hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return { category: "internal", name: host };

    const map: Array<[RegExp, string, string]> = [
      [/google\./, "search", "Google"],
      [/bing\./, "search", "Bing"],
      [/duckduckgo\./, "search", "DuckDuckGo"],
      [/yahoo\./, "search", "Yahoo"],
      [/facebook\.|fb\./, "social", "Facebook"],
      [/instagram\./, "social", "Instagram"],
      [/twitter\.|x\.com/, "social", "Twitter/X"],
      [/tiktok\./, "social", "TikTok"],
      [/linkedin\./, "social", "LinkedIn"],
      [/youtube\./, "social", "YouTube"],
      [/whatsapp\.|wa\.me/, "messaging", "WhatsApp"],
      [/t\.me|telegram\./, "messaging", "Telegram"],
    ];
    for (const [rx, cat, name] of map) {
      if (rx.test(host)) return { category: cat, name };
    }
    return { category: "referral", name: host };
  } catch {
    return { category: "direct", name: null };
  }
}

function detectDevice(): { device: string; browser: string } {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
  let browser = "Outro";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";
  return { device, browser };
}

export function useVisitTracking(currentPath: string) {
  useEffect(() => {
    // Não trackear rotas de admin
    if (
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/agenda") ||
      currentPath.startsWith("/caixa") ||
      currentPath.startsWith("/vendas") ||
      currentPath.startsWith("/financas") ||
      currentPath.startsWith("/perfil") ||
      currentPath.startsWith("/analytics")
    ) {
      return;
    }

    // Evita duplicar pageview da mesma path por sessão
    try {
      const tracked: string[] = JSON.parse(sessionStorage.getItem(TRACKED_PATHS_KEY) ?? "[]");
      if (tracked.includes(currentPath)) return;
      tracked.push(currentPath);
      sessionStorage.setItem(TRACKED_PATHS_KEY, JSON.stringify(tracked));
    } catch {
      // ignore
    }

    const sessionId = getOrCreateSessionId();
    const referrer = document.referrer || "";
    const { category, name } = detectSource(referrer);
    const { device, browser } = detectDevice();

    supabase
      .from("site_visits")
      .insert({
        session_id: sessionId,
        path: currentPath,
        referrer: referrer || null,
        source_category: category,
        source_name: name,
        user_agent: navigator.userAgent,
        device_type: device,
        browser,
      })
      .then(({ error }) => {
        if (error) console.warn("Visit tracking failed:", error.message);
      });
  }, [currentPath]);
}
