import { Router } from "express";
import { quizHistoryController, submitQuizController } from "../controllers/quizController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { quizHistorySchema, quizSubmitSchema } from "../utils/validators.js";

const router = Router();

router.post("/submit", requireAuth, validateRequest(quizSubmitSchema), submitQuizController);
router.get("/history", requireAuth, validateRequest(quizHistorySchema), quizHistoryController);

export default router;
