import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { readStore, writeStore, safePercent } from "./utils/store.js";
import { signToken, verifyToken } from "./utils/auth.js";

const app = express();
const PORT = Number(process.env.API_PORT || 4000);
const configuredOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const localhostOriginPattern = /^http:\/\/localhost:\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header) and local dev ports.
      if (!origin || configuredOrigins.includes(origin) || localhostOriginPattern.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

function withErrorBoundary(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function seedSubjectsForUser(userId) {
  return [
    {
      id: uuidv4(),
      userId,
      name: "Computer Science",
      examDate: null,
      weakTopics: ["Binary Trees", "Dynamic Programming"],
      strongTopics: ["Sorting", "Hash Maps"],
    },
    {
      id: uuidv4(),
      userId,
      name: "Mathematics",
      examDate: null,
      weakTopics: ["Taylor Series"],
      strongTopics: ["Linear Algebra"],
    },
    {
      id: uuidv4(),
      userId,
      name: "Physics",
      examDate: null,
      weakTopics: ["Quantum Mechanics"],
      strongTopics: ["Kinematics"],
    },
  ];
}

function generatePlanFromOnboarding(userId, onboarding) {
  const subjects = onboarding.subjects?.length ? onboarding.subjects : ["Computer Science", "Mathematics", "Physics"];
  const priorities = ["HIGH", "MEDIUM", "LOW"];
  const now = new Date();

  const tasks = Array.from({ length: 12 }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() + Math.floor(index / 3));

    const subject = subjects[index % subjects.length];
    const topic = onboarding.weakTopics?.[index % (onboarding.weakTopics.length || 1)] || `Module ${index + 1}`;
    const durationMinutes = 40 + (index % 3) * 20;

    return {
      id: uuidv4(),
      userId,
      date: date.toISOString().slice(0, 10),
      subject,
      topic,
      durationMinutes,
      priority: priorities[index % priorities.length],
      status: index === 0 ? "in-progress" : "pending",
    };
  });

  return tasks;
}

function getUserFromStore(store, userId) {
  return store.users.find((item) => item.id === userId);
}

function getUserTasks(store, userId) {
  return store.studyPlans.filter((task) => task.userId === userId);
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function buildDashboardData(store, userId) {
  const tasks = getUserTasks(store, userId);
  const today = getTodayIsoDate();
  const todaysTasks = tasks.filter((task) => task.date === today).slice(0, 3);
  const completed = tasks.filter((task) => task.status === "completed");
  const quizEntries = store.quizData.filter((item) => item.userId === userId);
  const avgQuiz = quizEntries.length
    ? quizEntries.reduce((sum, item) => sum + item.score, 0) / quizEntries.length
    : 78;

  const completionPercent = safePercent(completed.length, tasks.length || 1);
  const masteryPercent = Math.min(96, Math.round((avgQuiz + completionPercent) / 2));
  const predicted = Math.min(99, Math.round((masteryPercent * 0.75 + completionPercent * 0.25) * 10) / 10);

  return {
    predictedScore: {
      value: predicted,
      target: 85,
      change: `+${Math.max(1.1, (predicted - 80).toFixed(1))}%`,
      period: "vs last week",
    },
    todaysPlan: todaysTasks.map((task, index) => ({
      id: index + 1,
      title: `${task.subject}: ${task.topic}`,
      subtitle: `${task.durationMinutes} min deep focus`,
      priority: task.priority,
      completed: task.status === "completed",
    })),
    courseCoverage: {
      mastery: masteryPercent,
      completion: completionPercent,
    },
    cognitiveHeatmap: [
      [0.5, 0.6, 0.7, 0.4, 0.3],
      [0.6, 0.75, 0.55, 0.7, 0.45],
      [0.7, 0.5, 0.8, 0.6, 0.4],
    ],
    liveInsight:
      "Context: Completion trend is stable. Keep high-complexity modules in your first 2 focus blocks for better throughput.",
  };
}

function buildPlannerData(store, userId) {
  const today = getTodayIsoDate();
  const subjects = store.subjects.filter((subject) => subject.userId === userId);
  const tasks = getUserTasks(store, userId);
  const todaysTasks = tasks.filter((task) => task.date === today);
  const completedHours =
    todaysTasks
      .filter((task) => task.status === "completed")
      .reduce((sum, task) => sum + task.durationMinutes, 0) / 60;

  const timeline = todaysTasks.map((task, index) => {
    const hour = 8 + index;
    const minute = index % 2 === 0 ? "00" : "30";
    const suffix = hour >= 12 ? "PM" : "AM";
    const normalizedHour = hour > 12 ? hour - 12 : hour;

    return {
      time: `${String(normalizedHour).padStart(2, "0")}:${minute} ${suffix}`,
      title: `${task.subject}: ${task.topic}`,
      status: task.status === "completed" ? "ai-recommended" : task.status === "in-progress" ? "in-progress" : "upcoming",
      detail:
        task.status === "in-progress"
          ? "NOW · Active study block"
          : `${task.durationMinutes} min · Priority ${task.priority}`,
    };
  });

  return {
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
    todaysFocus: subjects[0]?.name || "Computer Science",
    subjects: subjects.slice(0, 3).map((subject, index) => ({
      id: index + 1,
      category: subject.name.toUpperCase(),
      title: `${subject.name}: Core Practice`,
      description: `Focus on ${subject.weakTopics?.[0] || "high-impact revisions"}.`,
      duration: `${60 + index * 30} min`,
      color: index === 0 ? "primary" : index === 1 ? "warning" : "destructive",
    })),
    timeline,
    productivity: {
      score: safePercent(
        todaysTasks.filter((task) => task.status === "completed" || task.status === "in-progress").length,
        todaysTasks.length || 1
      ),
      completedHours: Number(completedHours.toFixed(1)),
    },
  };
}

function buildAnalyticsData(store, userId) {
  const tasks = getUserTasks(store, userId);
  const quizEntries = store.quizData.filter((item) => item.userId === userId);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const totalHours = tasks.reduce((sum, task) => sum + task.durationMinutes, 0) / 60;
  const accuracy = quizEntries.length
    ? Math.round(quizEntries.reduce((sum, entry) => sum + entry.score, 0) / quizEntries.length)
    : 82;

  const scoreTrajectory = [72, 76, 80, 84, 87, 90].map((value, index) => ({
    week: `W${index + 1}`,
    actual: index < 5 ? value : null,
    predicted: value + 1,
  }));

  const subjectMastery = store.subjects
    .filter((subject) => subject.userId === userId)
    .slice(0, 4)
    .map((subject, index) => ({
      subject: subject.name,
      score: Math.min(95, 62 + index * 8 + Math.round(accuracy / 12)),
    }));

  return {
    stats: [
      { label: "TOTAL STUDY HOURS", value: totalHours.toFixed(1), unit: "hrs", change: "+8% vs last week" },
      { label: "EFFICIENCY SCORE", value: String(safePercent(completedCount, tasks.length || 1)), unit: "%", change: "Steady execution" },
      { label: "QUIZ ACCURACY", value: String(accuracy), unit: "%", change: "Based on recent attempts" },
      { label: "FOCUS RESILIENCE", value: "42", unit: "min", change: "Avg uninterrupted block" },
    ],
    scoreTrajectory,
    subjectMastery,
    recommendations: [
      {
        title: "Revisit weak cluster",
        description: "Schedule a 25-min recap for your lowest-scoring topic tomorrow morning.",
        priority: "HIGH PRIORITY",
        color: "destructive",
      },
      {
        title: "Promote strong topic",
        description: "Move one advanced problem set into your next active day for progression.",
        priority: "PROGRESSION",
        color: "primary",
      },
      {
        title: "Balance load",
        description: "Insert a 10-min recovery gap after two high-intensity tasks.",
        priority: "WELLNESS",
        color: "warning",
      },
    ],
  };
}

function buildSubjectsData(store, userId) {
  return store.subjects
    .filter((subject) => subject.userId === userId)
    .map((subject, index) => {
      const mastery = Math.min(95, 68 + index * 7);
      return {
        id: index + 1,
        name: subject.name,
        topics: 8 + index * 2,
        completed: 4 + index,
        mastery,
        color: "primary",
        icon: "•",
      };
    });
}

app.get(
  "/api/health",
  withErrorBoundary(async (_req, res) => {
    res.json({ status: "ok" });
  })
);

app.post(
  "/api/signup",
  withErrorBoundary(async (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const store = await readStore();
    const existing = store.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    store.subjects.push(...seedSubjectsForUser(user.id));

    await writeStore(store);

    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  })
);

app.post(
  "/api/login",
  withErrorBoundary(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const store = await readStore();
    const user = store.users.find((item) => item.email === String(email).toLowerCase());

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    const userTasks = store.studyPlans.filter((task) => task.userId === user.id);
    if (!userTasks.length) {
      const onboarding = store.onboarding.find((item) => item.userId === user.id) || {
        subjects: store.subjects.filter((subject) => subject.userId === user.id).map((subject) => subject.name),
        weakTopics: [],
      };
      store.studyPlans.push(...generatePlanFromOnboarding(user.id, onboarding));
      await writeStore(store);
    }

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  })
);

app.get(
  "/api/me",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    const user = getUserFromStore(store, req.user.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: user.id, name: user.name, email: user.email });
  })
);

app.post(
  "/api/onboarding",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const { subjects = [], examDate = null, dailyHours = 2, weakTopics = [], strongTopics = [] } = req.body || {};

    const store = await readStore();
    const userId = req.user.sub;

    store.onboarding = store.onboarding.filter((item) => item.userId !== userId);
    store.onboarding.push({
      userId,
      subjects,
      examDate,
      dailyHours,
      weakTopics,
      strongTopics,
      updatedAt: new Date().toISOString(),
    });

    const existingSubjects = store.subjects.filter((item) => item.userId === userId);
    if (subjects.length) {
      store.subjects = store.subjects.filter((item) => item.userId !== userId);
      subjects.forEach((subjectName) => {
        store.subjects.push({
          id: uuidv4(),
          userId,
          name: subjectName,
          examDate,
          weakTopics,
          strongTopics,
        });
      });
    } else if (!existingSubjects.length) {
      store.subjects.push(...seedSubjectsForUser(userId));
    }

    await writeStore(store);
    res.json({ message: "Onboarding saved" });
  })
);

app.post(
  "/api/generate-plan",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    const userId = req.user.sub;

    const onboarding = store.onboarding.find((item) => item.userId === userId) || {
      subjects: store.subjects.filter((subject) => subject.userId === userId).map((subject) => subject.name),
      weakTopics: [],
    };

    const generated = generatePlanFromOnboarding(userId, onboarding);

    store.studyPlans = store.studyPlans.filter((task) => task.userId !== userId).concat(generated);
    await writeStore(store);

    res.status(201).json({
      message: "Plan generated",
      tasks: generated,
    });
  })
);

app.get(
  "/api/daily-plan",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const date = req.query.date ? String(req.query.date) : getTodayIsoDate();
    const store = await readStore();
    const tasks = getUserTasks(store, req.user.sub).filter((task) => task.date === date);

    res.json({ date, tasks });
  })
);

app.post(
  "/api/mark-complete",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const { taskId, status = "completed" } = req.body || {};

    if (!taskId) {
      return res.status(400).json({ message: "taskId is required" });
    }

    const store = await readStore();
    const task = store.studyPlans.find((item) => item.id === taskId && item.userId === req.user.sub);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await writeStore(store);

    res.json({ message: "Task updated", task });
  })
);

app.post(
  "/api/submit-quiz",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const { topic, score, timeTaken } = req.body || {};

    if (!topic || typeof score !== "number" || typeof timeTaken !== "number") {
      return res.status(400).json({ message: "topic, score, and timeTaken are required" });
    }

    const store = await readStore();
    const entry = {
      id: uuidv4(),
      userId: req.user.sub,
      topic,
      score,
      timeTaken,
      createdAt: new Date().toISOString(),
    };

    store.quizData.push(entry);
    await writeStore(store);

    res.status(201).json({ message: "Quiz submitted", entry });
  })
);

app.get(
  "/api/performance",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    const tasks = getUserTasks(store, req.user.sub);
    const quizEntries = store.quizData.filter((item) => item.userId === req.user.sub);

    const completed = tasks.filter((task) => task.status === "completed").length;
    const completionPercent = safePercent(completed, tasks.length || 1);
    const avgAccuracy = quizEntries.length
      ? Math.round(quizEntries.reduce((sum, item) => sum + item.score, 0) / quizEntries.length)
      : 0;
    const avgTime = quizEntries.length
      ? Math.round(quizEntries.reduce((sum, item) => sum + item.timeTaken, 0) / quizEntries.length)
      : 0;

    res.json({
      completionPercent,
      avgAccuracy,
      avgTime,
      weaknessScore: Math.max(0, Math.round((100 - avgAccuracy) + avgTime / 10)),
    });
  })
);

app.get(
  "/api/dashboard",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    res.json(buildDashboardData(store, req.user.sub));
  })
);

app.get(
  "/api/planner",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    res.json(buildPlannerData(store, req.user.sub));
  })
);

app.get(
  "/api/analytics",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    res.json(buildAnalyticsData(store, req.user.sub));
  })
);

app.get(
  "/api/subjects",
  requireAuth,
  withErrorBoundary(async (req, res) => {
    const store = await readStore();
    res.json(buildSubjectsData(store, req.user.sub));
  })
);

app.listen(PORT, () => {
  console.log(`Axonova API listening on http://localhost:${PORT}`);
});
