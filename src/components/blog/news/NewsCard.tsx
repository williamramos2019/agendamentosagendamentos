import { motion } from "framer-motion";
import { BlogPost } from "@/core/types";
import mascote from "@/assets/mascote-auto-limpeza-pro.png";

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

interface NewsCardProps {
  post: BlogPost;
  index: number;
  onClick: (slug: string) => void;
}

const NewsCard = ({ post, index, onClick }: NewsCardProps) => {
  const timeAgo = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(post.slug)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/5 cursor-pointer transition-all duration-300 hover:bg-white/[0.08] hover:border-primary/20 h-full"
    >
      <div className="aspect-video overflow-hidden relative">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center">
             <div className="text-primary/10 font-black text-2xl uppercase tracking-tighter opacity-10">PRO</div>
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full pl-1.5 pr-3 py-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <img src={mascote} alt="" className="h-4 w-auto" />
          <span className="text-[10px] font-black text-white uppercase tracking-wider">Premium</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`category-tag ${categoryClass[post.category || ""] || "bg-primary/10 text-primary"} text-[9px] font-black uppercase tracking-widest`}>
            {post.category}
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            {timeAgo}
          </span>
        </div>
        <h3 className="text-lg font-black leading-tight mb-3 text-white group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 font-medium leading-relaxed">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/50 font-bold uppercase tracking-widest">
          <span className="text-primary/70">Equipe Pro</span>
          <span>·</span>
          <span>SJ Lapa</span>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;
