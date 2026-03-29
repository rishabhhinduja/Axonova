import { settingsData } from "@/data/mockData";
import { User, Brain, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const { profile, preferences, aiSettings } = settingsData;

  const Toggle = ({ enabled }: { enabled: boolean }) => (
    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${enabled ? "bg-primary" : "bg-secondary"}`}>
      <div className={`w-4 h-4 rounded-full bg-foreground transition-transform ${enabled ? "translate-x-5" : ""}`} />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" /> Profile
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">AC</div>
          <div>
            <p className="text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-primary mt-1">Cognitive Level {profile.cognitiveLevel} · Joined {profile.joinDate}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Full Name</label>
            <input defaultValue={profile.name} className="mt-1 w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</label>
            <input defaultValue={profile.email} className="mt-1 w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary" /> Preferences
        </h2>
        <div className="space-y-4">
          {[
            { label: "Notifications", desc: "Receive study reminders and alerts", value: preferences.notifications },
            { label: "AI Suggestions", desc: "Get real-time study recommendations", value: preferences.aiSuggestions },
            { label: "Study Reminders", desc: "Daily study session reminders", value: preferences.studyReminders },
            { label: "Weekly Report", desc: "Receive weekly performance summary", value: preferences.weeklyReport },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <Toggle enabled={pref.value} />
            </div>
          ))}
        </div>
      </div>

      {/* AI Settings */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" /> AI Configuration
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Mentor Personality</label>
            <select className="mt-1 w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
              <option>Professional</option>
              <option>Friendly</option>
              <option>Academic</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Insight Frequency</label>
            <select className="mt-1 w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          {[
            { label: "Adaptive Difficulty", desc: "AI adjusts quiz difficulty based on performance", value: aiSettings.adaptiveDifficulty },
            { label: "Auto Schedule", desc: "AI automatically optimizes your study schedule", value: aiSettings.autoSchedule },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <Toggle enabled={setting.value} />
            </div>
          ))}
        </div>
      </div>

      <button className="gradient-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity">
        Save Changes
      </button>
    </div>
  );
}
