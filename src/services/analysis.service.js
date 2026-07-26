const weatherService = require("./weather.service");
const cropService = require("./crop.service");
const fertilizerService = require("./fertilizer.service");
const diseaseService = require("./disease.service");

async function getFarmAnalysis(userId, farmId) {
  const weather = await weatherService.getFarmWeather(userId, farmId);

  const cropData = await cropService.getCropRecommendations(
    userId,
    farmId
  );

  const bestCrop =
    cropData.recommendations[0]?.crop || "Maize";

  const fertilizer =
    await fertilizerService.getFertilizerRecommendation(
      userId,
      farmId,
      bestCrop
    );

  const disease =
    await diseaseService.getDiseasePrediction(
      userId,
      farmId,
      bestCrop
    );

  return {
    farm: weather.farm,
    weather: weather.currentWeather,
    forecast: weather.forecast,
    cropRecommendations: cropData.recommendations,
    fertilizer: fertilizer.recommendation,
    diseaseRisk: disease.prediction,
    aiSummary: `Based on current weather and soil conditions, ${bestCrop} is the best crop for this farm. Apply ${fertilizer.recommendation.fertilizer} according to the recommended schedule. Disease risk is currently ${disease.prediction.riskLevel}. Monitor your farm regularly and follow the recommended preventive actions.`,
  };
}

module.exports = {
  getFarmAnalysis,
};