function generateWeatherRules({ farm, current, forecast }) {
  let riskLevel = "Low";
  let weatherAlert = "No severe weather expected.";
  let summary = "Weather conditions are generally favorable for farming.";
  let recommendations = [];

  const rain = current.rainProbability || 0;
  const humidity = current.humidity || 0;
  const temp = current.temperature || 0;
  const wind = current.windSpeed || 0;

  // ----------------------------
  // Rain
  // ----------------------------

  if (rain >= 80) {
    riskLevel = "High";
    weatherAlert = "Heavy rainfall expected within the next 24 hours.";

    recommendations.push(
      "Delay fertilizer application.",
      "Avoid pesticide spraying until rainfall subsides.",
      "Inspect drainage channels to prevent flooding."
    );
  } else if (rain >= 50) {
    riskLevel = "Medium";

    weatherAlert =
      "Moderate rainfall expected. Plan field activities carefully.";

    recommendations.push(
      "Monitor soil moisture.",
      "Avoid unnecessary irrigation."
    );
  }

  // ----------------------------
  // High Humidity
  // ----------------------------

  if (humidity >= 85) {
    if (riskLevel !== "High") riskLevel = "Medium";

    recommendations.push(
      "Monitor crops for fungal diseases."
    );
  }

  // ----------------------------
  // High Temperature
  // ----------------------------

  if (temp >= 35) {
    if (riskLevel !== "High") riskLevel = "Medium";

    recommendations.push(
      "Increase irrigation if soil is dry.",
      "Avoid fertilizer application during peak heat."
    );
  }

  // ----------------------------
  // Strong Wind
  // ----------------------------

  if (wind >= 30) {
    recommendations.push(
      "Avoid pesticide spraying because of strong winds."
    );
  }

  // ----------------------------
  // Crop-specific Rules
  // ----------------------------

  switch ((farm.cropType || "").toLowerCase()) {
    case "maize":
      if (humidity >= 85) {
        recommendations.push(
          "Scout for Leaf Blight and Rust.",
          "Inspect for Fall Armyworm damage."
        );
      }

      if (rain >= 70) {
        recommendations.push(
          "Ensure proper field drainage to reduce root diseases."
        );
      }

      break;

    case "cassava":
      if (rain >= 80) {
        recommendations.push(
          "Monitor for root rot after heavy rainfall."
        );
      }

      break;

    case "rice":
      recommendations.push(
        "Maintain water level appropriate for rice growth."
      );

      break;
  }

  // ----------------------------
  // Summary
  // ----------------------------

  if (recommendations.length === 0) {
    recommendations.push(
      "Continue routine farm monitoring."
    );
  }

  summary = recommendations[0];

  return {
    riskLevel,
    weatherAlert,
    summary,
    recommendations,
    priority:
      riskLevel === "High"
        ? "High"
        : riskLevel === "Medium"
        ? "Medium"
        : "Low",
  };
}

module.exports = {
  generateWeatherRules,
};