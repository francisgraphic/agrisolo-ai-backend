function recommendCrops(farm, weather) {
  const recommendations = [];

  const rain =
    weather.daily.precipitation_probability_max[0];

  const temperature =
    weather.current.temperature_2m;

  const soil = (farm.soilType || "").toLowerCase();

  // Maize
  if (
    soil.includes("loamy") &&
    rain >= 60 &&
    temperature >= 20 &&
    temperature <= 32
  ) {
    recommendations.push({
      crop: "Maize",
      confidence: 95,
      reason:
        "Loamy soil, adequate rainfall and ideal temperature."
    });
  }

  // Cassava
  if (
    rain >= 50 &&
    temperature >= 24
  ) {
    recommendations.push({
      crop: "Cassava",
      confidence: 93,
      reason:
        "Warm tropical weather with sufficient rainfall."
    });
  }

  // Rice
  if (
    rain >= 80
  ) {
    recommendations.push({
      crop: "Rice",
      confidence: 92,
      reason:
        "High rainfall makes conditions suitable for rice cultivation."
    });
  }

  // Pepper
  if (
    temperature >= 22 &&
    temperature <= 30
  ) {
    recommendations.push({
      crop: "Pepper",
      confidence: 90,
      reason:
        "Warm temperatures support healthy pepper growth."
    });
  }

  // Tomato
  if (
    temperature >= 20 &&
    temperature <= 28 &&
    rain < 80
  ) {
    recommendations.push({
      crop: "Tomato",
      confidence: 85,
      reason:
        "Moderate temperatures with manageable rainfall."
    });
  }

  recommendations.sort(
    (a, b) => b.confidence - a.confidence
  );

  return recommendations;
}

module.exports = {
  recommendCrops,
};