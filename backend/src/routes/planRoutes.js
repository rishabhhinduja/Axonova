import { Router } from "express";
import {
  generatePlanController,
  getTodayPlanController,
  updatePlanController,
} from "../controllers/planController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  generatePlanSchema,
  todayPlanSchema,
  updatePlanSchema,
} from "../utils/validators.js";

const router = Router();

router.post("/generate", requireAuth, validateRequest(generatePlanSchema), generatePlanController);
router.get("/today", requireAuth, validateRequest(todayPlanSchema), getTodayPlanController);
router.put("/update", requireAuth, validateRequest(updatePlanSchema), updatePlanController);

export default router;
