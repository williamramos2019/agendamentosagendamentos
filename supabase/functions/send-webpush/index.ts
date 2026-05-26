import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const ALLOWED_ORIGINS = [
  "https://autolimpezapro.com.br",
  "https://www.autolimpezapro.com.br",
  "https://agendamentosautolimpeza.lovable.app",
];

function buildCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // --- AUTH CHECK ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const authClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );
  const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json().catch(() => ({}));
    const { title, message, target_url } = body ?? {};

    // --- INPUT VALIDATION ---
    if (typeof title !== "string" || title.length < 1 || title.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid title (1-100 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof message !== "string" || message.length < 1 || message.length > 300) {
      return new Response(JSON.stringify({ error: "Invalid message (1-300 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let finalUrl = "https://autolimpezapro.com.br";
    if (target_url) {
      if (typeof target_url !== "string" || !isValidUrl(target_url)) {
        return new Response(JSON.stringify({ error: "Invalid target_url" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const host = new URL(target_url).hostname;
      const allowedHosts = [
        "autolimpezapro.com.br",
        "www.autolimpezapro.com.br",
        "agendamentosautolimpeza.lovable.app",
      ];
      if (!allowedHosts.includes(host)) {
        return new Response(JSON.stringify({ error: "target_url host not allowed" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      finalUrl = target_url;
    }

    const { data: configData, error: configError } = await supabaseClient
      .from("site_config")
      .select("config_key, config_value")
      .in("config_key", ["webpushr_key", "webpushr_auth_token"]);

    if (configError) throw configError;

    const webpushrKey = configData.find((c) => c.config_key === "webpushr_key")?.config_value;
    const webpushrAuthToken = configData.find((c) => c.config_key === "webpushr_auth_token")?.config_value;

    if (!webpushrKey || !webpushrAuthToken || webpushrKey === "YOUR_WEBPUSHR_KEY") {
      console.warn("Webpushr credentials not configured in site_config");
      return new Response(JSON.stringify({ success: false, message: "Webpushr not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const response = await fetch("https://api.webpushr.com/v1/notification/send/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "webpushrKey": webpushrKey,
        "webpushrAuthToken": webpushrAuthToken,
      },
      body: JSON.stringify({ title, message, target_url: finalUrl }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("send-webpush error:", error);
    return new Response(JSON.stringify({ error: "Request failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
