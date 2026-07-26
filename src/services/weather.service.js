const axios = require("axios");
const prisma = require("../config/prisma");
const weatherAdvisor = require("./weatherAdvisor.service");

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

  if (!farm.latitude || !farm.longitude) {
    throw new Error("Farm coordinates are missing.");
  }

  // Open-Meteo
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${farm.latitude}&longitude=${farm.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`;

  const { data } = await axios.get(url);

  // Simplified weather object
  const weather = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    rainProbability:
      data.daily.precipitation_probability_max[0] ?? 0,
  };

  // Gemini AI farming advice
  const advice = await weatherAdvisor.generateWeatherAdvice(weather);

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      country: farm.country,
      state: farm.state,
      latitude: farm.latitude,
      longitude: farm.longitude,
      soilType: farm.soilType,
      farmSize: farm.farmSize,
    },

    weather,

    forecast: data.daily,

    advice,
  };
}

module.exports = {
  getFarmWeather,
};