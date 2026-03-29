import { dashboardData } from "@/data/mockData";
import { Zap, TrendingUp, Brain, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: "easeOut",
    },
  },
};

export default function DashboardPage() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => fetchDashboard(token || ""),
    enabled: Boolean(token),
  });

  const resolvedData = (data || dashboardData) as typeof dashboardData;
  const { predictedScore, todaysPlan, courseCoverage, cognitiveHeatmap, liveInsight } = resolvedData;

  const priorityColor = (p: string) => {
    if (p === "HIGH") return "bg-destructive/20 text-destructive";
    if (p === "MEDIUM") return "bg-warning/20 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: "easeOut" }}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Good morning, Alex. Your focus window is optimal for <span className="text-foreground font-medium">Quantum Mechanics</span>.
          </p>
        </div>
        <motion.div
          className="flex items-center gap-2 glass-card px-4 py-2 border border-border"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Zap className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono font-medium text-foreground">Focus: 92%</span>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" animate="show">
        {/* Today's Plan */}
        <motion.div className="col-span-2 glass-card p-6 border border-border" variants={staggerItem}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 text-muted-foreground" /> Today's Plan
            </h2>
            <motion.button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              Edit Schedule
            </motion.button>
          </div>
          <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
            {todaysPlan.map((task) => (
              <motion.div
                key={task.id}
                variants={staggerItem}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border hover:bg-secondary/35 hover:border-white/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground transition-colors">
                  {task.id === 1 ? "🧠" : task.id === 2 ? "📚" : "✍️"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.subtitle}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${priorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Predicted Score */}
        <motion.div
          className="glass-card p-6 border border-border surface-hover"
          variants={staggerItem}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mb-3">Predicted Score</p>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-5xl font-mono font-semibold text-foreground">{predictedScore.value}</span>
            <span className="text-xl text-muted-foreground mb-1">%</span>
            <TrendingUp className="w-5 h-5 text-primary ml-auto mb-2" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-6">
            <span>Current Target: {predictedScore.target}%</span>
            <span className="text-primary">{predictedScore.change} {predictedScore.period}</span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border">
            <p className="text-xs font-medium text-foreground">What-if Analysis</p>
            <p className="text-[10px] text-muted-foreground mt-1">If you finish Module 4 today</p>
            <div className="w-2 h-2 rounded-full bg-primary mt-2 ml-auto" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="show">
        {/* Cognitive Heatmap */}
        <motion.div className="glass-card p-6 border border-border" variants={staggerItem}>
          <h3 className="font-semibold text-foreground mb-4">Cognitive Heatmap</h3>
          <div className="grid grid-cols-5 gap-2">
            {cognitiveHeatmap.flat().map((val, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-md transition-opacity duration-200"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                style={{
                  backgroundColor: `hsl(191 88% 47% / ${val * 0.7})`,
                }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span>Focus shift detected: Neural integration concepts are your primary bottleneck.</span>
          </div>
        </motion.div>

        {/* Course Coverage + System Log */}
        <div className="space-y-6">
          <motion.div className="glass-card p-6 border border-border" variants={staggerItem}>
            <h3 className="font-semibold text-foreground mb-4">Course Coverage</h3>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                      strokeDasharray={`${courseCoverage.mastery * 2.2} 220`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-mono font-semibold text-foreground">{courseCoverage.mastery}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">Mastery</p>
              </div>
              <div className="text-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                      strokeDasharray={`${courseCoverage.completion * 2.2} 220`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-mono font-semibold text-foreground">{courseCoverage.completion}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">Completion</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-5 border border-border surface-hover"
            variants={staggerItem}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-secondary border border-border flex items-center justify-center">
                <Brain className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">System Log</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{liveInsight}"</p>
            <motion.button
              className="mt-4 flex items-center gap-2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg border border-transparent hover:border-white/10 hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Play className="w-3 h-3" /> Start Deep Focus
              <span className="ml-1 bg-primary-foreground/20 px-1.5 py-0.5 rounded text-[10px] font-mono">45m</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
