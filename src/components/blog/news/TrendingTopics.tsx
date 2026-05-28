import { TrendingUp } from "lucide-react";

const topics = [
  { tag: "Higienização de Sofás", count: 48, category: "Higienização" },
  { tag: "Vitrificação 9H", count: 32, category: "Estética Automotiva" },
  { tag: "Limpeza de Tapetes", count: 25, category: "Higienização" },
  { tag: "Cuidado Automotivo", count: 19, category: "Dicas" },
  { tag: "Impermeabilização", count: 14, category: "Higienização" },
];

const TrendingTopics = () => {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-xl">
      <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-white">
        <TrendingUp className="h-4 w-4 text-primary" />
        Mais Lidos
      </h3>
      <div className="space-y-3">
        {topics.map((topic, i) => (
          <div
            key={topic.tag}
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-xs cursor-pointer transition-all hover:bg-white/[0.08] border border-transparent hover:border-white/5 group"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-white/30 w-4 group-hover:text-primary transition-colors">{i + 1}</span>
              <span className="font-bold text-white group-hover:text-primary transition-colors tracking-tight">{topic.tag}</span>
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">{topic.count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
