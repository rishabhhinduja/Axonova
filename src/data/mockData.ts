export const dashboardData = {
  user: {
    name: "Alex Chen",
    cognitiveLevel: 14,
    focus: 92,
    neuroSync: 94,
    avatar: null,
  },
  predictedScore: {
    value: 88.4,
    target: 85,
    change: "+3.4%",
    period: "vs last week",
  },
  todaysPlan: [
    { id: 1, title: "Neural Networks Integration", subtitle: "Module 4 · 45 min deep focus", priority: "HIGH", completed: false },
    { id: 2, title: "Advanced Thermodynamics", subtitle: "Review Flashcards · 20 min", priority: "MEDIUM", completed: false },
    { id: 3, title: "AI Ethics Paper Sketch", subtitle: "Drafting · 80 min focus", priority: "LOW", completed: false },
  ],
  courseCoverage: { mastery: 75, completion: 42 },
  cognitiveHeatmap: [
    [0.8, 0.6, 0.9, 0.7, 0.5],
    [0.4, 0.7, 0.3, 0.8, 0.6],
    [0.9, 0.5, 0.7, 0.4, 0.8],
  ],
  liveInsight: "Context: Morning sessions show +20% completion efficiency. Recommendation: keep high-complexity topics in the 08:00-10:00 block tomorrow.",
};

export const analyticsData = {
  stats: [
    { label: "TOTAL STUDY HOURS", value: "128.5", unit: "hrs", change: "+12% vs last month" },
    { label: "EFFICIENCY SCORE", value: "92.4", unit: "%", change: "Peak Cognitive Zone" },
    { label: "QUIZ ACCURACY", value: "88.7", unit: "%", change: "Check Chemistry modules" },
    { label: "FOCUS RESILIENCE", value: "45", unit: "min", change: "+5m session length" },
  ],
  scoreTrajectory: [
    { week: "W1", actual: 72, predicted: 70 },
    { week: "W2", actual: 76, predicted: 75 },
    { week: "W3", actual: 80, predicted: 82 },
    { week: "W4", actual: 85, predicted: 86 },
    { week: "W5", actual: 88, predicted: 90 },
    { week: "W6", actual: null, predicted: 92 },
  ],
  subjectMastery: [
    { subject: "Biology", score: 85 },
    { subject: "Physics", score: 72 },
    { subject: "Math", score: 78 },
    { subject: "History", score: 65 },
  ],
  weaknessHeatmap: [
    { topic: "Organic Chemistry", severity: "critical" },
    { topic: "Taylor Series", severity: "warning" },
    { topic: "Linear Algebra", severity: "low" },
  ],
  recommendations: [
    { title: "Revisit: Mitochondrial DNA", description: "Your accuracy dropped by 14% on this topic. A quick 10-min recap is suggested.", priority: "HIGH PRIORITY", color: "destructive" },
    { title: "Deep Dive: Linear Algebra", description: "Retention is high. Move to Advanced Transformations for cognitive stretch.", priority: "PROGRESSION", color: "primary" },
    { title: "Schedule: Mock Exam III", description: "Neural fatigue detected. Delay final exam simulation by 24 hours for rest.", priority: "WELLNESS", color: "warning" },
  ],
};

export const plannerData = {
  date: "Tuesday, May 14",
  todaysFocus: "Data Structures",
  subjects: [
    { id: 1, category: "COMPUTER SCIENCE", title: "DSA: Binary Search", description: "Focus on time complexity and edge cases.", duration: "2 hrs", color: "primary" },
    { id: 2, category: "DATABASES", title: "Quiz: DBMS Normalization", description: "Review 1NF to BCNF mapping rules.", duration: "30 min", color: "warning" },
    { id: 3, category: "OS ARCHITECTURE", title: "Process Scheduling", description: "Round robin and priority queue analysis.", duration: "1.5 hrs", color: "destructive" },
  ],
  timeline: [
    { time: "08:00 AM", title: "Morning Focus: React Hooks Deep-dive", status: "missed" },
    { time: "09:00 AM", title: "DSA: Binary Search Trees", status: "ai-recommended", detail: "09:15 AM - 10:45 AM · High Energy Focus" },
    { time: "10:00 AM", title: "DBMS: Relational Algebra & Normalization", status: "in-progress", detail: "NOW · 11:20 AM · Completing Module 4 exercises." },
    { time: "11:00 AM", title: "OS: Process Control Blocks", status: "upcoming", detail: "01:15 PM · Low Urgency" },
  ],
  productivity: { score: 84, completedHours: 3.5 },
};

export const quizData = {
  currentQuestion: 9,
  totalQuestions: 20,
  topic: "Neural Plasticity & Focus",
  timeRemaining: "12:45",
  question: "Which neurotransmitter is most critically associated with the maintenance of sustained attention during demanding cognitive tasks?",
  options: [
    { label: "A", text: "Norepinephrine" },
    { label: "B", text: "Dopamine" },
    { label: "C", text: "Serotonin" },
    { label: "D", text: "Glutamate" },
  ],
  selectedAnswer: "B",
  aiInsight: "Your current focus state is optimal. Remember: neurotransmitters like these are released from the ventral tegmental area to modulate reward-seeking behavior.",
  navigator: [
    { num: 1, status: "answered" }, { num: 2, status: "answered" }, { num: 3, status: "answered" },
    { num: 4, status: "answered" }, { num: 5, status: "answered" }, { num: 6, status: "flagged" },
    { num: 7, status: "flagged" }, { num: 8, status: "answered" }, { num: 9, status: "current" },
    { num: 10, status: "unanswered" }, { num: 11, status: "unanswered" }, { num: 12, status: "unanswered" },
    { num: 13, status: "unanswered" }, { num: 14, status: "unanswered" }, { num: 15, status: "unanswered" },
  ],
};

export const mentorMessages = [
  { role: "ai" as const, content: "Welcome to your Cognitive Sanctuary. I am your AI Mentor. Together, we will reconstruct your learning architecture into a streamlined path for mastery.", timestamp: "10:00 AM" },
  { role: "user" as const, content: "Can you help me plan my study for the upcoming physics exam?", timestamp: "10:02 AM" },
  { role: "ai" as const, content: "Absolutely! Based on your performance data, I've identified 3 key areas to focus on: Thermodynamics (72% mastery), Quantum Mechanics (65%), and Electromagnetic Waves (80%). I recommend starting with Quantum Mechanics as it has the steepest improvement curve. Shall I create a 2-week intensive plan?", timestamp: "10:02 AM" },
  { role: "user" as const, content: "Yes, please create a plan focusing on Quantum Mechanics first.", timestamp: "10:05 AM" },
  { role: "ai" as const, content: "I've drafted a 14-day cognitive optimization plan:\n\n📅 Week 1: Foundation Strengthening\n- Days 1-2: Wave-particle duality deep dive (2hrs/day)\n- Days 3-4: Schrödinger equation mastery (2.5hrs/day)\n- Day 5: Practice problems + AI quiz\n\n📅 Week 2: Advanced Application\n- Days 6-7: Quantum tunneling & barriers\n- Days 8-9: Hydrogen atom solutions\n- Day 10: Mock exam simulation\n\nYour optimal study window is 8-11 AM based on your circadian data. Want me to schedule this?", timestamp: "10:06 AM" },
];

export const settingsData = {
  profile: {
    name: "Alex Chen",
    email: "alex.chen@axonova.ai",
    cognitiveLevel: 14,
    joinDate: "March 2024",
  },
  preferences: {
    darkMode: true,
    notifications: true,
    aiSuggestions: true,
    focusMode: "balanced",
    studyReminders: true,
    weeklyReport: true,
  },
  aiSettings: {
    mentorPersonality: "Professional",
    insightFrequency: "Medium",
    adaptiveDifficulty: true,
    autoSchedule: true,
  },
};

export const notificationsData = [
  { id: 1, type: "ai-insight", title: "Focus Pattern Detected", message: "Your concentration peaks between 9-11 AM. Schedule difficult topics in this window.", time: "5 min ago", read: false },
  { id: 2, type: "reminder", title: "Quiz Due: DBMS Normalization", message: "Complete your scheduled quiz before 2:00 PM today.", time: "15 min ago", read: false },
  { id: 3, type: "achievement", title: "Streak Milestone!", message: "You've maintained a 7-day study streak. Keep it up!", time: "1 hour ago", read: false },
  { id: 4, type: "warning", title: "Retention Drop Alert", message: "Your Organic Chemistry retention dropped 14%. Review recommended.", time: "2 hours ago", read: true },
  { id: 5, type: "system", title: "New Feature: Deep Focus Mode", message: "Try our new distraction-free study environment with cognitive tracking.", time: "1 day ago", read: true },
  { id: 6, type: "ai-insight", title: "Weekly Performance Summary", message: "Your efficiency improved by 12% this week. Top subject: Biology.", time: "2 days ago", read: true },
];

export const subjectsData = [
  { id: 1, name: "Computer Science", topics: 12, completed: 8, mastery: 78, color: "primary", icon: "💻" },
  { id: 2, name: "Biology", topics: 15, completed: 12, mastery: 85, color: "success", icon: "🧬" },
  { id: 3, name: "Physics", topics: 10, completed: 5, mastery: 55, color: "warning", icon: "⚛️" },
  { id: 4, name: "Mathematics", topics: 14, completed: 9, mastery: 72, color: "info", icon: "📐" },
  { id: 5, name: "History", topics: 8, completed: 3, mastery: 42, color: "destructive", icon: "📜" },
  { id: 6, name: "Chemistry", topics: 11, completed: 7, mastery: 68, color: "warning", icon: "🧪" },
];
