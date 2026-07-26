const ai = require("../config/gemini");

async function determineExpert(question) {
  const prompt = `
You are the routing engine of Agrisolo AI.

Choose the MOST appropriate farming expert.

Available experts:

WEATHER
DISEASE
PLANNER
MARKET
GENERAL

Return ONLY ONE WORD.

Question:
${question}
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  return response.text.trim().toUpperCase();
}

module.exports = {
  determineExpert,
};