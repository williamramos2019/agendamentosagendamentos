// Edge function: chat de atendimento com GPT-5 via Lovable AI Gateway
// Streaming SSE. Sistema com contexto da AutoLimpezaPro.
// Endpoint público (chat para visitantes) com hardening:
//   - validação rígida do payload (whitelist de roles, limites de tamanho)
//   - rate limit em memória por IP

const ALLOWED_ORIGINS = new Set([
  "https://agendamentosautolimpeza.lovable.app",
  "https://id-preview--64e34022-b8cd-4b9e-ada6-0b7bd2ad28cc.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
]);

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://agendamentosautolimpeza.lovable.app";
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// ---- Rate limit (in-memory, per instance) ----
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15; // 15 reqs/min/IP
const ipHits = new Map<string, number[]>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  ipHits.set(ip, arr);
  return arr.length <= RATE_MAX;
}

// ---- Validation ----
const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 2000;
type ChatMsg = { role: "user" | "assistant"; content: string };
function sanitizeMessages(raw: unknown): ChatMsg[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const out: ChatMsg[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue; // strip system/other
    if (typeof content !== "string") return null;
    const trimmed = content.slice(0, MAX_CONTENT_CHARS);
    if (trimmed.length === 0) continue;
    out.push({ role, content: trimmed });
  }
  if (out.length === 0) return null;
  return out;
}

const SYSTEM_PROMPT = `Você é a assistente virtual da **AutoLimpezaPro** — empresa de higienização em São José da Lapa e Vespasiano (MG).

🎯 SEU PAPEL:
Atender clientes com simpatia, tirar dúvidas sobre serviços, dar estimativas e orientar a finalizar o agendamento pelo próprio app.

🧽 SERVIÇOS QUE OFERECEMOS:
- Higienização de **sofá** (2 lug, 3 lug, canto, retrátil) — a partir de R$ 180
- Higienização de **poltrona** (simples, reclinável, amamentação) — a partir de R$ 110
- Higienização de **colchão** (solteiro, casal, queen, king) — a partir de R$ 130
- Higienização de **colchão infantil / berço** — antialérgico
- Higienização de **tapetes** (por m²)
- Higienização de **cadeiras de jantar** (por unidade)
- Higienização de **bebê conforto / cadeirinha auto**
- **Limpeza interna automotiva** (lavagem completa, banco/teto/forração)
- **Impermeabilização** de estofados e tecidos
- **Limpeza pós-obra** (residencial e comercial)

✨ DIFERENCIAIS:
- Produtos hipoalergênicos e seguros para crianças, pets e alérgicos
- Equipamento profissional (extratora) que remove ácaros, fungos, manchas e odores
- Atendimento na casa do cliente
- Garantia de satisfação

📍 ATENDEMOS: São José da Lapa, Vespasiano e bairros próximos.

📋 REGRAS DE ATENDIMENTO:
1. Seja **breve, calorosa e objetiva** (mensagens curtas, no máx. 3-4 linhas).
2. Use emojis com moderação para humanizar.
3. Se o cliente perguntar preço, dê uma faixa estimada e oriente a usar o agendamento do app para o valor exato (que considera tamanho/distância).
4. Para fechar serviço, oriente: "É só voltar ao agendamento e selecionar o serviço — em 5 passinhos rapidinhos você confirma 😊".
5. NUNCA invente serviços ou preços fora dos listados.
6. Se a dúvida for fora do escopo (ex.: dedetização, faxina semanal recorrente), explique gentilmente que não atendemos esse serviço.
7. Responda sempre em **português do Brasil**.`;

Deno.serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Muitas mensagens. Aguarde um minuto." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => null);
    const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
    if (!messages) {
      return new Response(
        JSON.stringify({ error: "Payload inválido (máx 20 mensagens, 2000 caracteres cada, roles user/assistant)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (upstream.status === 429) {
      return new Response(
        JSON.stringify({ error: "Muitas mensagens em pouco tempo. Tente novamente em instantes." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (upstream.status === 402) {
      return new Response(
        JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!upstream.ok) {
      const t = await upstream.text();
      console.error("AI gateway error:", upstream.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-atendimento error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
