import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    totalStudyHours: { type: Number, default: 0 },
    accuracyTrend: { type: [Number], default: [] },
    focusScore: { type: Number, default: 0 },
    predictedScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
