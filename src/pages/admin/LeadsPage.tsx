import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Clock, ShieldCheck, Search } from "lucide-react";
import { leadRepository } from "@/repositories/LeadRepository";
import { Lead } from "@/core/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function LeadsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leads = [], isLoading: loading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => leadRepository.getAll(),
  });

  const onBack = () => navigate("/admin");


  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone?.includes(searchTerm) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h1 className="font-bold text-base text-foreground">Gestão de Leads</h1>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">Carregando leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">Nenhum lead encontrado.</div>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{lead.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(lead.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {lead.status === 'new' ? 'Novo' : lead.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition">
                        <Phone className="h-3.5 w-3.5" /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition">
                        <Mail className="h-3.5 w-3.5" /> {lead.email}
                      </a>
                    )}
                  </div>
                  
                  {lead.source && (
                    <div className="text-[10px] text-muted-foreground">
                      Origem: <span className="font-semibold">{lead.source}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
