import { ArrowLeft, Shield } from "lucide-react";

interface LegalPageProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 pb-20">
      <header className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/5 safe-top">
        <div className="px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Política de Privacidade
          </h1>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-8 max-w-2xl mx-auto leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Introdução</h2>
          <p>
            A Auto Limpeza Pro valoriza a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações ao utilizar nosso site e serviços de higienização.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente ao solicitar um orçamento ou agendar um serviço, incluindo:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nome completo;</li>
            <li>Número de telefone/WhatsApp;</li>
            <li>Endereço para realização do serviço;</li>
            <li>Localização geográfica (apenas se autorizado por você para facilitar o agendamento).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Uso das Informações</h2>
          <p>
            Suas informações são utilizadas exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Processar seus pedidos e agendamentos;</li>
            <li>Enviar confirmações e lembretes de serviço;</li>
            <li>Melhorar nossa comunicação e qualidade de atendimento;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Proteção de Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração ou destruição. Seus dados não são vendidos a terceiros.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">5. Seus Direitos</h2>
          <p>
            Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento. Para isso, entre em contato conosco através do nosso WhatsApp oficial.
          </p>
        </section>

        <section className="pt-8 border-t border-white/5 text-xs text-muted-foreground text-center">
          Última atualização: Maio de 2026
        </section>
      </main>
    </div>
  );
}
