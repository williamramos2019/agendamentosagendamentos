import { useState } from "react";
import { ArrowLeft, User, Building2, Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun, Smartphone, Users, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  badge?: string;
}

interface PerfilPageProps {
  onBack: () => void;
}

export function PerfilPage({ onBack }: PerfilPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const accountItems: MenuItem[] = [
    { icon: User, label: "Meus Dados", description: "Nome, email, telefone" },
    { icon: Building2, label: "Meu Salão", description: "Informações do estabelecimento" },
    { icon: Users, label: "Funcionários", description: "Gerenciar equipe", badge: "3" },
    { icon: CreditCard, label: "Assinatura", description: "Plano Pro ativo" },
  ];

  const settingsItems: MenuItem[] = [
    { icon: Bell, label: "Notificações", description: "Alertas e lembretes" },
    { icon: Shield, label: "Segurança", description: "Senha e autenticação" },
    { icon: FileText, label: "Relatórios", description: "Exportar dados" },
  ];

  const supportItems: MenuItem[] = [
    { icon: HelpCircle, label: "Ajuda", description: "FAQ e suporte" },
    { icon: Smartphone, label: "Sobre o App", description: "Versão 1.0.0" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-lg text-foreground">Perfil</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="gradient-primary rounded-2xl p-5 shadow-salon animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-primary-foreground">
              <h2 className="font-bold text-lg">Ana Paula</h2>
              <p className="text-sm opacity-80">ana@bellabeauty.com</p>
              <p className="text-xs opacity-60 mt-1">Proprietária • Bella Beauty</p>
            </div>
            <Button variant="secondary" size="sm">
              Editar
            </Button>
          </div>
        </div>

        {/* Account Section */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Conta
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {accountItems.map((item, idx) => (
              <MenuItemRow key={item.label} item={item} isLast={idx === accountItems.length - 1} />
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Moon className="h-5 w-5 text-foreground" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-warning" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">Tema</p>
                  <p className="text-xs text-muted-foreground">{isDarkMode ? "Escuro" : "Claro"}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  "w-14 h-8 rounded-full transition-all duration-200 relative",
                  isDarkMode ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-6 h-6 rounded-full bg-card shadow-md transition-all duration-200",
                    isDarkMode ? "left-7" : "left-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Configurações
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {settingsItems.map((item, idx) => (
              <MenuItemRow key={item.label} item={item} isLast={idx === settingsItems.length - 1} />
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Suporte
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {supportItems.map((item, idx) => (
              <MenuItemRow key={item.label} item={item} isLast={idx === supportItems.length - 1} />
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-destructive/20 text-destructive hover:bg-destructive/5 transition-all">
            <LogOut className="h-5 w-5" />
            <span className="font-semibold">Sair da Conta</span>
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "350ms" }}>
          RA Financeiro v1.0.0
        </p>
      </main>
    </div>
  );
}

function MenuItemRow({ item, isLast }: { item: MenuItem; isLast: boolean }) {
  const Icon = item.icon;
  
  return (
    <button
      onClick={item.onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
        !isLast && "border-b border-border"
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{item.label}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
      {item.badge && (
        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {item.badge}
        </span>
      )}
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
