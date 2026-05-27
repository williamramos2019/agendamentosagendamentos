import { getApiUrl } from "@/config/api";

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
        try {
          sourceName = new URL(referrer).hostname;
        } catch {
          sourceName = "unknown";
        }
      }
    }

    try {
      fetch(getApiUrl('track_visit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          path: path,
          referrer: referrer || null,
          source_category: sourceCategory,
          source_name: sourceName,
          user_agent: userAgent,
          device_type: deviceType,
          browser: this.getBrowser(userAgent),
        })
      }).catch(err => console.error("Tracking API failed:", err));
    } catch (error) {
      console.error("Failed to track visit:", error);
    }
  }

  static async trackEvent(eventName: string, eventData: any = {}) {
    const sessionId = this.getOrCreateSessionId();
    try {
      fetch(getApiUrl('track_event'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          event_name: eventName,
          event_data: eventData
        })
      }).catch(err => console.error("Event Tracking API failed:", err));
    } catch (error) {
      console.error("Failed to track event:", error);
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
