import Subject from "../models/Subject.js";
import StudyPlan from "../models/StudyPlan.js";
import Session from "../models/Session.js";

const SPACED_DAYS = [1, 3, 7, 14];
const PRIORITY_ORDER = ["low", "medium", "high"];

function toStartOfDay(dateInput) {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function bumpPriority(priority) {
  const index = PRIORITY_ORDER.indexOf(priority);
  if (index === -1 || index === PRIORITY_ORDER.length - 1) {
    return "high";
  }
  return PRIORITY_ORDER[index + 1];
}

async function getOrCreatePlan(userId, date) {
  const normalized = toStartOfDay(date);
  let plan = await StudyPlan.findOne({ userId, date: normalized });

  if (!plan) {
    plan = await StudyPlan.create({ userId, date: normalized, tasks: [] });
  }

  return plan;
}

function buildTask(subjectName, topic, dueDate, priority = "medium", duration = 45, revisionStage = 0) {
  return {
    subject: subjectName,
    topic,
    duration,
    status: "pending",
    priority,
    dueDate,
    revisionStage,
  };
}

export async function generateStudyPlan(user) {
  let subjects = await Subject.find({ userId: user._id }).sort({ createdAt: 1 });
  if (!subjects.length) {
    await Subject.insertMany([
      { userId: user._id, name: "Computer Science", priority: "high" },
      { userId: user._id, name: "Mathematics", priority: "medium" },
      { userId: user._id, name: "Physics", priority: "medium" },
    ]);
    subjects = await Subject.find({ userId: user._id }).sort({ createdAt: 1 });
  }

  const dailyHours = user.preferences?.dailyStudyHours || 3;
  const maxTasksPerDay = Math.max(2, Math.floor((dailyHours * 60) / 45));
  const start = toStartOfDay(new Date());

  await StudyPlan.deleteMany({ userId: user._id, date: { $gte: start } });

  for (let dayOffset = 0; dayOffset < 10; dayOffset += 1) {
    const date = addDays(start, dayOffset);
    const plan = await getOrCreatePlan(user._id, date);

    const tasks = [];
    for (let i = 0; i < maxTasksPerDay; i += 1) {
      const subject = subjects[(dayOffset + i) % subjects.length];
      tasks.push(
        buildTask(
          subject.name,
          `${subject.name} Core Practice ${dayOffset + i + 1}`,
          date,
          subject.priority || "medium",
          45,
          0
        )
      );
    }

    plan.tasks = tasks;
    await plan.save();
  }

  return { message: "Study plan generated", daysScheduled: 10 };
}

export async function getTodayPlan(userId, dateString) {
  const target = dateString ? toStartOfDay(new Date(dateString)) : toStartOfDay(new Date());
  const plan = await getOrCreatePlan(userId, target);
  return plan;
}

export async function updatePlan(userId, { date, tasks }) {
  const planDate = toStartOfDay(new Date(date));
  const plan = await getOrCreatePlan(userId, planDate);

  plan.tasks = tasks.map((task) => ({
    ...task,
    dueDate: planDate,
    status: task.status || "pending",
    priority: task.priority || "medium",
  }));

  await plan.save();
  return plan;
}

export async function completeTask(userId, { date, taskId }) {
  const planDate = toStartOfDay(new Date(date));
  const plan = await StudyPlan.findOne({ userId, date: planDate });

  if (!plan) {
    throw new ApiError(404, "Study plan not found for selected date");
  }

  const task = plan.tasks.id(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.status = "completed";
  await plan.save();

  const now = new Date();
  const startTime = new Date(now.getTime() - task.duration * 60 * 1000);
  await Session.create({
    userId,
    startTime,
    endTime: now,
    focusScore: 80,
    productivityScore: task.priority === "high" ? 88 : 76,
  });

  for (let i = 0; i < SPACED_DAYS.length; i += 1) {
    const spacedDate = addDays(planDate, SPACED_DAYS[i]);
    const spacedPlan = await getOrCreatePlan(userId, spacedDate);
    spacedPlan.tasks.push(
      buildTask(
        task.subject,
        `${task.topic} Revision #${i + 1}`,
        spacedDate,
        i < 2 ? "high" : "medium",
        Math.max(20, Math.floor(task.duration * 0.6)),
        i + 1
      )
    );
    await spacedPlan.save();
  }

  return task;
}

export async function missTask(userId, { date, taskId }) {
  const planDate = toStartOfDay(new Date(date));
  const plan = await StudyPlan.findOne({ userId, date: planDate });

  if (!plan) {
    throw new ApiError(404, "Study plan not found for selected date");
  }

  const task = plan.tasks.id(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.status = "missed";
  await plan.save();

  const nextDay = addDays(planDate, 1);
  const nextPlan = await getOrCreatePlan(userId, nextDay);
  nextPlan.tasks.push(
    buildTask(
      task.subject,
      `${task.topic} (Rescheduled)`,
      nextDay,
      bumpPriority(task.priority),
      task.duration,
      task.revisionStage || 0
    )
  );
  await nextPlan.save();

  return { taskId, movedTo: nextDay };
}
