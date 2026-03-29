import { Router } from "express";
import {
  googleAuthController,
  loginController,
  logoutController,
  refreshController,
  signupController,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  googleAuthSchema,
  loginSchema,
  refreshSchema,
  signupSchema,
} from "../utils/validators.js";

const router = Router();

router.post("/signup", authRateLimiter, validateRequest(signupSchema), signupController);
router.post("/login", authRateLimiter, validateRequest(loginSchema), loginController);
router.post("/google", authRateLimiter, validateRequest(googleAuthSchema), googleAuthController);
router.post("/refresh", authRateLimiter, validateRequest(refreshSchema), refreshController);
router.post("/logout", requireAuth, logoutController);

export default router;
