const axios = require("axios");
const prisma = require("../config/prisma");
const { predictDiseases } = require("../utils/diseasePrediction");

async function getDiseasePrediction(userId, farmId, crop) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${farm.latitude}&longitude=${farm.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=precipitation_probability_max&forecast_days=1&timezone=auto`;

  const response = await axios.get(url);

  const prediction = predictDiseases(
    farm,
    response.data,
    crop
  );

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      country: farm.country,
      state: farm.state,
      soilType: farm.soilType,
    },
    weather: {
      temperature: response.data.current.temperature_2m,
      humidity: response.data.current.relative_humidity_2m,
      windSpeed: response.data.current.wind_speed_10m,
      rainProbability:
        response.data.daily.precipitation_probability_max[0],
    },
    prediction,
  };
}

module.exports = {
  getDiseasePrediction,
};