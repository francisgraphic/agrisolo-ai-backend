const { GoogleGenAI } = require("@google/genai");

console.log("✅ Loading:", __filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("✅ AI Created");
console.log(ai);

module.exports = ai;