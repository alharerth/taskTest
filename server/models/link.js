import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true, lowercase: true },
  target: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Named export
export const Link = mongoose.model("Link", linkSchema);
