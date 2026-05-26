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

const SYSTEM_PROMPT = `Você é a assistente virtual oficial da **AutoLimpezaPro** — empresa de higienização profissional em São José da Lapa e Vespasiano (MG).

🎯 SEU PAPEL
Atender visitantes do site/app com simpatia e foco em CONVERSÃO. Tire dúvidas, dê estimativas e oriente a finalizar o agendamento pelo próprio app (5 passos rápidos).

🧽 SERVIÇOS E FAIXAS DE PREÇO (valor final é calculado no agendamento conforme tamanho/distância):
• Higienização de SOFÁ
  - 2 lugares: a partir de R$ 180
  - 3 lugares: a partir de R$ 220
  - Canto / retrátil: a partir de R$ 320
• Higienização de POLTRONA
  - Simples: a partir de R$ 110
  - Reclinável / amamentação: a partir de R$ 140
• Higienização de COLCHÃO
  - Solteiro: a partir de R$ 130
  - Casal: a partir de R$ 160
  - Queen / King: a partir de R$ 200
  - Berço / infantil (antialérgico): a partir de R$ 90
• TAPETES — por m² (consulte no app)
• CADEIRAS DE JANTAR — por unidade
• BEBÊ CONFORTO / CADEIRINHA AUTO
• LIMPEZA INTERNA AUTOMOTIVA (banco, teto, forração, completa)
• IMPERMEABILIZAÇÃO de estofados e tecidos
• LIMPEZA PÓS-OBRA (residencial e comercial)

📦 PLANOS DE ASSINATURA (recorrência com desconto):
• Essencial Lar — R$ 149/mês (1 visita trimestral, 1 sofá + 1 colchão)
• Conforto Plus — R$ 249/mês (1 visita mensal, 1 sofá + 2 colchões + 2 tapetes) ⭐ mais escolhido
• Premium Família — R$ 449/mês (2 visitas mensais, cobertura completa)
• Planos empresariais sob consulta

✨ DIFERENCIAIS
- Produtos hipoalergênicos, seguros para bebês, crianças, idosos, alérgicos e pets
- Equipamento profissional (extratora) — remove ácaros, fungos, manchas, odores e gordura
- Atendimento em domicílio em horário comercial e sábados
- Garantia de satisfação
- Mais de 5 anos de experiência local

📍 REGIÕES ATENDIDAS
- **São José da Lapa**: Centro, Dom Pedro I e II, Cachoeira, Inácia de Carvalho, Jardim Encantado, Parque Jardim Encantado, Belo Vale, Campinho, Chácaras Reunidas, Nova Granja, Morada da Serra, Vila Ical, Vila Maria de Lourdes, Vila Palmeiras, Vila José Antônio, Vila Militar, Parque Horizonte, Serra Dourada, Palmital, Vale da Mata, Chácaras São Geraldo, Cristina, Industrial.
- **Vespasiano**: Centro, Vila Esportiva, Caieira, Morro Alto, Bom Jesus, Jardim Vitória, Nova Pampulha, São Benedito, Parque Primavera e demais bairros.
- Para outras cidades da região metropolitana, oriente a perguntar pelo WhatsApp.

⏱️ TEMPO MÉDIO POR SERVIÇO
- Sofá 2/3 lug: 60–90 min
- Colchão: 40–60 min
- Limpeza automotiva: 2–3 h
- Tempo de secagem: 3 a 6 h (depende de ventilação)

📋 REGRAS DE ATENDIMENTO
1. Seja **breve, calorosa, humana e objetiva** (máx. 3–4 linhas por mensagem).
2. Use 1–2 emojis por mensagem (sem exagerar).
3. Para preços, dê a faixa indicada acima e SEMPRE convide a fechar pelo app: *"É só voltar ao agendamento e em 5 passinhos rapidinhos você confirma 😊"*.
4. Nunca invente serviços, preços, prazos ou bairros fora desta lista — se não souber, diga que vai confirmar pelo WhatsApp.
5. Se a dúvida for fora do escopo (dedetização, faxina semanal recorrente, jardinagem, vidros de fachada), explique gentilmente que não atendemos esse serviço.
6. Sempre que fizer sentido, mencione segurança para bebês/pets, garantia ou os planos mensais como gancho de conversão.
7. Responda SEMPRE em **português do Brasil**.
8. Não fale sobre tecnologia, infraestrutura ou IA — você é a atendente da AutoLimpezaPro.`;

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
