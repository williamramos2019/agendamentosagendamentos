import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface LegalPageProps {
  onBack: () => void;
}

export default function TermsOfUse() {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);

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
            <FileText className="h-4 w-4 text-primary" /> Termos de Uso
          </h1>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-8 max-w-2xl mx-auto leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar o site da Auto Limpeza Pro, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Uso de Licença</h2>
          <p>
            É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Auto Limpeza Pro, apenas para visualização transitória pessoal e não comercial.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Agendamentos e Cancelamentos</h2>
          <p>
            Os agendamentos realizados pelo site são pré-reservas. A confirmação final ocorre via WhatsApp. Cancelamentos devem ser informados com pelo menos 24 horas de antecedência.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Isenção de Responsabilidade</h2>
          <p>
            Os materiais no site da Auto Limpeza Pro são fornecidos 'como estão'. Não oferecemos garantias, expressas ou implícitas, e, por este meio, isentamo-nos e negamos todas as outras garantias.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">5. Limitações</h2>
          <p>
            Em nenhum caso a Auto Limpeza Pro ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais no site.
          </p>
        </section>

        <section className="pt-8 border-t border-white/5 text-xs text-muted-foreground text-center">
          Última atualização: Maio de 2026
        </section>
      </main>
    </div>
  );
}
