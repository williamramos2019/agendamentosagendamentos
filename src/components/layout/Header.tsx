import { Bell, ChevronDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  salonName: string;
  userName: string;
  notificationCount?: number;
}

export function Header({ salonName, userName, notificationCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Salon Selector */}
        <button className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-salon">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-sm">{salonName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-xs text-muted-foreground">Olá, {userName}</span>
          </div>
        </button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
