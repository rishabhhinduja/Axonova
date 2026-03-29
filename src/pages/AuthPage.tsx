import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Bell, User } from "lucide-react";
import { generatePlan, login, saveOnboarding, signup } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token, setSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = isLogin
        ? await login({ email: email.trim(), password })
        : await signup({ name: name.trim(), email: email.trim(), password });

      setSession(payload.token, payload.user);

      if (!isLogin) {
        await saveOnboarding(payload.token, {
          subjects: ["Computer Science", "Mathematics", "Physics"],
          examDate: null,
          dailyHours: 3,
          weakTopics: ["Dynamic Programming", "Taylor Series"],
          strongTopics: ["Sorting", "Kinematics"],
        });
        await generatePlan(payload.token);
      }

      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-4 z-10 bg-background/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Axonova</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Research</a>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <Bell className="w-4 h-4" />
          <User className="w-4 h-4" />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-md">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
            Adaptive Learning Engine
          </span>
          <h1 className="text-4xl font-bold text-foreground mt-6 leading-tight">
            Replace static plans with
            <span className="text-primary"> adaptive execution.</span>
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Build study plans that adjust automatically based on performance, completion behavior, and quiz outcomes.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">NP</div>
            <div>
              <p className="text-sm font-semibold text-foreground">Axonova Runtime</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">System online</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[480px] flex items-center justify-center p-12 bg-card/30">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-foreground">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{isLogin ? "Login to access your adaptive planner." : "Register and generate your first adaptive plan."}</p>

          <div className="space-y-4 mt-6">
            {!isLogin && (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Alex Chen"
                  className="mt-1.5 w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="mt-1.5 w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {error ? <p className="text-xs text-destructive mt-3">{error}</p> : null}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-lg border border-transparent hover:border-white/10 hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register & Generate Plan"}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "No account yet? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
