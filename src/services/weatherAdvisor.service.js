const { ai, MODEL } = require("../config/gemini");

async function generateWeatherAdvice(data) {
  const { farm, current, forecast } = data;

  const forecastSummary = forecast
    .map(
      (day) =>
        `${day.date}: ${day.description}, Max ${day.temperatureMax}°C, Min ${day.temperatureMin}°C, Rain ${day.rainProbability}%`
    )
    .join("\n");

  const prompt = `
You are Agrisolo AI, an expert agricultural consultant.

Analyze the farm information together with the weather forecast and provide professional farming recommendations.

==========================
FARM INFORMATION
==========================

Farm Name: ${farm.name}
Country: ${farm.country}
State: ${farm.state}
Crop: ${farm.cropType || "Unknown"}
Farm Size: ${farm.farmSize || "Unknown"} hectares
Soil Type: ${farm.soilType || "Unknown"}

==========================
CURRENT WEATHER
==========================

Temperature: ${current.temperature}°C
Humidity: ${current.humidity}%
Wind Speed: ${current.windSpeed} km/h
Weather: ${current.description}
Rain Probability Today: ${current.rainProbability}%

==========================
7 DAY FORECAST
==========================

${forecastSummary}

Return ONLY valid JSON.

{
  "summary":"",
  "recommendations":[
    "",
    "",
    ""
  ],
  "planting":"",
  "irrigation":"",
  "fertilizer":"",
  "pesticide":"",
  "harvesting":"",
  "diseaseRisk":"",
  "weatherAlert":"",
  "priority":"Low",
  "riskLevel":"Low"
}

Rules:

- Return ONLY JSON.
- No markdown.
- No explanation.
- recommendations must contain exactly 3 items.
- priority must be Low, Medium or High.
- riskLevel must be Low, Medium or High.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let text = response.text;

  text = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini returned invalid JSON:");
    console.error(text);

    return {
      summary:
        "Unable to generate weather recommendations at this time.",

      recommendations: [
        "Monitor weather conditions regularly.",
        "Inspect crops for pests and diseases.",
        "Follow your normal farm schedule."
      ],

      planting:
        "Plant only when rainfall and soil moisture are suitable.",

      irrigation:
        "Adjust irrigation according to rainfall forecasts.",

      fertilizer:
        "Avoid fertilizer application immediately before heavy rain.",

      pesticide:
        "Inspect crops before spraying and avoid spraying during strong winds.",

      harvesting:
        "Harvest during dry weather whenever possible.",

      diseaseRisk:
        "Monitor crops for fungal diseases during humid conditions.",

      weatherAlert:
        "No major weather alerts available.",

      priority: "Medium",

      riskLevel: "Medium",
    };
  }
}

module.exports = {
  generateWeatherAdvice,
};