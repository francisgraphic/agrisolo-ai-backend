const { GoogleGenAI } = require("@google/genai");

// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing.");
}

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Default model
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

module.exports = {
  ai,
  MODEL,
};