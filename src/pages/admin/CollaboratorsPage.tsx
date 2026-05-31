import { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, User, Phone, Mail, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/InventoryService";
import { Collaborator, PPEAssignment, InventoryProduct } from "@/core/types";
import { toast } from "sonner";


interface CollaboratorsPageProps {
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export function CollaboratorsPage({ onBack, onNavigate }: CollaboratorsPageProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [assignments, setAssignments] = useState<PPEAssignment[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCollaborators(inventoryService.getCollaborators());
    setAssignments(inventoryService.getAssignments());
    setProducts(inventoryService.getProducts());
  }, []);

  const filteredCollaborators = collaborators.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">Colaboradores</h1>
            <p className="text-xs text-muted-foreground">{collaborators.length} cadastrados</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredCollaborators.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum colaborador encontrado</p>
            </div>
          ) : (
            filteredCollaborators.map(c => {
              const activeAssignments = assignments.filter(a => a.collaboratorId === c.id && a.status === 'active');
              
              return (
                <div 
                  key={c.id}
                  className="p-4 rounded-2xl bg-card border border-border space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User className="h-7 w-7 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{c.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{c.role}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">{c.department}</p>
                    </div>

                    {!c.isActive && (
                      <span className="bg-muted text-muted-foreground text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                        Inativo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 px-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Phone className="h-3.5 w-3.5" />
                      {c.phone}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium truncate">
                        <Mail className="h-3.5 w-3.5" />
                        {c.email}
                      </div>
                    )}
                  </div>

                  {activeAssignments.length > 0 && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">EPIs em Uso ({activeAssignments.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeAssignments.map(a => {
                          const product = products.find(p => p.id === a.productId);
                          return (
                            <span 
                              key={a.id}
                              className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-md font-bold uppercase"
                            >
                              {product?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button 
          onClick={() => toast.info("Funcionalidade de cadastro disponível em breve")}
          className="h-14 w-14 rounded-full shadow-lg p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
