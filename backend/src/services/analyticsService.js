import Analytics from "../models/Analytics.js";
import QuizResult from "../models/QuizResult.js";
import Session from "../models/Session.js";
import StudyPlan from "../models/StudyPlan.js";

function predictScore({ coverage, accuracy, revisionCount, daysRemaining }) {
  // Basic weighted regression-style formula.
  const raw =
    0.35 * coverage +
    0.4 * accuracy +
    0.2 * Math.min(100, revisionCount * 8) +
    0.05 * Math.max(0, 100 - daysRemaining * 2);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function calculateWeaknessScore({ accuracy, timeTaken }) {
  const normalizedTimePenalty = Math.min(100, Math.round(timeTaken / 6));
  return Math.max(0, Math.min(100, Math.round((100 - accuracy) * 0.7 + normalizedTimePenalty * 0.3)));
}

export async function registerQuizResult(userId, payload) {
  const quizResult = await QuizResult.create({ userId, ...payload });

  const weaknessScore = calculateWeaknessScore({
    accuracy: payload.accuracy,
    timeTaken: payload.timeTaken,
  });

  return { quizResult, weaknessScore };
}

export async function getQuizHistory(userId, limit = 20) {
  return QuizResult.find({ userId }).sort({ createdAt: -1 }).limit(limit);
}

export async function getDashboardAnalytics(userId) {
  const [quizHistory, sessions, studyPlans] = await Promise.all([
    QuizResult.find({ userId }).sort({ createdAt: -1 }),
    Session.find({ userId }).sort({ createdAt: -1 }),
    StudyPlan.find({ userId }),
  ]);

  const completedTasks = studyPlans.flatMap((plan) => plan.tasks).filter((task) => task.status === "completed");
  const revisionCount = studyPlans
    .flatMap((plan) => plan.tasks)
    .filter((task) => Number(task.revisionStage || 0) > 0).length;
  const coverage = studyPlans.length
    ? Math.round((completedTasks.length / studyPlans.flatMap((plan) => plan.tasks).length) * 100)
    : 0;

  const avgAccuracy = quizHistory.length
    ? Math.round(quizHistory.reduce((sum, result) => sum + result.accuracy, 0) / quizHistory.length)
    : 0;

  const totalStudyHours = Number(
    (
      sessions.reduce((sum, session) => {
        const diffMs = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
        return sum + diffMs / (1000 * 60 * 60);
      }, 0) || 0
    ).toFixed(2)
  );

  const focusScore = sessions.length
    ? Math.round(sessions.reduce((sum, session) => sum + session.focusScore, 0) / sessions.length)
    : 0;

  const daysRemaining = 30;
  const predictedScore = predictScore({
    coverage,
    accuracy: avgAccuracy,
    revisionCount,
    daysRemaining,
  });

  const trend = quizHistory.slice(0, 8).map((item) => item.accuracy).reverse();

  const analytics = await Analytics.findOneAndUpdate(
    { userId },
    {
      userId,
      totalStudyHours,
      accuracyTrend: trend,
      focusScore,
      predictedScore,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    totalStudyHours,
    accuracyTrend: analytics.accuracyTrend,
    focusScore: analytics.focusScore,
    predictedScore: analytics.predictedScore,
    completionCoverage: coverage,
    averageAccuracy: avgAccuracy,
  };
}
