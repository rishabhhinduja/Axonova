import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Calendar, FileQuestion, BarChart3,
  Bot, BookOpen, Bell, Settings, HelpCircle, Search, Zap
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Planner", path: "/planner", icon: Calendar },
  { title: "Quizzes", path: "/quizzes", icon: FileQuestion },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "AI Mentor", path: "/mentor", icon: Bot },
  { title: "Subjects", path: "/subjects", icon: BookOpen },
  { title: "Notifications", path: "/notifications", icon: Bell },
];

const bottomItems = [
  { title: "Settings", path: "/settings", icon: Settings },
  { title: "Support", path: "#", icon: HelpCircle },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 bg-sidebar flex flex-col border-r border-sidebar-border">
        <div className="p-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground text-sm">Axonova</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">AI Mentor Active</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-sm">{item.title}</span>
                {item.title === "Notifications" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-3">
          <div className="glass-card p-3 mb-3 text-center">
            <p className="text-xs text-muted-foreground mb-2">Unlock advanced cognitive tracking</p>
            <button className="gradient-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl w-full hover:opacity-90 transition-opacity">
              Upgrade to Pro
            </button>
          </div>
          {bottomItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "sidebar-link-active" : ""}`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-2 w-80">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search insights or topics..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name || "Learner"}</p>
                <p className="text-[10px] text-muted-foreground">{user?.email || "Session active"}</p>
              </div>
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "NP"}
              </div>
              <button onClick={logout} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Logout</button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
