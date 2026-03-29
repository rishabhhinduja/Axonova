import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardAnalytics } from "../services/analyticsService.js";

export const analyticsDashboardController = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardAnalytics(req.user._id);
  res.status(200).json({ dashboard });
});
