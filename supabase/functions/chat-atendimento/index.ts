// Edge function: chat de atendimento com GPT-5 via Lovable AI Gateway
// Streaming SSE. Sistema com contexto da AutoLimpezaPro.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
