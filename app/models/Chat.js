// MEMORY AND TITLE
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
  title: { type: String, default: "New Chat" },
  messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

// Generate title  
export function generateTitle(text) {
  return text.trim().split(/\s+/).slice(0, 5).join(" ");
}