import { Router } from "express";
import { completeTaskController, missTaskController } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { taskActionSchema } from "../utils/validators.js";

const router = Router();

router.post("/complete", requireAuth, validateRequest(taskActionSchema), completeTaskController);
router.post("/miss", requireAuth, validateRequest(taskActionSchema), missTaskController);

export default router;
