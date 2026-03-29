import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    focusScore: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
