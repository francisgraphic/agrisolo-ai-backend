function recommendFertilizer(farm, crop) {
  const soil = (farm.soilType || "").toLowerCase();
  const cropName = (crop || "").toLowerCase();

  const recommendation = {
    crop,
    fertilizer: "",
    applicationRate: "",
    applicationTime: "",
    organicAlternative: "",
    tips: [],
  };

  switch (cropName) {
    case "maize":
      recommendation.fertilizer = "NPK 15-15-15";
      recommendation.applicationRate = "200 kg/ha";
      recommendation.applicationTime = "2 weeks after planting";
      recommendation.organicAlternative = "Well-composted poultry manure";

      recommendation.tips.push(
        "Split fertilizer into two applications."
      );

      recommendation.tips.push(
        "Avoid applying fertilizer immediately before heavy rainfall."
      );
      break;

    case "cassava":
      recommendation.fertilizer = "NPK 12-12-17";
      recommendation.applicationRate = "400 kg/ha";
      recommendation.applicationTime = "4–6 weeks after planting";
      recommendation.organicAlternative = "Compost and poultry manure";
      break;

    case "rice":
      recommendation.fertilizer = "NPK 20-10-10";
      recommendation.applicationRate = "250 kg/ha";
      recommendation.applicationTime = "3 weeks after planting";
      recommendation.organicAlternative = "Rice husk compost";
      break;

    case "pepper":
      recommendation.fertilizer = "NPK 15-15-15";
      recommendation.applicationRate = "150 kg/ha";
      recommendation.applicationTime = "After transplanting";
      recommendation.organicAlternative = "Compost tea";
      break;

    case "tomato":
      recommendation.fertilizer = "NPK 15-15-15";
      recommendation.applicationRate = "180 kg/ha";
      recommendation.applicationTime = "2 weeks after transplanting";
      recommendation.organicAlternative = "Vermicompost";
      break;

    default:
      recommendation.fertilizer = "General NPK 15-15-15";
      recommendation.applicationRate = "Follow local extension recommendations";
      recommendation.applicationTime = "According to crop stage";
      recommendation.organicAlternative = "Well-decomposed compost";
  }

  if (soil.includes("sandy")) {
    recommendation.tips.push(
      "Sandy soils lose nutrients quickly. Apply fertilizer in smaller, more frequent doses."
    );
  }

  if (soil.includes("clay")) {
    recommendation.tips.push(
      "Clay soils retain nutrients longer. Avoid over-application."
    );
  }

  if (soil.includes("loamy")) {
    recommendation.tips.push(
      "Loamy soil has good nutrient retention and is ideal for balanced fertilization."
    );
  }

  return recommendation;
}

module.exports = {
  recommendFertilizer,
};