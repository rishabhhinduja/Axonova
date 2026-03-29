import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import planRoutes from "./planRoutes.js";
import taskRoutes from "./taskRoutes.js";
import quizRoutes from "./quizRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/plan", planRoutes);
router.use("/task", taskRoutes);
router.use("/quiz", quizRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
