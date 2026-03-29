import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Brain, Volume2 } from "lucide-react";

export default function DeepFocusPage() {
  const [seconds, setSeconds] = useState(45 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [running]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const pct = ((45 * 60 - seconds) / (45 * 60)) * 100;

  return (
    <div className="h-[calc(100vh-7.5rem)] flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Deep Focus Mode</span>
        </div>

        {/* Timer circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <circle cx="130" cy="130" r="120" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
              strokeDasharray={`${pct * 7.54} 754`} strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-display font-bold glow-text">{fmt(seconds)}</p>
            <p className="text-xs text-muted-foreground mt-2">Neural Networks Integration</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button onClick={() => { setSeconds(45 * 60); setRunning(false); }} className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:text-primary transition-colors text-muted-foreground">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={() => setRunning(!running)} className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity">
            {running ? <Pause className="w-7 h-7 text-primary-foreground" /> : <Play className="w-7 h-7 text-primary-foreground ml-1" />}
          </button>
          <button className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:text-primary transition-colors text-muted-foreground">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus Score</p>
            <p className="text-xl font-display font-bold text-primary mt-1">92%</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Session</p>
            <p className="text-xl font-display font-bold text-foreground mt-1">#7</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</p>
            <p className="text-xl font-display font-bold text-foreground mt-1">5 days</p>
          </div>
        </div>

        {/* AI Tip */}
        <div className="glass-card p-4 mt-6 glow-border text-left">
          <p className="text-xs text-primary font-semibold mb-1">💡 AI Tip</p>
          <p className="text-sm text-muted-foreground">Your focus is strongest in the first 25 minutes. Consider a micro-break at the halfway point.</p>
        </div>
      </div>
    </div>
  );
}
