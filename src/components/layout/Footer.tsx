import { Link } from "react-router-dom";
import { Instagram, Facebook, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#090F15] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                 <ShieldCheck className="w-6 h-6 text-primary" />
               </div>
               <h2 className="text-lg font-black uppercase tracking-tight text-white">Auto Limpeza Pro</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Especialistas em higienização profissional de estofados, tapetes e estética automotiva com atendimento em domicílio.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Serviços</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link to="/agendamento?s=sofa" className="hover:text-primary transition-colors">Higienização de Sofá</Link></li>
              <li><Link to="/agendamento?s=auto" className="hover:text-primary transition-colors">Estética Automotiva</Link></li>
              <li><Link to="/agendamento?s=colchao" className="hover:text-primary transition-colors">Limpeza de Colchão</Link></li>
              <li><Link to="/agendamento?s=tapete" className="hover:text-primary transition-colors">Lavagem de Tapetes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Links Úteis</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog & Dicas</Link></li>
              <li><Link to="/sitemap" className="hover:text-primary transition-colors">Mapa do Site</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Área Restrita</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Atendimento</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li>Segunda a Sábado</li>
              <li>08:00 às 18:00</li>
              <li>São José da Lapa - MG</li>
              <li className="text-primary font-bold">(31) 98025-2882</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
            © {currentYear} Auto Limpeza Pro. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}