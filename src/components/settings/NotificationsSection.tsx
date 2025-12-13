import { Bell, Mail, MessageSquare, Smartphone, Calendar, CreditCard, FileText, Clock } from "lucide-react";
import type { NotificationSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";

interface NotificationsSectionProps {
  settings: NotificationSettings;
  onUpdate: (updates: Partial<NotificationSettings>) => void;
}

export function NotificationsSection({ settings, onUpdate }: NotificationsSectionProps) {
  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    onUpdate({ [key]: value });
    toast.success("Configuração atualizada");
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-7 rounded-full transition-colors relative ${
        enabled ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-all ${
        enabled ? 'left-6' : 'left-1'
      }`} />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Channels */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Canais de Notificação
        </h3>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">E-mail</p>
                <p className="text-xs text-muted-foreground">Receber por e-mail</p>
              </div>
            </div>
            <Toggle 
              enabled={settings.emailEnabled} 
              onToggle={() => handleToggle('emailEnabled', !settings.emailEnabled)} 
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Receber por WhatsApp</p>
              </div>
            </div>
            <Toggle 
              enabled={settings.whatsappEnabled} 
              onToggle={() => handleToggle('whatsappEnabled', !settings.whatsappEnabled)} 
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Smartphone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Push</p>
                <p className="text-xs text-muted-foreground">Notificações no app</p>
              </div>
            </div>
            <Toggle 
              enabled={settings.pushEnabled} 
              onToggle={() => handleToggle('pushEnabled', !settings.pushEnabled)} 
            />
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Tipos de Alerta
        </h3>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Agendamentos</p>
                <p className="text-xs text-muted-foreground">Novos, alterados, cancelados</p>
              </div>
            </div>
            <Toggle 
              enabled={settings.appointmentAlerts} 
              onToggle={() => handleToggle('appointmentAlerts', !settings.appointmentAlerts)} 
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <CreditCard className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Pagamentos</p>
                <p className="text-xs text-muted-foreground">Recebimentos e vencimentos</p>
              </div>
            </div>
            <Toggle 
              enabled={settings.paymentAlerts} 
              onToggle={() => handleToggle('paymentAlerts', !settings.paymentAlerts)} 
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Relatórios</p>
                <p className="text-xs text-muted-foreground">Resumos semanais e mensais</p>
              </div>
            </div>
            <Toggle 
              enabled={settings.reportAlerts} 
              onToggle={() => handleToggle('reportAlerts', !settings.reportAlerts)} 
            />
          </div>
        </div>
      </div>

      {/* Reminder Timing */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Antecedência de Lembretes
        </h3>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Lembrar com antecedência</p>
              <p className="text-xs text-muted-foreground">Quantas horas antes do compromisso</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 12, 24, 48].map(hours => (
              <button
                key={hours}
                onClick={() => onUpdate({ reminderHoursBefore: hours })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.reminderHoursBefore === hours
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
