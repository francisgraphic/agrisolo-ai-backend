function predictDiseases(farm, weather, crop) {
  const diseases = [];
  const recommendations = [];

  const humidity = weather.current.relative_humidity_2m;
  const temperature = weather.current.temperature_2m;
  const rainfall =
    weather.daily.precipitation_probability_max[0];

  const cropName = (crop || "").toLowerCase();

  let riskLevel = "LOW";

  if (humidity >= 90 && rainfall >= 80) {
    riskLevel = "HIGH";

    diseases.push({
      name: "Leaf Blight",
      risk: 95,
      reason: "High humidity and heavy rainfall."
    });

    diseases.push({
      name: "Root Rot",
      risk: 92,
      reason: "Wet soil conditions."
    });

    recommendations.push(
      "Inspect crops every morning."
    );

    recommendations.push(
      "Improve field drainage."
    );

    recommendations.push(
      "Delay irrigation until soil dries."
    );
  }

  if (
    temperature >= 24 &&
    temperature <= 30 &&
    humidity >= 85
  ) {
    diseases.push({
      name: "Downy Mildew",
      risk: 88,
      reason: "Warm humid conditions."
    });

    recommendations.push(
      "Increase air circulation between plants."
    );
  }

  if (cropName === "maize") {
    diseases.push({
      name: "Maize Rust",
      risk: 70,
      reason: "Common disease during humid seasons."
    });
  }

  if (cropName === "cassava") {
    diseases.push({
      name: "Cassava Mosaic Disease",
      risk: 65,
      reason: "Monitor for whiteflies and infected plants."
    });
  }

  return {
    riskLevel,
    diseases,
    recommendations,
  };
}

module.exports = {
  predictDiseases,
};