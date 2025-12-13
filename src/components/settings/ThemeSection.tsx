import { Sun, Moon, Palette, Check } from "lucide-react";
import { toast } from "sonner";

interface ThemeSectionProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  primaryColor: string;
  onChangePrimaryColor: (color: string) => void;
}

const colorOptions = [
  { name: 'Rosa', value: '#f43f5e' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Amarelo', value: '#eab308' },
];

export function ThemeSection({ isDarkMode, onToggleTheme, primaryColor, onChangePrimaryColor }: ThemeSectionProps) {
  const handleColorChange = (color: string) => {
    onChangePrimaryColor(color);
    toast.success("Cor atualizada!");
  };

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Modo do Tema
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => isDarkMode && onToggleTheme()}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              !isDarkMode
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className={`p-4 rounded-2xl ${!isDarkMode ? 'bg-yellow-100' : 'bg-muted'}`}>
              <Sun className={`h-8 w-8 ${!isDarkMode ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </div>
            <span className="font-semibold text-foreground">Claro</span>
            {!isDarkMode && <Check className="h-5 w-5 text-primary" />}
          </button>

          <button
            onClick={() => !isDarkMode && onToggleTheme()}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              isDarkMode
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-indigo-900/50' : 'bg-muted'}`}>
              <Moon className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-muted-foreground'}`} />
            </div>
            <span className="font-semibold text-foreground">Escuro</span>
            {isDarkMode && <Check className="h-5 w-5 text-primary" />}
          </button>
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Cor Principal
        </h3>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Escolha sua cor favorita</span>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {colorOptions.map(color => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`aspect-square rounded-xl transition-all flex items-center justify-center ${
                  primaryColor === color.value 
                    ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' 
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.value }}
              >
                {primaryColor === color.value && (
                  <Check className="h-5 w-5 text-white" />
                )}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Cor selecionada: <span style={{ color: primaryColor }}>{colorOptions.find(c => c.value === primaryColor)?.name || 'Personalizada'}</span>
          </p>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Pré-visualização
        </h3>
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div 
            className="h-20 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Exemplo de Cabeçalho
          </div>
          
          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 rounded-xl text-white font-medium"
              style={{ backgroundColor: primaryColor }}
            >
              Botão Primário
            </button>
            <button 
              className="flex-1 py-3 rounded-xl font-medium border-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Botão Secundário
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              AP
            </div>
            <div>
              <p className="font-medium text-foreground">Ana Paula</p>
              <p className="text-sm" style={{ color: primaryColor }}>@anapaula</p>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          As alterações de tema são aplicadas em tempo real e salvas automaticamente.
        </p>
      </div>
    </div>
  );
}
