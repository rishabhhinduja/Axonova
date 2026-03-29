import { asyncHandler } from "../utils/asyncHandler.js";
import { generateStudyPlan, getTodayPlan, updatePlan } from "../services/planService.js";

export const generatePlanController = asyncHandler(async (req, res) => {
  const result = await generateStudyPlan(req.user);
  res.status(201).json(result);
});

export const getTodayPlanController = asyncHandler(async (req, res) => {
  const date = req.validated.query.date;
  const plan = await getTodayPlan(req.user._id, date);
  res.status(200).json({ plan });
});

export const updatePlanController = asyncHandler(async (req, res) => {
  const plan = await updatePlan(req.user._id, req.validated.body);
  res.status(200).json({ plan });
});
