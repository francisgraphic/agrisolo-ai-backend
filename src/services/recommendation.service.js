const prisma = require("../config/prisma");
const axios = require("axios");
const { ai, MODEL } = require("../config/gemini");

async function recommendCrop(userId, farmId) {
  // Find farm
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  if (!farm.latitude || !farm.longitude) {
    throw new Error("Farm coordinates are missing.");
  }

  // Get weather from Open-Meteo
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${farm.latitude}` +
    `&longitude=${farm.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
    `&daily=precipitation_probability_max` +
    `&forecast_days=1&timezone=auto`;

  const weather = await axios.get(weatherUrl);

  const current = weather.data.current;
  const daily = weather.data.daily;

  const prompt = `
You are an expert agricultural consultant.

Farm Information

Country: ${farm.country}
State: ${farm.state}
Soil Type: ${farm.soilType || "Unknown"}
Farm Size: ${farm.farmSize || "Unknown"} hectares
Current Crop: ${farm.cropType || "None"}

Weather

Temperature: ${current.temperature_2m}°C
Humidity: ${current.relative_humidity_2m}%
Wind Speed: ${current.wind_speed_10m} km/h
Rain Probability: ${daily.precipitation_probability_max[0]}%

Recommend the best crops for this farm.

Return ONLY valid JSON.

{
  "recommendedCrops": [],
  "avoidCrops": [],
  "reason": "",
  "plantingWindow": "",
  "fertilizer": "",
  "irrigation": "",
  "expectedRisk": "",
  "profitability": ""
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let text = response.text;

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const recommendation = JSON.parse(text);

  return {
    farm,
    weather: {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      rainProbability: daily.precipitation_probability_max[0],
    },
    recommendation,
  };
}

module.exports = {
  recommendCrop,
};