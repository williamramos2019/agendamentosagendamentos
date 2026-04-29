import { useState } from "react";
import { Building2, MapPin, Phone, Mail, Clock, Camera, Globe, Calendar, Check, X } from "lucide-react";
import type { SalonInfo } from "@/hooks/useProfileSettings";
import { toast } from "sonner";

interface MySalonSectionProps {
  salon: SalonInfo;
  onUpdate: (updates: Partial<SalonInfo>) => void;
}

export function MySalonSection({ salon, onUpdate }: MySalonSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(salon);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    toast.success("Informações da empresa atualizadas!");
  };

  const handleCancel = () => {
    setFormData(salon);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-primary/20">
            {salon.logoUrl ? (
              <img src={salon.logoUrl} alt="Logo" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <Building2 className="h-12 w-12 text-primary" />
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
          <label className="text-sm text-muted-foreground mb-2 block">Nome da Empresa</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground">{salon.name}</div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">CNPJ (opcional)</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.cnpj || ''}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              placeholder="00.000.000/0001-00"
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground">
              {salon.cnpj || 'Não informado'}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Endereço</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {salon.address}, {salon.city} - {salon.state}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Estado</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Telefone Comercial</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {salon.phone}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">E-mail</label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {salon.email}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Horário de Funcionamento</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              placeholder="Seg-Sáb: 9h às 19h"
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {salon.openingHours}
            </div>
          )}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Visibilidade Pública</p>
              <p className="text-xs text-muted-foreground">Aparecer em buscas online</p>
            </div>
          </div>
          <button
            onClick={() => onUpdate({ isPublic: !salon.isPublic })}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              salon.isPublic ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-all ${
              salon.isPublic ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Agendamento Online</p>
              <p className="text-xs text-muted-foreground">Clientes podem agendar</p>
            </div>
          </div>
          <button
            onClick={() => onUpdate({ onlineBookingEnabled: !salon.onlineBookingEnabled })}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              salon.onlineBookingEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-all ${
              salon.onlineBookingEnabled ? 'left-6' : 'left-1'
            }`} />
          </button>
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
            Editar Informações
          </button>
        )}
      </div>
    </div>
  );
}
