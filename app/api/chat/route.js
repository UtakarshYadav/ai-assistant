import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDB from "../../db/connectDB";
import Chat from "../../models/Chat";

// ✅ Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate chat title
function generateTitle(text) {
  return text.trim().split(/\s+/).slice(0, 5).join(" ");
}

// ✅ GET chats
export async function GET() {
  try {
    await connectDB();

    const chats = await Chat.find().sort({ updatedAt: -1 });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

// ✅ POST chat
export async function POST(req) {
  let dbConnected = true;

  try {
    // ✅ Try DB connection
    try {
      await connectDB();
    } catch (err) {
      console.error("DB ERROR:", err.message);
      dbConnected = false;
    }

    const body = await req.json();
    const { message, chatId } = body;

    // ❗ validation
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Valid message is required" },
        { status: 400 }
      );
    }

    // 🤖 Gemini AI (ALWAYS RUN — even if DB fails)
    let botReply = "Something went wrong";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // ✅ STABLE MODEL
      });

      const result = await model.generateContent(message);

      if (!result || !result.response) {
        throw new Error("Invalid Gemini response");
      }

      botReply = result.response.text();
    } catch (aiError) {
      console.error("Gemini ERROR:", aiError);
      botReply = "AI is currently unavailable. Please try again.";
    }

    // ✅ If DB NOT connected → fallback but STILL return AI reply
    if (!dbConnected) {
      return NextResponse.json({
        success: true,
        fallback: true,
        reply: botReply, // 🔥 IMPORTANT (still give answer)
      });
    }

    // ✅ DB FLOW STARTS
    let chat;

    // 🆕 Create new chat
    if (!chatId) {
      const title = generateTitle(message);

      chat = await Chat.create({
        title,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: botReply },
        ],
      });
    } 
    // 🔁 Existing chat
    else {
      chat = await Chat.findById(chatId);

      if (!chat) {
        return NextResponse.json(
          { error: "Chat not found" },
          { status: 404 }
        );
      }

      chat.messages.push({ role: "user", content: message });
      chat.messages.push({ role: "assistant", content: botReply });

      await chat.save();
    }

    // ✅ Final response
    return NextResponse.json({
      success: true,
      fallback: false,
      chatId: chat._id,
      title: chat.title,
      messages: chat.messages,
      reply: botReply, // ✅ always send reply
    });

  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}