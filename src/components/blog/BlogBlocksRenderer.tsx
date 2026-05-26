import { CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogCTA } from "./BlogCTA";

export interface BlogBlock {
  type: "p" | "h2" | "h3" | "ul" | "ol" | "callout" | "linkP" | "faq" | "image" | "cta";
  text?: string;
  items?: string[];
  slug?: string;
  linkLabel?: string;
  url?: string;
  alt?: string;
  questions?: { q: string; a: string }[];
}

interface BlogBlocksRendererProps {
  blocks: BlogBlock[];
  onOpenPost?: (slug: string) => void;
  onStartBooking?: (serviceId?: string) => void;
}

export function BlogBlocksRenderer({ blocks, onOpenPost, onStartBooking }: BlogBlocksRendererProps) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} className="text-xl font-extrabold text-foreground mt-8 mb-4 leading-tight">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="text-lg font-bold text-foreground mt-6 mb-3">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={index} className="text-[16px] text-foreground/80 leading-relaxed font-normal">
                {block.text}
              </p>
            );
          case "ul":
          case "ol":
          case "list":
            return (
              <ul key={index} className="space-y-3 my-4">
                {block.items?.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-foreground/80 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <div key={index} className="rounded-2xl border-l-4 border-primary bg-primary/5 p-5 text-[15px] text-foreground/90 leading-relaxed my-6 italic">
                {block.text}
              </div>
            );
          case "faq":
            return (
              <div key={index} className="space-y-4 my-8">
                <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" /> Perguntas Frequentes
                </h2>
                <div className="space-y-3">
                  {block.questions?.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="font-bold text-sm text-foreground mb-1">{item.q}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          case "image":
            return (
              <figure key={index} className="my-8">
                <img src={block.url} alt={block.alt} className="rounded-2xl w-full object-cover border border-border" />
                {block.alt && <figcaption className="text-center text-xs text-muted-foreground mt-2">{block.alt}</figcaption>}
              </figure>
            );
          case "cta":
            return <BlogCTA key={index} onStartBooking={onStartBooking} />;
          case "linkP": {
            const parts = block.text?.split("{{slug}}") || [];
            return (
              <p key={index} className="text-[16px] text-foreground/80 leading-relaxed">
                {parts[0]}
                {block.slug ? (
                  <button
                    onClick={() => onOpenPost?.(block.slug!)}
                    className="text-primary font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all"
                  >
                    {block.linkLabel}
                  </button>
                ) : (
                  <span>{block.linkLabel}</span>
                )}
                {parts[1] ?? ""}
              </p>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
