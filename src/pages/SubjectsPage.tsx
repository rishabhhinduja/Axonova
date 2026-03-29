import { subjectsData } from "@/data/mockData";
import { Plus, ChevronRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchSubjects } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SubjectsPage() {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ["subjects-data"],
    queryFn: () => fetchSubjects(token || ""),
    enabled: Boolean(token),
  });

  const resolvedSubjects = (data || subjectsData) as typeof subjectsData;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedSubject = resolvedSubjects.find((subject) => subject.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subject Management</h1>
          <p className="text-muted-foreground mt-1">Track your progress across all subjects and topics.</p>
        </div>
        <motion.button
          className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg border border-transparent hover:border-white/10 flex items-center gap-2 hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Plus className="w-4 h-4" /> Add Subject
        </motion.button>
      </div>

      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
        initial="hidden"
        animate="show"
      >
        {resolvedSubjects.map((sub) => (
          <motion.button
            key={sub.id}
            layoutId={`subject-card-${sub.id}`}
            type="button"
            onClick={() => setSelectedId(sub.id)}
            className="glass-card-hover surface-hover p-4 group cursor-pointer text-left"
            variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } } }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/70" />
                <h3 className="text-base font-semibold text-foreground truncate">{sub.name}</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                topics <span className="font-mono">{sub.topics}</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                completed <span className="font-mono">{sub.completed}</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                mastery <span className="font-mono">{sub.mastery}%</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Mastery</span>
                <span className="text-primary font-mono font-medium">{sub.mastery}%</span>
              </div>
              <svg viewBox="0 0 100 8" className="w-full h-2" aria-hidden="true">
                <rect x="0" y="0" width="100" height="8" rx="4" fill="hsl(var(--muted))" />
                <motion.rect
                  x="0"
                  y="0"
                  height="8"
                  rx="4"
                  fill="hsl(var(--primary))"
                  initial={{ width: 0 }}
                  animate={{ width: sub.mastery }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>delta <span className="font-mono text-foreground">+{Math.floor(Math.random() * 10 + 2)}%</span> this week</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`subject-card-${selectedSubject.id}`}
              className="w-full max-w-2xl glass-card p-6 border border-border"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">{selectedSubject.name}</h3>
                <motion.button
                  className="glass-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-white/10"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => setSelectedId(null)}
                >
                  Close
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Topics</p>
                  <p className="text-2xl font-mono font-semibold text-foreground">{selectedSubject.topics}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-mono font-semibold text-foreground">{selectedSubject.completed}</p>
                </div>
              </div>

              <div className="mt-4 glass-card p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Mastery Level</span>
                  <span className="font-mono font-medium text-primary">{selectedSubject.mastery}%</span>
                </div>
                <svg viewBox="0 0 100 10" className="w-full h-2.5" aria-hidden="true">
                  <rect x="0" y="0" width="100" height="10" rx="5" fill="hsl(var(--muted))" />
                  <motion.rect
                    x="0"
                    y="0"
                    height="10"
                    rx="5"
                    fill="hsl(var(--primary))"
                    initial={{ width: 0 }}
                    animate={{ width: selectedSubject.mastery }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">Detailed breakdown is generated from current study logs and recent assessment outcomes.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
