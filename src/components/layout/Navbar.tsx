import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Serviços", path: "/#servicos" },
    { name: "Blog", path: "/blog" },
    { name: "Sitemap", path: "/sitemap" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-[#090F15]/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
             <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black tracking-tight text-white uppercase">Auto Limpeza Pro</h1>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none">Profissional em minutos</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-white/70"}`}
            >
              {link.name}
            </Link>
          ))}
          <Button size="sm" className="rounded-full px-6 font-bold" asChild>
            <Link to="/agendamento">Agendar Agora</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#090F15] border-b border-white/5 overflow-hidden"
          >
            <div className="px-5 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-black uppercase tracking-tight text-white"
                >
                  {link.name}
                </Link>
              ))}
              <Button className="w-full rounded-2xl py-6 text-lg font-black uppercase" asChild>
                <Link to="/agendamento" onClick={() => setMobileMenuOpen(false)}>Agendar Agora</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}