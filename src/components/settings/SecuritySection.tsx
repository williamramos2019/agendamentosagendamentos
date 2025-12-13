import { useState } from "react";
import { Shield, Key, Smartphone, History, LogOut, Eye, EyeOff, Check, X, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { SecuritySettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";

interface SecuritySectionProps {
  settings: SecuritySettings;
  onToggle2FA: () => void;
  onRemoveDevice: (id: string) => void;
  onLogoutAll: () => void;
}

export function SecuritySection({ settings, onToggle2FA, onRemoveDevice, onLogoutAll }: SecuritySectionProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    // Here would go the actual password change logic
    toast.success("Senha alterada com sucesso!");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoutAll = () => {
    onLogoutAll();
    setShowLogoutConfirm(false);
    toast.success("Todos os outros dispositivos foram desconectados");
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
      {/* Password */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Senha</p>
            <p className="text-xs text-muted-foreground">
              Última alteração: {format(new Date(settings.lastPasswordChange), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-colors"
        >
          Alterar Senha
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${settings.twoFactorEnabled ? 'bg-emerald-500/10' : 'bg-muted'}`}>
              <Shield className={`h-5 w-5 ${settings.twoFactorEnabled ? 'text-emerald-500' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-medium text-foreground">Autenticação em Dois Fatores</p>
              <p className="text-xs text-muted-foreground">
                {settings.twoFactorEnabled ? 'Ativado' : 'Desativado'} • Mais segurança
              </p>
            </div>
          </div>
          <Toggle enabled={settings.twoFactorEnabled} onToggle={onToggle2FA} />
        </div>
      </div>

      {/* Connected Devices */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Dispositivos Conectados
        </h3>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {settings.connectedDevices.map(device => (
            <div key={device.id} className="flex items-center gap-3 p-4">
              <div className="p-2 bg-muted rounded-xl">
                <Smartphone className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{device.name}</p>
                  {device.isCurrent && (
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">
                      Este dispositivo
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Último acesso: {format(new Date(device.lastAccess), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              {!device.isCurrent && (
                <button
                  onClick={() => onRemoveDevice(device.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Access History */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Histórico de Acessos
        </h3>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {settings.accessHistory.slice(0, 5).map(access => (
            <div key={access.id} className="flex items-center gap-3 p-4">
              <div className="p-2 bg-muted rounded-xl">
                <History className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{access.device}</p>
                <p className="text-xs text-muted-foreground">{access.location}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(access.date), "dd/MM HH:mm", { locale: ptBR })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Logout All */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-semibold">Sair de Todos os Dispositivos</span>
      </button>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Alterar Senha</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm text-muted-foreground mb-2 block">Senha Atual</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-4 pr-12 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-4 top-10 text-muted-foreground"
                >
                  {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nova Senha</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Confirmar Nova Senha</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              Alterar Senha
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sair de Todos os Dispositivos</h3>
                <p className="text-sm text-muted-foreground">
                  Você será desconectado de todos os outros dispositivos
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutAll}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
