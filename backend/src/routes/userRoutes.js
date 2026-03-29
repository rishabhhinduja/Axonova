import { Router } from "express";
import { getProfileController, updateProfileController } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { profileUpdateSchema } from "../utils/validators.js";

const router = Router();

router.get("/profile", requireAuth, getProfileController);
router.put("/update", requireAuth, validateRequest(profileUpdateSchema), updateProfileController);

export default router;
