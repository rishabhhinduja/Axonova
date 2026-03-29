import { quizData } from "@/data/mockData";
import { useState } from "react";
import { ChevronLeft, Sparkles, HelpCircle } from "lucide-react";
import { submitQuiz } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function QuizPage() {
  const { currentQuestion, totalQuestions, topic, timeRemaining, question, options, aiInsight, navigator } = quizData;
  const [selected, setSelected] = useState<string>("B");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();

  const handleSubmitQuiz = async () => {
    if (!token || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const baseScore = selected === quizData.selectedAnswer ? 88 : 62;
      await submitQuiz(token, {
        topic,
        score: baseScore,
        timeTaken: 765,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const navStatus = (s: string) => {
    if (s === "current") return "bg-primary/30 text-primary border border-primary/50";
    if (s === "answered") return "bg-primary/10 text-primary";
    if (s === "flagged") return "bg-warning/10 text-warning";
    return "bg-secondary/50 text-muted-foreground";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="neon-line mb-6" />
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-primary/20 text-primary">
          QUESTION {String(currentQuestion).padStart(2, "0")} OF {totalQuestions}
        </span>
        <span className="text-xs text-muted-foreground">Topic: {topic}</span>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-8">
        {/* Question Area */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight mb-8">
            {question}
          </h1>

          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelected(opt.label)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  selected === opt.label
                    ? "border-primary/50 bg-primary/10 glow-border"
                    : "border-border/50 bg-secondary/20 hover:border-muted-foreground/30"
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  selected === opt.label ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>{opt.label}</span>
                <span className={`text-sm font-medium ${selected === opt.label ? "text-foreground" : "text-muted-foreground"}`}>{opt.text}</span>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === opt.label ? "border-primary" : "border-muted-foreground/30"
                }`}>
                  {selected === opt.label && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Previous Question
            </button>
            <button
              onClick={handleSubmitQuiz}
              className="gradient-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg border border-transparent hover:border-white/10 hover:opacity-90 transition-opacity"
            >
              {submitting ? "Submitting..." : "Submit & Continue"}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Timer */}
          <div className="glass-card p-5 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Time Remaining</p>
            <p className="text-4xl font-display font-bold glow-text">{timeRemaining}</p>
          </div>

          {/* Navigator */}
          <div className="glass-card p-5">
            <p className="text-sm font-medium text-foreground mb-3">Question Navigator</p>
            <div className="grid grid-cols-5 gap-2">
              {navigator.map((q) => (
                <button key={q.num} className={`w-full aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all hover:scale-105 ${navStatus(q.status)}`}>
                  {q.num}
                </button>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="glass-card p-5 glow-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> LIVE AI INSIGHT
              </p>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{aiInsight}"</p>
            <button className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">
              Reveal Cognitive Hint <span>→</span>
            </button>
          </div>

          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto">
            <HelpCircle className="w-3 h-3" /> Need Technical Support?
          </button>
        </div>
      </div>
    </div>
  );
}
