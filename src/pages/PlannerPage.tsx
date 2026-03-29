import { plannerData } from "@/data/mockData";
import { Plus, Sparkles, Clock, RefreshCw, Pause, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPlanner } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function PlannerPage() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ["planner-data"],
    queryFn: () => fetchPlanner(token || ""),
    enabled: Boolean(token),
  });

  const resolvedData = (data || plannerData) as typeof plannerData;
  const { date, todaysFocus, subjects, timeline, productivity } = resolvedData;
  const [activeView, setActiveView] = useState("Day");
  const inProgressItems = timeline.filter((item) => item.status === "in-progress");
  const otherItems = timeline.filter((item) => item.status !== "in-progress");
  const orderedTimeline = [...inProgressItems, ...otherItems];

  const statusStyle = (s: string) => {
    if (s === "missed") return "border-destructive/40 bg-destructive/5";
    if (s === "ai-recommended") return "border-border bg-secondary/30";
    if (s === "in-progress") return "border-l-4 border-l-primary border-border bg-secondary/20";
    return "border-border bg-card";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: "easeOut" }}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Today's Focus</p>
            <span className="text-sm font-semibold text-foreground">{todaysFocus}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{date}</h1>
        </div>
        <div className="flex gap-3">
          <div className="flex glass-card overflow-hidden text-xs">
            {["Day", "Week", "Overview"].map((v, i) => (
              <motion.button
                key={v}
                className={`px-4 py-2 transition-colors ${activeView === v ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={() => setActiveView(v)}
              >
                {v}
              </motion.button>
            ))}
          </div>
          <motion.button
            className="glass-card px-3 py-2 text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground hover:border-white/10 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Sparkles className="w-3 h-3" /> Suggestions
          </motion.button>
          <motion.button
            className="gradient-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg border border-transparent hover:border-white/10 flex items-center gap-2 hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <RefreshCw className="w-3 h-3" /> Re-optimize Schedule
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Subject Backlog */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Subject Backlog</h2>
          <motion.div
            className="space-y-4"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            initial="hidden"
            animate="show"
          >
            {subjects.map((sub) => (
            <motion.div
              key={sub.id}
              className="glass-card-hover surface-hover p-3 space-y-1.5"
              variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } } }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <p className={`text-[10px] font-bold tracking-wider uppercase mb-2 ${
                sub.color === "warning" ? "text-warning" : sub.color === "destructive" ? "text-destructive" : "text-muted-foreground"
              }`}>{sub.category}</p>
              <h3 className="text-sm font-semibold text-foreground">{sub.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-snug">{sub.description}</p>
              <span className="inline-block mt-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{sub.duration}</span>
            </motion.div>
          ))}
          </motion.div>
          <motion.button
            className="w-full glass-card py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Plus className="w-4 h-4" /> Add New Subject
          </motion.button>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-3"
            >
          {orderedTimeline.map((item, i) => (
            <motion.div
              key={i}
              className={`glass-card surface-hover p-4 border ${statusStyle(item.status)} transition-colors duration-200`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 w-20 flex-shrink-0">{item.time}</span>
                  <div>
                    <h3 className={`text-sm text-foreground ${item.status === "in-progress" ? "font-bold" : "font-semibold"}`}>{item.title}</h3>
                    {item.detail && <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>}
                  </div>
                </div>
                {item.status === "missed" && (
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-destructive/20 text-destructive">MISSED TASK</span>
                )}
                {item.status === "ai-recommended" && (
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-secondary text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Rescheduled
                  </span>
                )}
                {item.status === "in-progress" && (
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-primary/15 text-primary">IN PROGRESS</span>
                )}
              </div>
              {item.status === "in-progress" && (
                <div className="mt-4 flex items-center gap-4 p-3 rounded-lg bg-secondary/40 border border-border">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Time Remaining</p>
                    <p className="text-lg font-mono font-semibold text-foreground">00:38:12</p>
                  </div>
                  <motion.button
                    className="ml-auto gradient-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg border border-transparent hover:border-white/10 flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <Pause className="w-3 h-3" /> Pause Session
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
            </motion.div>
          </AnimatePresence>

          {/* System Log */}
          <motion.div
            className="glass-card p-5 mt-6 border border-border surface-hover"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center border border-border">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">System Log</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Contextual Suggestion</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Relational Algebra performance variance is stable. Shifting the next quiz by 15 minutes aligns it with your recent completion window and lowers context-switch overhead.
            </p>
            <motion.button
              className="mt-3 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg border border-transparent hover:border-white/10 hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              Apply Recommendation
            </motion.button>
          </motion.div>

          {/* Bottom stats */}
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Productivity Score</p>
              <p className="text-2xl font-semibold text-foreground"><span className="font-mono">{productivity.score}%</span> <TrendingUp className="inline w-4 h-4 text-primary" /></p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Completed Today</p>
              <p className="text-2xl font-semibold text-foreground"><span className="font-mono">{productivity.completedHours}</span> hrs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
