import { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, ShieldCheck, User, Calendar, History, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/InventoryService";
import { PPEAssignment, InventoryProduct, Collaborator } from "@/core/types";
import { toast } from "sonner";
import { PPEAssignmentModal } from "@/components/inventory/PPEAssignmentModal";
import { useNavigate } from "react-router-dom";

export default function EPIPage() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin");
  const onNavigate = (path: string) => navigate(path);

  const [assignments, setAssignments] = useState<PPEAssignment[]>([]);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAssignments(inventoryService.getAssignments());
    setProducts(inventoryService.getProducts());
    setCollaborators(inventoryService.getCollaborators());
  };

  const handleReturn = (id: string) => {
    try {
      inventoryService.returnPPE(id);
      toast.success("EPI devolvido com sucesso!");
      refreshData();
    } catch (error) {
      toast.error("Erro ao devolver EPI");
    }
  };

  const activeAssignments = assignments.filter(a => a.status === 'active');

  const filteredAssignments = activeAssignments.filter(a => {
    const collaborator = collaborators.find(c => c.id === a.collaboratorId);
    const product = products.find(p => p.id === a.productId);
    const search = searchQuery.toLowerCase();
    
    return (collaborator?.name.toLowerCase().includes(search) || 
            product?.name.toLowerCase().includes(search));
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">Controle de EPI</h1>
            <p className="text-xs text-muted-foreground">{activeAssignments.length} EPIs em uso</p>
          </div>
          <button 
            onClick={() => onNavigate("/historico-estoque")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <History className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <ShieldCheck className="h-5 w-5 text-blue-500 mb-2" />
            <p className="text-2xl font-black text-blue-600">{activeAssignments.length}</p>
            <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Em Uso</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-2" />
            <p className="text-2xl font-black text-emerald-600">
              {products.filter(p => p.category === 'EPI').reduce((acc, p) => acc + p.quantity, 0)}
            </p>
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Disponíveis</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por colaborador ou EPI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Assignments List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Entregas Ativas</h3>
          
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-3xl border border-dashed border-border">
              <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhuma entrega ativa encontrada</p>
            </div>
          ) : (
            filteredAssignments.map(assignment => {
              const collaborator = collaborators.find(c => c.id === assignment.collaboratorId);
              const product = products.find(p => p.id === assignment.productId);
              
              return (
                <div 
                  key={assignment.id}
                  className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{collaborator?.name}</p>
                    <p className="text-sm text-primary font-medium truncate">{product?.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground font-medium uppercase">
                      <Calendar className="h-3 w-3" />
                      {new Date(assignment.assignedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleReturn(assignment.id)}
                    className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center active:scale-95 transition-transform"
                    title="Registrar Devolução"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button 
          onClick={() => setIsAssignmentModalOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <PPEAssignmentModal 
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSuccess={() => {
          refreshData();
          setIsAssignmentModalOpen(false);
        }}
      />
    </div>
  );
}
