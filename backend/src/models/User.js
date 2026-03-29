import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema(
  {
    dailyStudyHours: { type: Number, default: 3 },
    focusTime: { type: String, default: "morning" },
    difficultyLevel: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  },
  { _id: false }
);

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: null },
    googleId: { type: String, default: null, index: true },
    avatar: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferences: { type: userPreferencesSchema, default: () => ({}) },
    refreshTokens: { type: [refreshTokenSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
