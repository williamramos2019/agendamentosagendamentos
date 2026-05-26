// Conteúdo dos artigos do blog "Dicas Auto Limpeza Pro"
// Cada artigo é estruturado em blocos para permitir cross-linking
// dinâmico para outros posts (ver `inlineLinks`).

import type { LucideIcon } from "lucide-react";
import { Sofa, Bed, Car, HardHat, Sparkles, Baby } from "lucide-react";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  // Frase contendo o token {{slug}} substituído por link para outro post.
  | { type: "linkP"; text: string; slug: string; linkLabel: string };

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string; // ISO
  icon: LucideIcon;
  serviceId?: string;       // serviço sugerido para CTA "agendar agora"
  tags: string[];
  related: string[];        // slugs relacionados
  blocks: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-higienizar-sofa-tecido",
    title: "Como higienizar sofá de tecido sem estragar a estofa",
    metaTitle: "Como higienizar sofá de tecido | Auto Limpeza Pro",
    metaDescription: "Aprenda a higienizar sofá de tecido em casa com dicas profissionais e evite erros comuns que estragam seu estofado.",
    excerpt: "Descubra o método correto para limpar seu sofá sem manchar ou desgastar o tecido.",
    category: "Estofados",
    readMinutes: 3,
    publishedAt: "2025-09-12",
    icon: Sofa,
    serviceId: "sofa",
    tags: ["sofá", "tecido", "limpeza"],
    related: ["impermeabilizacao-vale-a-pena", "acaros-no-colchao-sintomas"],
    blocks: [
      { type: "p", text: "Sofá de tecido acumula gordura, poeira e ácaros que se infiltram nas fibras. A higienização correta elimina alérgenos e devolve a vida ao estofado." },
      { type: "h2", text: "O que NUNCA fazer" },
      { type: "ul", items: [
          "Jogar água em excesso — gera mofo na espuma.",
          "Usar cloro ou água sanitária — descolore o tecido.",
          "Escovas duras — soltam os fios e criam 'pelos'."
        ]
      },
      { type: "h2", text: "Manutenção Semanal" },
      { type: "p", text: "Aspire semanalmente com bocal estreito. Para manchas leves, use pano úmido com sabão neutro e seque logo em seguida." },
      { type: "callout", text: "Nossa extratora profissional suga toda a sujeira profunda e o sofá seca em poucas horas." },
      { type: "linkP", text: "Considere também {{slug}} para manter seu sofá protegido por muito mais tempo.", slug: "impermeabilizacao-vale-a-pena", linkLabel: "impermeabilização de estofados" }
    ],
  },
  {
    slug: "acaros-no-colchao-sintomas",
    title: "Ácaros no colchão: Sinais que você precisa higienizar",
    metaTitle: "Ácaros no colchão: Sinais de alerta | Auto Limpeza Pro",
    metaDescription: "Espirros ao acordar ou coceira na pele? Veja os sinais de ácaros no colchão e como a higienização profissional resolve.",
    excerpt: "Espirros e coceira ao acordar podem ser ácaros. Veja os sinais e a solução.",
    category: "Saúde",
    readMinutes: 3,
    publishedAt: "2025-09-25",
    icon: Bed,
    serviceId: "colchao",
    tags: ["colchão", "ácaros", "saúde"],
    related: ["como-higienizar-sofa-tecido", "limpeza-bebe-conforto"],
    blocks: [
      { type: "p", text: "Um colchão sem limpeza acumula quilos de células mortas e ácaros em poucos anos. Isso afeta diretamente a qualidade do seu sono e sua saúde respiratória." },
      { type: "h2", text: "Sinais de Alerta" },
      { type: "ul", items: [
          "Espirros e nariz entupido ao acordar.",
          "Coceira na pele e olhos lacrimejando.",
          "Cheiro de mofo ou manchas amareladas."
        ]
      },
      { type: "p", text: "Aspiradores comuns não removem os ácaros profundos. Apenas a extração profissional com produtos fungicidas garante um sono limpo." },
      { type: "callout", text: "Especialistas recomendam higienização profissional a cada 6 meses para alérgicos." },
      { type: "linkP", text: "Se tem bebês, veja também a importância da {{slug}}.", slug: "limpeza-bebe-conforto", linkLabel: "limpeza de bebê conforto" }
    ],
  },
  {
    slug: "limpeza-interna-automotiva-vale-a-pena",
    title: "Higienização Automotiva: Por que fazer?",
    metaTitle: "Higienização interna automotiva vale a pena? | Auto Limpeza Pro",
    metaDescription: "Descubra os benefícios da higienização interna profissional e como ela valoriza seu veículo.",
    excerpt: "Entenda o que muda no seu carro após uma higienização profissional completa.",
    category: "Automotivo",
    readMinutes: 2,
    publishedAt: "2025-10-08",
    icon: Car,
    serviceId: "auto-interna",
    tags: ["automotivo", "carro", "limpeza"],
    related: ["limpeza-bebe-conforto", "impermeabilizacao-vale-a-pena"],
    blocks: [
      { type: "p", text: "O interior do carro acumula poeira da rua e bactérias. A higienização remove odores e manchas que limpezas simples de lava-jato não conseguem tirar." },
      { type: "h2", text: "O que é Limpo" },
      { type: "ul", items: [
          "Bancos com extratora (tecido ou couro).",
          "Higienização de teto, tapetes e forrações.",
          "Limpeza técnica de painel e console com proteção UV."
        ]
      },
      { type: "callout", text: "Veículos com interna higienizada são vendidos mais rápido e valorizam o preço de revenda." },
      { type: "linkP", text: "Mantenha os bancos protegidos com a {{slug}}.", slug: "impermeabilizacao-vale-a-pena", linkLabel: "impermeabilização automotiva" }
    ],
  },
  {
    slug: "impermeabilizacao-vale-a-pena",
    title: "Impermeabilização de estofados: Guia Prático",
    metaTitle: "Impermeabilização de estofados: Vale a pena? | Auto Limpeza Pro",
    metaDescription: "Como funciona a impermeabilização de sofás, durabilidade e segurança para sua família.",
    excerpt: "Repele líquidos e evita manchas. Veja como funciona a impermeabilização.",
    category: "Estofados",
    readMinutes: 2,
    publishedAt: "2025-10-20",
    icon: Sparkles,
    serviceId: "impermeabilizacao",
    tags: ["impermeabilização", "proteção", "sofá"],
    related: ["como-higienizar-sofa-tecido", "limpeza-interna-automotiva-vale-a-pena"],
    blocks: [
      { type: "p", text: "A impermeabilização cria uma barreira que impede líquidos de penetrarem no tecido. Se cair café ou suco, basta remover com um papel absorvente." },
      { type: "h2", text: "Duração e Segurança" },
      { type: "ul", items: [
          "Dura de 12 a 18 meses em sofás de uso comum.",
          "Produtos à base de água são 100% seguros para pets e bebês.",
          "Mantém a textura original do tecido."
        ]
      },
      { type: "callout", text: "O melhor momento para impermeabilizar é logo após a higienização profissional." },
      { type: "linkP", text: "Confira como fazemos a {{slug}} antes de aplicar o protetor.", slug: "como-higienizar-sofa-tecido", linkLabel: "higienização de sofá" }
    ],
  },
  {
    slug: "limpeza-pos-obra-checklist",
    title: "Limpeza Pós-obra: O que você precisa saber",
    metaTitle: "Checklist Limpeza Pós-obra Profissional | Auto Limpeza Pro",
    metaDescription: "Saiba o que está incluso na limpeza pós-obra profissional e evite danos à sua reforma.",
    excerpt: "Checklist do que é limpo na pós-obra e por que não fazer sozinho.",
    category: "Pós-obra",
    readMinutes: 3,
    publishedAt: "2025-11-02",
    icon: HardHat,
    serviceId: "pos-obra",
    tags: ["pós-obra", "reforma", "limpeza"],
    related: ["como-higienizar-sofa-tecido", "impermeabilizacao-vale-a-pena"],
    blocks: [
      { type: "p", text: "A poeira de obra é fina e abrasiva. Sem os produtos corretos, você pode riscar porcelanatos e manchar metais novos da sua reforma." },
      { type: "h2", text: "O que incluímos" },
      { type: "ul", items: [
          "Remoção técnica de respingos de tinta e gesso.",
          "Limpeza interna de armários e gavetas.",
          "Lavagem de pisos com neutralizadores de resíduos de cimento."
        ]
      },
      { type: "callout", text: "Entregamos sua casa pronta para morar, sem o pó fino que volta a circular por semanas." },
      { type: "linkP", text: "Após a obra, não esqueça da {{slug}}.", slug: "como-higienizar-sofa-tecido", linkLabel: "limpeza dos estofados" }
    ],
  },
  {
    slug: "limpeza-bebe-conforto",
    title: "Limpeza de Bebê Conforto e Cadeirinhas",
    metaTitle: "Higienização de Bebê Conforto e Carrinhos | Auto Limpeza Pro",
    metaDescription: "Segurança e saúde para seu bebê. Higienização profissional com produtos hipoalergênicos.",
    excerpt: "Leite e suor geram fungos na cadeirinha. Veja como limpar com segurança.",
    category: "Bebês",
    readMinutes: 2,
    publishedAt: "2025-11-15",
    icon: Baby,
    serviceId: "auto-interna",
    tags: ["bebê", "saúde", "cadeirinha"],
    related: ["acaros-no-colchao-sintomas", "limpeza-interna-automotiva-vale-a-pena"],
    blocks: [
      { type: "p", text: "Cadeirinhas acumulam restos de leite e suor, tornando-se focos de bactérias em carros quentes. A pele do bebê é sensível e precisa de cuidado redobrado." },
      { type: "h2", text: "Nosso Diferencial" },
      { type: "ul", items: [
          "Produtos 100% hipoalergênicos e sem cheiro.",
          "Extração profunda sem danificar a estrutura de segurança.",
          "Secagem rápida para uso imediato."
        ]
      },
      { type: "callout", text: "Usamos selos de segurança e produtos certificados para uso infantil." },
      { type: "linkP", text: "Cuidamos também do quarto com a {{slug}}.", slug: "acaros-no-colchao-sintomas", linkLabel: "higienização de colchão" }
    ],
  },
];

export const BLOG_POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
);

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) return [];
  const related = post.related
    .map((s) => BLOG_POSTS_BY_SLUG[s])
    .filter(Boolean) as BlogPost[];
  if (related.length >= limit) return related.slice(0, limit);
  // Completa por tags
  const extras = BLOG_POSTS.filter(
    (p) =>
      p.slug !== slug &&
      !post.related.includes(p.slug) &&
      p.tags.some((t) => post.tags.includes(t)),
  );
  return [...related, ...extras].slice(0, limit);
}
