const axios = require("axios");
const prisma = require("../config/prisma");
const {
  recommendCrops,
} = require("../utils/cropRecommendation");

async function getCropRecommendations(userId, farmId) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${farm.latitude}&longitude=${farm.longitude}&current=temperature_2m&daily=precipitation_probability_max&forecast_days=1&timezone=auto`;

  const response = await axios.get(url);

  const recommendations = recommendCrops(
    farm,
    response.data
  );

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      soilType: farm.soilType,
      country: farm.country,
      state: farm.state,
    },
    weather: response.data.current,
    recommendations,
  };
}

module.exports = {
  getCropRecommendations,
};