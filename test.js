require("dotenv").config();

const ai = require("./src/config/gemini");

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Reply with exactly: Agrisolo AI Connected",
            },
          ],
        },
      ],
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

run();