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
    metaTitle:
      "Como higienizar sofá de tecido | Dicas profissionais — Auto Limpeza Pro",
    metaDescription:
      "Passo a passo para higienizar sofá de tecido em casa, erros que estragam a estofa e quando vale chamar a higienização profissional em São José da Lapa e Vespasiano.",
    excerpt:
      "Descubra o método correto para limpar seu sofá sem manchar, encharcar ou desgastar o tecido — e quando o aspirador não basta.",
    category: "Estofados",
    readMinutes: 6,
    publishedAt: "2025-09-12",
    icon: Sofa,
    serviceId: "sofa",
    tags: ["sofá", "estofado", "tecido", "ácaros"],
    related: [
      "impermeabilizacao-vale-a-pena",
      "acaros-no-colchao-sintomas",
      "limpeza-bebe-conforto",
    ],
    blocks: [
      {
        type: "p",
        text: "Sofá de tecido acumula muito mais sujeira do que parece — gordura corporal, poeira, pelos de pet, restos de alimentos e ácaros se infiltram entre as fibras todos os dias. Uma higienização correta não só devolve a aparência, mas elimina causas de alergia respiratória.",
      },
      { type: "h2", text: "O que NUNCA fazer no seu sofá" },
      {
        type: "ul",
        items: [
          "Jogar água quente direto no estofado — encharca a espuma e gera mofo.",
          "Usar água sanitária ou cloro: descolore o tecido em minutos.",
          "Esfregar com escova de cerdas duras: solta os fios e cria 'pelos'.",
          "Usar sabão em pó comum: deixa resíduo que atrai mais sujeira em poucos dias.",
        ],
      },
      { type: "h2", text: "Limpeza caseira (manutenção semanal)" },
      {
        type: "p",
        text: "Para a manutenção entre higienizações profissionais, aspire o sofá com bocal estreito 1x por semana, abrindo as dobras e almofadas. Para manchas pontuais, use um pano de microfibra úmido com sabão neutro diluído, sempre fazendo movimentos circulares e secando com pano seco logo em seguida.",
      },
      { type: "h2", text: "Quando a higienização profissional é indispensável" },
      {
        type: "ul",
        items: [
          "Sofá com mais de 6 meses sem limpeza profunda.",
          "Manchas antigas, suor, urina de pet ou refluxo de bebê.",
          "Casa com pessoas alérgicas, crianças ou idosos.",
          "Cheiro persistente mesmo após arejar.",
        ],
      },
      {
        type: "callout",
        text: "Nossa extratora profissional injeta solução biodegradável e suga toda a sujeira de volta — o sofá seca em 4 a 6 horas e fica 100% livre de ácaros.",
      },
      {
        type: "linkP",
        text: "Se você tem bebê em casa, leia também {{slug}} para entender por que a sujeira invisível dos estofados afeta diretamente o sono do seu filho.",
        slug: "acaros-no-colchao-sintomas",
        linkLabel: "como ácaros no colchão causam alergia",
      },
      {
        type: "linkP",
        text: "Depois da higienização, vale considerar {{slug}} para proteger o investimento por meses.",
        slug: "impermeabilizacao-vale-a-pena",
        linkLabel: "impermeabilização de estofados",
      },
    ],
  },
  {
    slug: "acaros-no-colchao-sintomas",
    title: "Ácaros no colchão: 7 sinais de que está na hora de higienizar",
    metaTitle:
      "Ácaros no colchão: 7 sinais de alerta | Auto Limpeza Pro",
    metaDescription:
      "Espirros ao acordar, coceira, manchas amareladas? Veja os 7 sinais de ácaros no colchão e como a higienização profissional resolve em 1 visita.",
    excerpt:
      "Coceira, espirros e cansaço ao acordar podem ser ácaros — descubra os 7 sinais e a solução definitiva.",
    category: "Saúde e Sono",
    readMinutes: 5,
    publishedAt: "2025-09-25",
    icon: Bed,
    serviceId: "colchao",
    tags: ["colchão", "ácaros", "alergia", "saúde"],
    related: [
      "como-higienizar-sofa-tecido",
      "limpeza-bebe-conforto",
      "impermeabilizacao-vale-a-pena",
    ],
    blocks: [
      {
        type: "p",
        text: "Você passa cerca de um terço da vida em cima do colchão. Em apenas 2 anos, um colchão sem higienização acumula até 2 kg de células mortas, ácaros, fungos e bactérias. O resultado: noites mal dormidas e sintomas alérgicos diários.",
      },
      { type: "h2", text: "Os 7 sinais que você não deve ignorar" },
      {
        type: "ul",
        items: [
          "Espirros e nariz entupido logo ao acordar.",
          "Coceira na pele, principalmente nas costas e pernas.",
          "Manchas amareladas ou escuras no tecido.",
          "Cheiro de mofo ou suor mesmo após trocar a roupa de cama.",
          "Tosse seca noturna em crianças.",
          "Olhos vermelhos e lacrimejando pela manhã.",
          "Sensação de não ter descansado mesmo dormindo 8 horas.",
        ],
      },
      { type: "h2", text: "Por que aspirar não resolve" },
      {
        type: "p",
        text: "O aspirador de pó comum só remove a sujeira da superfície. Os ácaros e seus dejetos (a real causa da alergia) ficam alojados a 2-3 cm de profundidade na espuma. Só uma extratora profissional com produto antialérgico atinge essa camada.",
      },
      {
        type: "callout",
        text: "Recomendação médica: higienização profissional do colchão a cada 6 meses para alérgicos, e a cada 12 meses para o restante da família.",
      },
      {
        type: "linkP",
        text: "Se sua casa tem crianças pequenas, complementar a higienização do berço e do {{slug}} é essencial — esses são focos invisíveis de ácaros.",
        slug: "limpeza-bebe-conforto",
        linkLabel: "bebê conforto e cadeirinha",
      },
      {
        type: "linkP",
        text: "Para entender o método e os produtos que usamos, veja também {{slug}}.",
        slug: "como-higienizar-sofa-tecido",
        linkLabel: "como higienizamos sofás passo a passo",
      },
    ],
  },
  {
    slug: "limpeza-interna-automotiva-vale-a-pena",
    title: "Limpeza interna automotiva: vale o investimento?",
    metaTitle:
      "Higienização interna automotiva: vale a pena? | Auto Limpeza Pro",
    metaDescription:
      "Quanto custa, quanto tempo dura e o que está incluso na higienização interna automotiva profissional. Atendemos São José da Lapa e Vespasiano.",
    excerpt:
      "Banco, teto, carpete e painel: entenda o que muda no seu carro depois de uma higienização interna profissional.",
    category: "Automotivo",
    readMinutes: 5,
    publishedAt: "2025-10-08",
    icon: Car,
    serviceId: "auto-interna",
    tags: ["automotivo", "carro", "higienização interna"],
    related: [
      "limpeza-bebe-conforto",
      "impermeabilizacao-vale-a-pena",
      "como-higienizar-sofa-tecido",
    ],
    blocks: [
      {
        type: "p",
        text: "O interior do carro concentra suor, café derramado, migalhas, fumaça, pelos de pet e poeira da rua. Em ambiente fechado e com sol direto, isso vira um verdadeiro caldeirão de bactérias — e o famoso 'cheiro de carro velho'.",
      },
      { type: "h2", text: "O que está incluso em uma higienização profissional" },
      {
        type: "ul",
        items: [
          "Aspiração profunda em todos os vãos, bancos e porta-malas.",
          "Lavagem dos bancos com extratora (tecido ou couro).",
          "Higienização de teto, forração e tapetes.",
          "Limpeza de painel, console, portas e plásticos com hidratação.",
          "Higienização do ar-condicionado (opcional).",
          "Aromatização final.",
        ],
      },
      { type: "h2", text: "Quanto tempo dura o efeito" },
      {
        type: "p",
        text: "Com uso normal, a higienização completa dura de 4 a 8 meses, dependendo da rotina (transporte de crianças, pets, alimentação dentro do carro). Aspirar semanalmente e usar tapetes laváveis prolonga bastante o efeito.",
      },
      {
        type: "callout",
        text: "Bônus: carros higienizados profissionalmente vendem mais rápido e por até 8% acima do preço médio de tabela.",
      },
      {
        type: "linkP",
        text: "Se você transporta crianças, não esqueça do {{slug}} — é onde mais se acumula leite, suco e bactérias.",
        slug: "limpeza-bebe-conforto",
        linkLabel: "bebê conforto e cadeirinha",
      },
      {
        type: "linkP",
        text: "Para os bancos durarem ainda mais, vale aplicar {{slug}} logo após a higienização.",
        slug: "impermeabilizacao-vale-a-pena",
        linkLabel: "impermeabilização nos estofados",
      },
    ],
  },
  {
    slug: "impermeabilizacao-vale-a-pena",
    title: "Impermeabilização de estofados: vale a pena mesmo?",
    metaTitle:
      "Impermeabilização de estofados vale a pena? | Auto Limpeza Pro",
    metaDescription:
      "Como funciona a impermeabilização de sofás e estofados, quanto tempo dura, é tóxico para bebês e pets? Tire todas as dúvidas.",
    excerpt:
      "Repele líquidos, evita manchas e prolonga a vida útil — entenda como, por quanto tempo e se é seguro.",
    category: "Estofados",
    readMinutes: 4,
    publishedAt: "2025-10-20",
    icon: Sparkles,
    serviceId: "impermeabilizacao",
    tags: ["impermeabilização", "sofá", "proteção"],
    related: [
      "como-higienizar-sofa-tecido",
      "limpeza-interna-automotiva-vale-a-pena",
      "acaros-no-colchao-sintomas",
    ],
    blocks: [
      {
        type: "p",
        text: "A impermeabilização cria uma película microscópica em volta de cada fibra do tecido. Quando algo cai (refrigerante, café, xixi de pet), o líquido escorre em forma de gotinhas em vez de penetrar. Você só passa um pano e pronto.",
      },
      { type: "h2", text: "É seguro para bebê e pet?" },
      {
        type: "p",
        text: "Sim. Os produtos profissionais à base de água que utilizamos são atóxicos, hipoalergênicos e liberados para uso em ambientes com crianças, idosos e animais. Após 2-4 horas de secagem, a superfície já pode ser usada normalmente.",
      },
      { type: "h2", text: "Por quanto tempo dura" },
      {
        type: "ul",
        items: [
          "Sofá de uso doméstico: 12 a 18 meses.",
          "Bancos automotivos: 12 meses.",
          "Cadeiras de jantar: até 2 anos.",
          "Após cada higienização profissional, a impermeabilização precisa ser refeita.",
        ],
      },
      {
        type: "callout",
        text: "Dica: impermeabilizar imediatamente após a higienização tem o melhor custo-benefício — o tecido já está limpo e pronto para receber o produto.",
      },
      {
        type: "linkP",
        text: "Antes de impermeabilizar, é essencial fazer a higienização correta — veja {{slug}} para entender por que esse passo não pode ser pulado.",
        slug: "como-higienizar-sofa-tecido",
        linkLabel: "como higienizar sofá de tecido",
      },
      {
        type: "linkP",
        text: "No carro, a impermeabilização também faz parte do pacote — confira em {{slug}}.",
        slug: "limpeza-interna-automotiva-vale-a-pena",
        linkLabel: "higienização interna automotiva",
      },
    ],
  },
  {
    slug: "limpeza-pos-obra-checklist",
    title: "Limpeza pós-obra: checklist completo para uma reforma sem dor de cabeça",
    metaTitle:
      "Limpeza pós-obra: checklist profissional | Auto Limpeza Pro",
    metaDescription:
      "Cimento, tinta, poeira fina e respingos: o checklist completo da limpeza pós-obra profissional em São José da Lapa, Vespasiano e região.",
    excerpt:
      "O que entra (e o que NÃO entra) na limpeza pós-obra profissional, e por que tentar fazer sozinho costuma sair mais caro.",
    category: "Pós-obra",
    readMinutes: 6,
    publishedAt: "2025-11-02",
    icon: HardHat,
    serviceId: "pos-obra",
    tags: ["pós-obra", "reforma", "construção"],
    related: [
      "como-higienizar-sofa-tecido",
      "impermeabilizacao-vale-a-pena",
      "limpeza-interna-automotiva-vale-a-pena",
    ],
    blocks: [
      {
        type: "p",
        text: "Reforma terminada não significa casa pronta para morar. A poeira de cimento se infiltra em tudo: tomadas, dobradiças, frestas de janela, dentro do guarda-roupa. Sem limpeza pós-obra correta, essa poeira volta a circular por meses.",
      },
      { type: "h2", text: "O que está incluso na limpeza pós-obra" },
      {
        type: "ul",
        items: [
          "Remoção de respingos de tinta, cimento, rejunte e gesso.",
          "Lavagem de pisos, azulejos e rejuntes (com produto específico).",
          "Limpeza de vidros, esquadrias e box.",
          "Aspiração e limpeza de tomadas, interruptores e dobradiças.",
          "Limpeza interna de armários, gavetas e prateleiras.",
          "Remoção de adesivos protetores em metais e cubas.",
        ],
      },
      { type: "h2", text: "O que NÃO está incluso (importante)" },
      {
        type: "ul",
        items: [
          "Retirada de entulho pesado (saco de cimento, restos de tijolo).",
          "Pintura de retoque ou consertos de obra.",
          "Limpeza de fachadas externas em altura.",
        ],
      },
      {
        type: "callout",
        text: "Após a entrega, recomendamos esperar 7 dias e fazer uma higienização leve dos estofados que ficaram cobertos — a poeira fina sempre se infiltra.",
      },
      {
        type: "linkP",
        text: "Se sua reforma incluiu trocar ou reposicionar o sofá, é o momento perfeito para uma {{slug}} antes de voltar a usá-lo.",
        slug: "como-higienizar-sofa-tecido",
        linkLabel: "higienização completa do estofado",
      },
      {
        type: "linkP",
        text: "Para mantê-lo limpo por mais tempo no ambiente recém-reformado, veja se vale {{slug}}.",
        slug: "impermeabilizacao-vale-a-pena",
        linkLabel: "impermeabilizar os estofados",
      },
    ],
  },
  {
    slug: "limpeza-bebe-conforto",
    title: "Bebê conforto e cadeirinha: por que a higienização profissional importa",
    metaTitle:
      "Higienização de bebê conforto e cadeirinha | Auto Limpeza Pro",
    metaDescription:
      "Como higienizar bebê conforto, cadeirinha e carrinho de bebê com segurança. Produtos hipoalergênicos certificados em São José da Lapa e Vespasiano.",
    excerpt:
      "Leite, regurgitação, suor e suco transformam a cadeirinha em foco de fungos. Veja como higienizar com 100% de segurança.",
    category: "Bebês",
    readMinutes: 5,
    publishedAt: "2025-11-15",
    icon: Baby,
    serviceId: "auto-interna",
    tags: ["bebê", "cadeirinha", "automotivo", "saúde"],
    related: [
      "acaros-no-colchao-sintomas",
      "limpeza-interna-automotiva-vale-a-pena",
      "como-higienizar-sofa-tecido",
    ],
    blocks: [
      {
        type: "p",
        text: "A pele do bebê é até 5 vezes mais sensível que a do adulto. Bebê conforto e cadeirinha acumulam restos de leite, suor, regurgitação, urina e poeira — e ficam horas em ambiente fechado e quente dentro do carro. O resultado é o paraíso de fungos e bactérias.",
      },
      { type: "h2", text: "O que evitar nessa higienização" },
      {
        type: "ul",
        items: [
          "Produtos com cloro, amônia ou fragrâncias fortes.",
          "Lava-jato em alta pressão (deforma a estrutura interna de proteção).",
          "Secadora de roupa (compromete os cintos de segurança).",
          "Imersão total — pode degradar componentes plásticos.",
        ],
      },
      { type: "h2", text: "Como fazemos no profissional" },
      {
        type: "p",
        text: "Removemos o forro com cuidado (quando possível), aplicamos solução enzimática hipoalergênica, fazemos extração com aspiração profunda e remontamos respeitando o manual de cada modelo. Tudo seca em ambiente controlado e volta pronto para uso em até 24h.",
      },
      {
        type: "callout",
        text: "Selo de segurança: usamos somente produtos com certificação para uso infantil — sem parabenos, sem corantes e sem cheiro residual.",
      },
      {
        type: "linkP",
        text: "Se já desconfia que seu bebê tem alergia recorrente, vale ler {{slug}} — o problema raramente está só no quarto.",
        slug: "acaros-no-colchao-sintomas",
        linkLabel: "sinais de ácaros no colchão",
      },
      {
        type: "linkP",
        text: "Aproveite e faça também uma {{slug}} junto — fica mais barato no combo.",
        slug: "limpeza-interna-automotiva-vale-a-pena",
        linkLabel: "higienização interna do carro",
      },
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
