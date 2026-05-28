import { motion } from "framer-motion";
import { BlogPost } from "@/core/types";

const categoryClass: Record<string, string> = {
  "Higienização": "category-higienizacao",
  "Estética Automotiva": "category-estetica",
  "Dicas": "category-dicas",
  "Empresa": "category-empresa",
  "Clientes": "category-clientes",
  "Promoções": "category-promocoes",
  "Saúde": "category-higienizacao",
  "Tecnologia": "category-estetica",
  "Economia": "category-dicas",
};

interface HeroStoryProps {
  post: BlogPost;
  onClick: (slug: string) => void;
}

const HeroStory = ({ post, onClick }: HeroStoryProps) => {
  const timeAgo = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl"
      onClick={() => onClick(post.slug)}
    >
      <div className="relative h-[350px] sm:h-[400px] md:h-[450px] w-full overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
             <div className="text-primary/20 font-black text-6xl uppercase tracking-tighter opacity-10 rotate-12">Auto Limpeza Pro</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span
            className={`category-tag ${categoryClass[post.category || ""] || "bg-primary/20 text-primary"} mb-4 inline-block font-black uppercase tracking-widest text-[10px]`}
          >
            {post.category}
          </span>
          <h2 className="font-black text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-white mb-4 tracking-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl mb-6 font-medium">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[10px] text-white/60 font-bold uppercase tracking-widest">
            <span className="text-primary">Especialista Auto Limpeza</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default HeroStory;
