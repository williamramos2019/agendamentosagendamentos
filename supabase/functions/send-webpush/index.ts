import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { title, message, target_url } = await req.json();

    // Fetch Webpushr config from site_config
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

    // Call Webpushr API
    const response = await fetch("https://api.webpushr.com/v1/notification/send/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "webpushrKey": webpushrKey,
        "webpushrAuthToken": webpushrAuthToken,
      },
      body: JSON.stringify({
        title,
        message,
        target_url: target_url || "https://autolimpezapro.com.br",
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
