const { ai, MODEL } = require("../config/gemini");

async function analyzeCropImage(imageBuffer) {
  const base64Image = imageBuffer.toString("base64");

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                text: `
You are an agricultural AI expert.

Analyze this crop image and return ONLY valid JSON.

Use this exact structure:

{
  "crop": "",
  "health": "",
  "disease": "",
  "confidence": 0,
  "severity": "",
  "description": "",
  "causes": [],
  "treatment": [],
  "organicTreatment": [],
  "prevention": []
}
`,
              },
            ],
          },
        ],
      });

      let text = response.text;

// Remove markdown code fences
text = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  await activityLogger.log({
      farmId,
      role: "system",
      type: "diagnosis",
      title: diagnosis.crop,
      message: diagnosis.diagnosis,
      metadata: {
          disease: diagnosis.disease,
          confidence: diagnosis.confidence,
      },
  });

return text;

    } catch (error) {
      if (error.status === 503 && attempt < maxRetries) {
        console.log(`Gemini busy. Retrying (${attempt}/${maxRetries})...`);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }

      throw error;
    }
  }
}

module.exports = {
  analyzeCropImage,
};