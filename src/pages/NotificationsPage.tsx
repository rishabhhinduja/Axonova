import { notificationsData } from "@/data/mockData";
import { Bell, Brain, Trophy, AlertTriangle, Zap, Check } from "lucide-react";

export default function NotificationsPage() {
  const iconMap: Record<string, any> = {
    "ai-insight": Brain,
    "reminder": Bell,
    "achievement": Trophy,
    "warning": AlertTriangle,
    "system": Zap,
  };

  const colorMap: Record<string, string> = {
    "ai-insight": "text-primary bg-primary/10",
    "reminder": "text-info bg-info/10",
    "achievement": "text-warning bg-warning/10",
    "warning": "text-destructive bg-destructive/10",
    "system": "text-primary bg-primary/10",
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with AI insights and study reminders.</p>
        </div>
        <button className="text-sm text-primary hover:underline flex items-center gap-1">
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notificationsData.map((notif) => {
          const Icon = iconMap[notif.type] || Bell;
          return (
            <div key={notif.id} className={`glass-card p-4 flex items-start gap-4 transition-all duration-200 hover:border-primary/20 ${!notif.read ? "border-l-2 border-l-primary" : ""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[notif.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</h3>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-4">{notif.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
              </div>
              {!notif.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
