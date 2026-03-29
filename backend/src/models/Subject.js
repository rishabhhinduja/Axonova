import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    examDate: { type: Date, default: null },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
