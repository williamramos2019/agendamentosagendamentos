import React from "react";

interface Block {
  type: string;
  content: string;
  url?: string;
  level?: number;
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-12 mb-6">
                {block.content}
              </h2>
            );
          case "text":
            return (
              <p key={i} className="text-lg text-white/70 leading-relaxed font-medium">
                {block.content}
              </p>
            );
          case "image":
            return (
              <figure key={i} className="my-10 space-y-3">
                <img src={block.url} alt={block.content} className="w-full rounded-[2rem] border border-white/10 shadow-2xl" />
                {block.content && <figcaption className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">{block.content}</figcaption>}
              </figure>
            );
          case "video":
            return (
              <div key={i} className="aspect-video w-full rounded-[2rem] overflow-hidden border border-white/10 my-10 shadow-2xl">
                <iframe 
                  className="w-full h-full"
                  src={block.url?.replace("watch?v=", "embed/")} 
                  title="Video block"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}