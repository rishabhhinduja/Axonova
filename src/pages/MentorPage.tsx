import { mentorMessages } from "@/data/mockData";
import { useState } from "react";
import { Send, Sparkles, Brain, Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function MentorPage() {
  const [messages, setMessages] = useState(mentorMessages);
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "I've analyzed your request and updated your study plan accordingly. Your next focus session is optimized for maximum retention based on your current cognitive state.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex gap-6">
      {/* Chat area */}
      <motion.div
        className="flex-1 flex flex-col glass-card overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary border border-transparent flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">AI Mentor</h2>
            <p className="text-[10px] text-muted-foreground font-mono">ONLINE · COMMAND MODE</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={`${msg.timestamp}-${i}-${msg.role}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className={`max-w-[70%] p-4 rounded-lg border ${
                  msg.role === "user"
                    ? "bg-primary/10 border-primary/20 text-foreground"
                    : "bg-secondary/50 border-border text-foreground"
                }`}>
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-semibold tracking-wider">SYSTEM</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 text-right font-mono">{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <motion.div
            className="flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 border border-border"
            animate={{ borderColor: isInputFocused ? "hsl(var(--primary))" : "hsl(var(--border))" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Ask your AI Mentor anything..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <motion.button
              onClick={handleSend}
              className="w-9 h-9 rounded-lg gradient-primary border border-transparent hover:border-white/10 flex items-center justify-center hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Quick Actions */}
      <div className="w-72 space-y-4 flex-shrink-0">
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-muted-foreground" /> Quick Prompts
          </h3>
          <div className="space-y-2">
            {["Create a study plan for my exam", "What are my weak areas?", "Optimize my schedule for tomorrow", "Explain quantum entanglement", "Review my quiz performance"].map((prompt) => (
              <motion.button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="w-full text-left text-xs p-3 rounded-lg border border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:border-white/10 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-5 border border-border"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Session Stats</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Messages</span>
              <span className="text-xs text-foreground font-mono font-medium">{messages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Focus Score</span>
              <span className="text-xs text-primary font-mono font-medium">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Insights Generated</span>
              <span className="text-xs text-foreground font-mono font-medium">14</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
