import { MapPin, MessageSquare, Instagram, Facebook, Mail, Phone, Calendar, Clock, ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/config/whatsappTemplate";

export function Footer({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#020817] border-t border-white/5 pt-16 pb-8 px-5">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Branding and CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white leading-none">Auto Limpeza Pro</h3>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">Excelência em Higienização</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Especialistas em higienização técnica de estofados, estética automotiva premium e limpeza pós-obra. Atendemos toda a Região Metropolitana de Belo Horizonte com tecnologia de ponta.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/autolimpezapro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary/20 hover:border-primary/30 transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#25D366]/20 hover:border-[#25D366]/30 transition-all">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Atendimento Rápido</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>SJ Lapa, Vespasiano, Pedro Leopoldo e BH</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Segunda a Sábado: 08:00 – 18:00</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>{COMPANY_INFO.telefone}</span>
              </div>
            </div>
            <a 
              href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de solicitar um orçamento grátis.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4 flex items-center justify-center"
            >
              Solicitar Orçamento Grátis
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Serviços</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><button onClick={() => onNavigate?.('/')} className="hover:text-white transition-colors">Limpeza de Sofá</button></li>
              <li><button onClick={() => onNavigate?.('/')} className="hover:text-white transition-colors">Higienização de Colchão</button></li>
              <li><button onClick={() => onNavigate?.('/')} className="hover:text-white transition-colors">Estética Automotiva</button></li>
              <li><button onClick={() => onNavigate?.('/')} className="hover:text-white transition-colors">Impermeabilização</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Empresa</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><a href="https://blogatolimpezapro.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog & Notícias</a></li>
              <li><button onClick={() => onNavigate?.('/mapa-do-site')} className="hover:text-white transition-colors">Mapa do Site</button></li>
              <li><button onClick={() => onNavigate?.('/faq')} className="hover:text-white transition-colors">Dúvidas Frequentes</button></li>
              <li><button onClick={() => onNavigate?.('/termos-de-uso')} className="hover:text-white transition-colors">Termos de Uso</button></li>
            </ul>
          </div>
          <div className="hidden md:block space-y-4">
            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Cidades</h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li><button onClick={() => onNavigate?.('/mapa-do-site')} className="hover:text-white transition-colors">São José da Lapa</button></li>
              <li><button onClick={() => onNavigate?.('/mapa-do-site')} className="hover:text-white transition-colors">Vespasiano</button></li>
              <li><button onClick={() => onNavigate?.('/mapa-do-site')} className="hover:text-white transition-colors">Pedro Leopoldo</button></li>
              <li><button onClick={() => onNavigate?.('/mapa-do-site')} className="hover:text-white transition-colors">Ribeirão das Neves</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground font-medium text-center md:text-left">
            © {currentYear} Auto Limpeza Pro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate?.('/politica-de-privacidade')} className="text-[10px] text-muted-foreground hover:text-white transition-colors font-medium">Privacidade</button>
            <button onClick={() => onNavigate?.('/termos-de-uso')} className="text-[10px] text-muted-foreground hover:text-white transition-colors font-medium">Termos</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
