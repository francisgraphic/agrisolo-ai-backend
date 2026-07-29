const axios = require("axios");
const prisma = require("../config/prisma");
const weatherAdvisor = require("./weatherAdvisor.service");

const WEATHER_CODES = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Freezing Drizzle",
  57: "Heavy Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  85: "Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Severe Thunderstorm with Hail",
};

async function getFarmWeather(userId, farmId) {
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

  if (farm.latitude == null || farm.longitude == null) {
    throw new Error("Farm coordinates are missing.");
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${farm.latitude}` +
    `&longitude=${farm.longitude}` +
    `&current=` +
    `temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=` +
    `weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&hourly=` +
    `temperature_2m,relative_humidity_2m,precipitation_probability` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const { data } = await axios.get(url);

  const current = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    description:
      WEATHER_CODES[data.current.weather_code] || "Unknown",
    rainProbability:
      data.daily.precipitation_probability_max?.[0] ?? 0,
  };

  const forecast = data.daily.time.map((date, index) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    description:
      WEATHER_CODES[data.daily.weather_code[index]] || "Unknown",
    temperatureMax: data.daily.temperature_2m_max[index],
    temperatureMin: data.daily.temperature_2m_min[index],
    rainProbability:
      data.daily.precipitation_probability_max[index],
  }));

  const hourly =
    data.hourly.time.map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      humidity: data.hourly.relative_humidity_2m[index],
      rainProbability:
        data.hourly.precipitation_probability[index],
    })) || [];

  // =====================================
  // AI Weather Recommendation
  // =====================================

  let advice;

  try {
    advice = await weatherAdvisor.generateWeatherAdvice({
      farm,
      current,
      forecast,
    });
  } catch (error) {
    console.error("Weather AI Error:", error);

    const message = error?.message || "";

    if (
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("429") ||
      message.toLowerCase().includes("quota")
    ) {
      advice = {
        summary:
          "AI weather recommendation is unavailable because today's AI request limit has been reached.",

        weatherAlert:
          "Weather alerts are temporarily unavailable.",

        riskLevel: "Unavailable",

        recommendations: [
          "Please try again tomorrow when the AI quota resets.",
        ],
      };
    } else {
      advice = {
        summary:
          "AI weather recommendation is temporarily unavailable.",

        weatherAlert:
          "Unable to generate weather alerts at this time.",

        riskLevel: "Unknown",

        recommendations: [
          "Weather data is still available.",
        ],
      };
    }
  }

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      cropType: farm.cropType,
      country: farm.country,
      state: farm.state,
      soilType: farm.soilType,
      farmSize: farm.farmSize,
      latitude: farm.latitude,
      longitude: farm.longitude,
    },

    current,

    forecast,

    hourly,

    advice,
  };
}

module.exports = {
  getFarmWeather,
};