const ai = require("../config/gemini");

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Reply with exactly: Agrisolo AI Gemini Connected",
            },
          ],
        },
      ],
    });

    console.log(response.text);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  testGemini,
};