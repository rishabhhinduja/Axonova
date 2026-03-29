import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "missed"], default: "pending" },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    dueDate: { type: Date, required: true },
    revisionStage: { type: Number, default: 0 },
  },
  { _id: true }
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    tasks: { type: [taskSchema], default: [] },
  },
  { timestamps: true }
);

studyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("StudyPlan", studyPlanSchema);
