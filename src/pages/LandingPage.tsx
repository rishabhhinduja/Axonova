import { Link } from "react-router-dom";
import { Zap, Calendar, Brain, BarChart3, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">Axonova</span>
        </div>
        <div className="flex items-center gap-8">
          {["Home", "Planner", "Quizzes", "Analytics"].map((item, i) => (
            <a key={item} href="#" className={`text-sm ${i === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"} transition-colors`}>{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Link to="/login" className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
            ✦ AI-Powered Cognitive Architecture
          </span>
          <h1 className="text-6xl font-display font-bold text-foreground mt-8 leading-tight">
            The Last Study Plan<br />
            <span className="glow-text">You'll Ever Need.</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Harness the power of AI-adaptive learning and real-time score prediction. We organize the chaos of studying into a clear, high-performance path to mastery.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link to="/dashboard" className="gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity text-sm">
              Get Started for Free
            </Link>
            <Link to="/dashboard" className="glass-card px-8 py-3.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {[
            { icon: Calendar, title: "Smart Scheduling", desc: "The AI Mentor analyzes your peak cognitive hours and syllabus difficulty to construct a dynamic schedule that adapts as you progress." },
            { icon: Brain, title: "Weakness Detection", desc: "Identifying cognitive gaps before they become exam failures. Our analytics predict score variance with 94% accuracy." },
            { icon: Sparkles, title: "AI Mentor", desc: "24/7 access to your personal educational counselor. Summarize complex theories or solve repetitive instantly." },
            { icon: BarChart3, title: "Predictive Analytics", desc: "Don't guess your exam readiness. Know it. Our models simulate performance outcomes based on your daily study patterns." },
          ].map((feature) => (
            <div key={feature.title} className="glass-card-hover p-8">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-8">
        <h2 className="text-4xl font-display font-bold text-foreground">Ready to reach cognitive mastery?</h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Join 10,000+ students engineering their academic success with Axonova.</p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/dashboard" className="gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity text-sm flex items-center gap-2">
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="glass-card px-8 py-3.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            Research & Methodology
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center">
        <p className="font-display font-bold text-foreground mb-2">Axonova</p>
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase">© 2024 Axonova. Engineered for Cognitive Excellence.</p>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Research</a>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
        </div>
      </footer>
    </div>
  );
}
