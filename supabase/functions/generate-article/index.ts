import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, city, neighborhood } = await req.json();

    const prompt = `Gere um artigo de blog profissional e otimizado para SEO local sobre o tema "${keywords}" focado na cidade de "${city}" e especificamente no bairro "${neighborhood}". 
    O artigo deve ter pelo menos 1200 palavras, com tom de autoridade em higienização profissional.
    Retorne o resultado estritamente no formato JSON abaixo:
    {
      "title": "Título chamativo",
      "slug": "slug-otimizado",
      "excerpt": "Resumo de 2 parágrafos",
      "category": "Categoria do serviço",
      "read_minutes": 8,
      "tags": ["tag1", "tag2"],
      "blocks": [
        {"type": "heading", "content": "Título da Seção"},
        {"type": "text", "content": "Texto parágrafo 1..."},
        {"type": "text", "content": "Texto parágrafo 2..."},
        {"type": "image", "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a", "content": "Legenda da imagem"}
      ],
      "meta_seo": {
        "title": "Meta Title",
        "description": "Meta Description"
      }
    }`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "Você é um especialista em redação SEO para serviços de limpeza profissional." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const article = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});