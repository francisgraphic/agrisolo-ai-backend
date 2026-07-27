const { ai, MODEL } = require("../config/gemini");

async function generateWeatherAdvice({ farm, current, forecast }) {
  const prompt = `
You are Agrisolo AI.

You are a senior agronomist, meteorologist and crop advisor.

Analyze this farm's weather and provide actionable recommendations.

Farm Details
-------------
Farm Name: ${farm.name}
Crop: ${farm.cropType || "Unknown"}
Country: ${farm.country}
State: ${farm.state}
Soil Type: ${farm.soilType || "Unknown"}
Farm Size: ${farm.farmSize || "Unknown"} hectares

Current Weather
---------------
Temperature: ${current.temperature}°C
Humidity: ${current.humidity}%
Wind Speed: ${current.windSpeed} km/h
Weather: ${current.description}
Rain Probability: ${current.rainProbability}%

7-Day Forecast
--------------
${forecast
  .map(
    (d) => `
${d.date}
Weather: ${d.description}
Max Temp: ${d.temperatureMax}°C
Min Temp: ${d.temperatureMin}°C
Rain: ${d.rainProbability}%
`
  )
  .join("\n")}

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
  "priority":"Low|Medium|High",
  "riskLevel":"Low|Medium|High"
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let text = response.text;

  // Remove markdown if Gemini wraps the JSON
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Weather AI Parse Error:", text);

    return {
      summary: "Weather advice unavailable.",
      recommendations: [
        "Monitor weather conditions regularly.",
        "Inspect crops daily.",
        "Follow local agricultural guidelines."
      ],
      planting: "Unknown",
      irrigation: "Unknown",
      fertilizer: "Unknown",
      pesticide: "Unknown",
      harvesting: "Unknown",
      diseaseRisk: "Unknown",
      weatherAlert: "None",
      priority: "Medium",
      riskLevel: "Medium"
    };
  }
}

module.exports = {
  generateWeatherAdvice,
};