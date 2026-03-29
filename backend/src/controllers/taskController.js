import { asyncHandler } from "../utils/asyncHandler.js";
import { completeTask, missTask } from "../services/planService.js";

export const completeTaskController = asyncHandler(async (req, res) => {
  const task = await completeTask(req.user._id, req.validated.body);
  res.status(200).json({ message: "Task completed", task });
});

export const missTaskController = asyncHandler(async (req, res) => {
  const result = await missTask(req.user._id, req.validated.body);
  res.status(200).json({
    message: "Task marked missed and adaptively rescheduled",
    ...result,
  });
});
