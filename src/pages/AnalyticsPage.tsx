import { analyticsData } from "@/data/mockData";
import { TrendingUp, Download, Filter, AlertTriangle, ArrowRight, Database } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
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

function SvgProgressBar({ value }: { value: number }) {
  const width = 100;
  const height = 8;
  const y = height / 2;
  const fullLength = width - 4;
  const targetLength = (value / 100) * fullLength;
  const targetOffset = fullLength - targetLength;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-2" aria-hidden="true">
      <line x1="2" y1={y} x2={width - 2} y2={y} stroke="hsl(var(--muted))" strokeWidth={height} strokeLinecap="round" />
      <motion.line
        x1="2"
        y1={y}
        x2={width - 2}
        y2={y}
        stroke="hsl(var(--primary))"
        strokeWidth={height}
        strokeLinecap="round"
        strokeDasharray={fullLength}
        initial={{ strokeDashoffset: fullLength }}
        animate={{ strokeDashoffset: targetOffset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

function SvgProgressRing({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-mono font-semibold text-foreground">{value}%</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ["analytics-data"],
    queryFn: () => fetchAnalytics(token || ""),
    enabled: Boolean(token),
  });

  const resolvedData = (data || analyticsData) as typeof analyticsData;
  const { stats, scoreTrajectory, subjectMastery, recommendations } = resolvedData;
  const radarData = subjectMastery.map((s) => ({ subject: s.subject, value: s.score }));
  const averageMastery = Math.round(subjectMastery.reduce((acc, cur) => acc + cur.score, 0) / subjectMastery.length);

  return (
    <div className="space-y-6">
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: "easeOut" }}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Intelligence</h1>
          <p className="text-muted-foreground mt-1">Operational view of learning throughput across recent sessions and assessment cycles.</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            className="glass-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Download className="w-4 h-4" /> Export Report
          </motion.button>
          <motion.button
            className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg border border-transparent hover:border-white/10 hover:opacity-90 transition-opacity flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Filter className="w-4 h-4" /> Last 30 Days
          </motion.button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="show">
        {stats.map((stat) => {
          const parsed = Number.parseFloat(stat.value);
          const progress = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(100, Math.round(parsed)));

          return (
            <motion.div
              key={stat.label}
              className="stat-card surface-hover"
              variants={staggerItem}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">{stat.label}</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-mono font-semibold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground mb-1">{stat.unit}</span>
              </div>
              <div className="mt-3">
                <SvgProgressBar value={progress} />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.change}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div className="grid grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" animate="show">
        <motion.div className="col-span-2 glass-card p-6" variants={staggerItem}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Predicted Score Trajectory</h3>
              <p className="text-xs text-muted-foreground mt-1">Estimated final grade based on current retention speed</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground" /> Actual</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Predicted</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={scoreTrajectory}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tick={{ fontFamily: "JetBrains Mono, monospace" }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} tick={{ fontFamily: "JetBrains Mono, monospace" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))", fontFamily: "JetBrains Mono, monospace" }} />
              <Area type="monotone" dataKey="actual" stroke="hsl(var(--muted-foreground))" strokeWidth={2} fill="none" dot={{ fill: "hsl(var(--muted-foreground))", r: 3 }} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorPredicted)" dot={{ fill: "hsl(var(--primary))", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="glass-card p-6 surface-hover"
          variants={staggerItem}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h3 className="font-semibold text-foreground mb-2">Subject Mastery</h3>
          <p className="text-xs text-muted-foreground mb-4">Balanced cognitive profile</p>
          <div className="flex items-center justify-center mb-4">
            <SvgProgressRing value={averageMastery} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.16} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Top Skill</p>
            <p className="text-sm font-semibold text-foreground">Quantitative Reasoning <span className="text-primary font-mono">+18.4%</span></p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="show">
        <motion.div className="glass-card p-6" variants={staggerItem}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Weakness Heatmap</h3>
            <p className="text-xs text-muted-foreground">Density of errors over study sessions</p>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Array.from({ length: 15 }).map((_, i) => {
              const intensity = [0.9, 0.7, 0.8, 0.5, 0.3, 0.4, 0.6, 0.9, 0.2, 0.5, 0.7, 0.3, 0.8, 0.4, 0.6][i];
              return (
                <motion.div
                  key={i}
                  className="aspect-square rounded-md"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  style={{ backgroundColor: intensity > 0.7 ? `hsl(0 72% 51% / ${intensity})` : `hsl(var(--primary) / ${intensity * 0.55})` }}
                />
              );
            })}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span><strong className="text-foreground">Critical Zone</strong> · Organic Chemistry: Bonding</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-warning" />
              <span><strong className="text-foreground">Retention Drop</strong> · Calc: Taylor Series</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card p-6" variants={staggerItem}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-muted-foreground" /> System Recommendations
          </h3>
          <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/40 hover:border-white/10 transition-colors"
                variants={staggerItem}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <p className="text-sm font-medium text-foreground">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                <span className={`inline-block mt-2 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md ${
                  rec.color === "destructive" ? "bg-destructive/20 text-destructive" :
                  rec.color === "warning" ? "bg-warning/20 text-warning" : "bg-secondary text-secondary-foreground"
                }`}>
                  {rec.priority}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.button
            className="mt-4 w-full glass-card py-2.5 text-sm text-foreground hover:text-foreground hover:border-white/10 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            View Comprehensive Study Plan <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
