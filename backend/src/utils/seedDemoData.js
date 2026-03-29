import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import { logger } from "../config/logger.js";

async function run() {
  await mongoose.connect(env.mongoUri);

  const email = "demo@axonova.ai";
  const existing = await User.findOne({ email });

  if (existing) {
    logger.info("Demo user already exists");
    await mongoose.disconnect();
    return;
  }

  const user = await User.create({
    name: "Axonova Demo",
    email,
    password: await bcrypt.hash("demo12345", 12),
    preferences: {
      dailyStudyHours: 3,
      focusTime: "morning",
      difficultyLevel: "medium",
    },
  });

  await Subject.insertMany([
    { userId: user._id, name: "Computer Science", priority: "high" },
    { userId: user._id, name: "Mathematics", priority: "medium" },
    { userId: user._id, name: "Physics", priority: "medium" },
  ]);

  logger.info("Seeded demo user: demo@axonova.ai / demo12345");
  await mongoose.disconnect();
}

run().catch((error) => {
  logger.error(error);
  process.exit(1);
});
