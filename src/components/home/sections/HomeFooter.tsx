interface HomeFooterProps {
  onOpenSiteMap?: () => void;
  onOpenAdmin?: () => void;
}

export function HomeFooter({ onOpenSiteMap, onOpenAdmin }: HomeFooterProps) {
  return (
    <footer className="px-5 py-12 text-center space-y-8">
      <div className="space-y-2">
        <button onClick={onOpenSiteMap} className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:opacity-80 transition-opacity">
          Mapa do site

        </button>
        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Serviços, cidades e bairros atendidos</p>
      </div>
      <button 
        onClick={onOpenAdmin}
        className="px-6 py-2 rounded-full border border-white/10 text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:bg-white/5 transition-colors"
      >
        área restrita
      </button>
    </footer>
  );
}
