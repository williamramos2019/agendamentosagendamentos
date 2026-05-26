import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Eye, Image as ImageIcon, Tag, BookOpen, Clock } from "lucide-react";
import { BlogService } from "@/services/BlogService";
import { BlogPost } from "@/core/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlogManagementPageProps {
  onBack: () => void;
}

export function BlogManagementPage({ onBack }: BlogManagementPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await BlogService.getPosts();
      setPosts(data);
    } catch (error) {
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const newPost: Partial<BlogPost> = {
      title: "",
      slug: "",
      content: "",
      category: "Geral",
      tags: [],
      imageUrl: "",
      publishedAt: new Date().toISOString(),
      blocks: []
    };
    setEditingPost(newPost);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    
    const success = await BlogService.deletePost(id);
    if (success) {
      toast.success("Post excluído com sucesso");
      loadPosts();
    } else {
      toast.error("Erro ao excluir post");
    }
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.content) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }

    if (!editingPost.slug) {
      editingPost.slug = editingPost.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    setIsSaving(true);
    try {
      const success = await BlogService.savePost(editingPost);
      if (success) {
        toast.success("Post salvo com sucesso");
        setEditingPost(null);
        loadPosts();
      } else {
        toast.error("Erro ao salvar post");
      }
    } catch (error) {
      toast.error("Erro ao salvar post");
    } finally {
      setIsSaving(false);
    }
  };

  if (editingPost) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-top">
          <div className="px-5 py-4 flex items-center gap-4">
            <button
              onClick={() => setEditingPost(null)}
              className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-black text-foreground uppercase tracking-tight">
                {editingPost.id ? "Editar Post" : "Novo Post"}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar
            </button>
          </div>
        </header>

        <main className="px-5 pt-8 space-y-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Título do Post</label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                placeholder="Ex: Como limpar seu sofá de Suede"
                className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary/50 outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoria</label>
                <select
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border outline-none font-medium"
                >
                  <option value="Geral">Geral</option>
                  <option value="Estofados">Estofados</option>
                  <option value="Automotivo">Automotivo</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Pós-obra">Pós-obra</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Slug (URL)</label>
                <input
                  type="text"
                  value={editingPost.slug}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  placeholder="ex-limpeza-sofa"
                  className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border outline-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">URL da Imagem de Capa</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingPost.imageUrl}
                  onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 h-12 px-4 rounded-xl bg-muted/30 border border-border outline-none text-xs"
                />
                <div className="w-12 h-12 rounded-xl border border-border bg-muted/20 flex items-center justify-center overflow-hidden">
                  {editingPost.imageUrl ? (
                    <img src={editingPost.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={editingPost.tags?.join(", ")}
                onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
                placeholder="limpeza, sofa, dicas"
                className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border outline-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Conteúdo (Markdown/HTML)</label>
              <textarea
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                placeholder="Escreva o conteúdo do seu artigo aqui..."
                className="w-full min-h-[400px] p-4 rounded-xl bg-muted/30 border border-border focus:border-primary/50 outline-none font-mono text-sm resize-y"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-top">
        <div className="px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-foreground uppercase tracking-tight">
              Gerenciar Blog
            </h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Novo Artigo
          </button>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-6">
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse border border-border" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-3">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4 group hover:border-primary/40 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm line-clamp-1">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readMinutes} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="p-2 rounded-lg bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg bg-muted text-foreground hover:bg-destructive hover:text-white transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground text-sm font-medium">Nenhum artigo publicado ainda.</p>
              <button 
                onClick={handleCreate}
                className="mt-4 text-primary text-xs font-bold underline uppercase tracking-widest"
              >
                Criar meu primeiro post
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}