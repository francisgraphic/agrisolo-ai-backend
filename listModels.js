require("dotenv").config();

const ai = require("./src/config/gemini");

async function run() {
  try {
    const models = await ai.models.list();

    for await (const model of models) {
      console.log(model.name);
    }
  } catch (err) {
    console.error(err);
  }
}

run();