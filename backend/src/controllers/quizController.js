import { asyncHandler } from "../utils/asyncHandler.js";
import { getQuizHistory, registerQuizResult } from "../services/analyticsService.js";

export const submitQuizController = asyncHandler(async (req, res) => {
  const { quizResult, weaknessScore } = await registerQuizResult(req.user._id, req.validated.body);
  res.status(201).json({
    quizResult,
    weaknessScore,
    recommendation:
      weaknessScore > 65
        ? "High weakness detected. Add extra revision and reduce task load tomorrow."
        : "Performance stable. Continue current pacing.",
  });
});

export const quizHistoryController = asyncHandler(async (req, res) => {
  const history = await getQuizHistory(req.user._id, req.validated.query.limit || 20);
  res.status(200).json({ history });
});
