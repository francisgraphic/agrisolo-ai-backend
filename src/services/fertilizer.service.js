const prisma = require("../config/prisma");
const { recommendFertilizer } = require("../utils/fertilizerRecommendation");

async function getFertilizerRecommendation(userId, farmId, crop) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  const recommendation = recommendFertilizer(farm, crop);

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      soilType: farm.soilType,
      country: farm.country,
      state: farm.state,
    },
    recommendation,
  };
}

module.exports = {
  getFertilizerRecommendation,
};