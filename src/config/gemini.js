const { GoogleGenAI } = require("@google/genai");

// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing from environment variables.");
}

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Default model (can be overridden in Railway/.env)
const MODEL = MODEL || "gemini-2.5-flash-lite";

module.exports = {
  ai,
  MODEL,
};