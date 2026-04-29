import { useState } from "react";
import { ArrowLeft, User, Building2, Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun, Users, CreditCard, FileText, Palette, ChevronLeft } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { MyDataSection } from "@/components/settings/MyDataSection";
import { MySalonSection } from "@/components/settings/MySalonSection";
import { EmployeesSection } from "@/components/settings/EmployeesSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { ReportsSection } from "@/components/settings/ReportsSection";
import { ThemeSection } from "@/components/settings/ThemeSection";

type SectionType = 'main' | 'myData' | 'mySalon' | 'employees' | 'subscription' | 'notifications' | 'security' | 'reports' | 'theme';

interface PerfilPageProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function PerfilPage({ onBack, isDarkMode, onToggleTheme }: PerfilPageProps) {
  const [currentSection, setCurrentSection] = useState<SectionType>('main');
  const settings = useProfileSettings();

  const sections = {
    myData: { title: 'Meus Dados', component: <MyDataSection profile={settings.profile} onUpdate={settings.updateProfile} /> },
    mySalon: { title: 'Minha Empresa', component: <MySalonSection salon={settings.salon} onUpdate={settings.updateSalon} /> },
    employees: { title: 'Funcionários', component: <EmployeesSection employees={settings.employees} onAdd={settings.addEmployee} onUpdate={settings.updateEmployee} onDelete={settings.deleteEmployee} onToggleStatus={settings.toggleEmployeeStatus} /> },
    subscription: { title: 'Assinatura', component: <SubscriptionSection subscription={settings.subscription} paymentHistory={settings.paymentHistory} /> },
    notifications: { title: 'Notificações', component: <NotificationsSection settings={settings.notifications} onUpdate={settings.updateNotifications} /> },
    security: { title: 'Segurança', component: <SecuritySection settings={settings.security} onToggle2FA={settings.toggleTwoFactor} onRemoveDevice={settings.removeDevice} onLogoutAll={settings.logoutAllDevices} /> },
    reports: { title: 'Relatórios', component: <ReportsSection /> },
    theme: { title: 'Tema', component: <ThemeSection isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} primaryColor={settings.primaryColor} onChangePrimaryColor={settings.setPrimaryColor} /> },
  };

  if (currentSection !== 'main') {
    const section = sections[currentSection];
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => setCurrentSection('main')} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="font-bold text-lg text-foreground">{section.title}</h1>
          </div>
        </header>
        <main className="p-4">{section.component}</main>
      </div>
    );
  }

  const menuItems = [
    { id: 'myData' as SectionType, icon: User, label: 'Meus Dados', description: 'Nome, email, telefone' },
    { id: 'mySalon' as SectionType, icon: Building2, label: 'Minha Empresa', description: 'Dados da empresa de higienização' },
    { id: 'employees' as SectionType, icon: Users, label: 'Equipe Técnica', description: 'Técnicos e equipes', badge: settings.employees.length.toString() },
    { id: 'subscription' as SectionType, icon: CreditCard, label: 'Assinatura', description: settings.subscription.planName },
  ];

  const configItems = [
    { id: 'theme' as SectionType, icon: Palette, label: 'Tema', description: isDarkMode ? 'Escuro' : 'Claro' },
    { id: 'notifications' as SectionType, icon: Bell, label: 'Notificações', description: 'Alertas e lembretes' },
    { id: 'security' as SectionType, icon: Shield, label: 'Segurança', description: 'Senha e autenticação' },
    { id: 'reports' as SectionType, icon: FileText, label: 'Relatórios', description: 'Exportar dados' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
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
              <h2 className="font-bold text-lg">{settings.profile.fullName}</h2>
              <p className="text-sm opacity-80">{settings.profile.email}</p>
              <p className="text-xs opacity-60 mt-1">Proprietária • {settings.salon.name}</p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Conta</h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {menuItems.map((item, idx) => (
              <button key={item.id} onClick={() => setCurrentSection(item.id)} className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left ${idx !== menuItems.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><item.icon className="h-5 w-5 text-foreground" /></div>
                <div className="flex-1"><p className="font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.description}</p></div>
                {item.badge && <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">{item.badge}</span>}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Configurações</h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {configItems.map((item, idx) => (
              <button key={item.id} onClick={() => setCurrentSection(item.id)} className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left ${idx !== configItems.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><item.icon className="h-5 w-5 text-foreground" /></div>
                <div className="flex-1"><p className="font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.description}</p></div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-destructive/20 text-destructive hover:bg-destructive/5 transition-all animate-fade-in" style={{ animationDelay: "300ms" }}>
          <LogOut className="h-5 w-5" /><span className="font-semibold">Sair da Conta</span>
        </button>

        <p className="text-center text-xs text-muted-foreground">CleanPro Agenda v1.0.0</p>
      </main>
    </div>
  );
}
