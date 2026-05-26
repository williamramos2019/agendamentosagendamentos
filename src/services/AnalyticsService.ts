import { supabase } from "@/integrations/supabase/client";

export class AnalyticsService {
  static async trackVisit(path: string) {
    const sessionId = this.getOrCreateSessionId();
    const referrer = document.referrer;
    const userAgent = navigator.userAgent;
    
    // Identifica dispositivo simplificado
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const deviceType = isMobile ? "mobile" : "desktop";

    // Identifica fonte
    let sourceCategory = "direct";
    let sourceName = null;

    if (referrer) {
      if (referrer.includes("google.com")) {
        sourceCategory = "search";
        sourceName = "Google";
      } else if (referrer.includes("facebook.com") || referrer.includes("instagram.com")) {
        sourceCategory = "social";
        sourceName = referrer.includes("facebook") ? "Facebook" : "Instagram";
      } else if (referrer.includes("t.co") || referrer.includes("twitter.com")) {
        sourceCategory = "social";
        sourceName = "Twitter/X";
      } else {
        sourceCategory = "referral";
        sourceName = new URL(referrer).hostname;
      }
    }

    try {
      await supabase.from("site_visits").insert({
        session_id: sessionId,
        path: path,
        referrer: referrer || null,
        source_category: sourceCategory,
        source_name: sourceName,
        user_agent: userAgent,
        device_type: deviceType,
        browser: this.getBrowser(userAgent),
      });
    } catch (error) {
      console.error("Failed to track visit:", error);
    }
  }

  private static getOrCreateSessionId() {
    let sid = sessionStorage.getItem("cleanpro_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("cleanpro_session_id", sid);
    }
    return sid;
  }

  private static getBrowser(ua: string) {
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Other";
  }
}
