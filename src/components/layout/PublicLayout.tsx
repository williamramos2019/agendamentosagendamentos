import React from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFAB } from "./WhatsAppFAB";

interface PublicLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
}

export function PublicLayout({ 
  children, 
  title = "Auto Limpeza Pro | Higienização Profissional de Estofados", 
  description = "A melhor higienização profissional de estofados, automóveis e pós-obra em São José da Lapa e Vespasiano.",
  canonical = "https://agendamentosautolimpeza.lovable.app/"
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#090F15] text-white selection:bg-primary selection:text-white overflow-x-hidden font-sans">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta name="theme-color" content="#090F15" />
      </Helmet>
      
      <Navbar />
      
      <main className="relative">
        {children}
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}