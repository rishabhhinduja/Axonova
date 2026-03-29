import { Router } from "express";
import { analyticsDashboardController } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/dashboard", requireAuth, analyticsDashboardController);

export default router;
