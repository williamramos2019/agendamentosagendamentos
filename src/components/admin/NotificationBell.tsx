import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { NotificationService } from "@/services/NotificationService";
import { SystemNotification } from "@/repositories/NotificationRepository";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = async () => {
    const list = await NotificationService.list();
    const count = await NotificationService.getUnreadCount();
    setNotifications(list);
    setUnreadCount(count);
  };

  useEffect(() => {
    loadNotifications();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    loadNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-card border border-border rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h3 className="font-bold text-sm">Notificações</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Recentes</span>
            </div>
            
            <div className="divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Nenhuma notificação por enquanto.
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 hover:bg-muted/30 transition flex gap-3 ${!n.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-foreground leading-tight">
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 shrink-0"
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
