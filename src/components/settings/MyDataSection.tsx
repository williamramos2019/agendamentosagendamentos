import { useState } from "react";
import { User, Mail, Phone, Camera, Check, X, Shield } from "lucide-react";
import type { UserProfile } from "@/hooks/useProfileSettings";
import { toast } from "sonner";

interface MyDataSectionProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export function MyDataSection({ profile, onUpdate }: MyDataSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Nome Completo</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground">{profile.fullName}</div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">E-mail</label>
          <div className="relative">
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary pr-12"
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-xl text-foreground flex items-center justify-between">
                <span>{profile.email}</span>
                {profile.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <Shield className="h-3 w-3" /> Verificado
                  </span>
                ) : (
                  <button className="text-xs text-primary font-medium">Verificar</button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Telefone</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground">{profile.phone}</div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">WhatsApp</label>
          <div className="relative">
            {isEditing ? (
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary pr-12"
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-xl text-foreground flex items-center justify-between">
                <span>{profile.whatsapp}</span>
                {profile.isPhoneVerified ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <Shield className="h-3 w-3" /> Verificado
                  </span>
                ) : (
                  <button className="text-xs text-primary font-medium">Verificar</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-medium"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              <Check className="h-4 w-4" /> Salvar
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Editar Dados
          </button>
        )}
      </div>
    </div>
  );
}
