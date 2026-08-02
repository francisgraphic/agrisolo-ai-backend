function extractMemory(text) {
  const memories = [];

  const lower = text.toLowerCase();

  // Fertilizer
  if (
    lower.includes("fertilizer") ||
    lower.includes("npk") ||
    lower.includes("urea")
  ) {
    memories.push({
      title: "Fertilizer Recommendation",
      eventType: "fertilizer",
      message: text,
    });
  }

  // Irrigation
  if (
    lower.includes("irrigation") ||
    lower.includes("water")
  ) {
    memories.push({
      title: "Irrigation Advice",
      eventType: "irrigation",
      message: text,
    });
  }

  // Disease
  if (
    lower.includes("disease") ||
    lower.includes("blight") ||
    lower.includes("rust") ||
    lower.includes("armyworm") ||
    lower.includes("virus")
  ) {
    memories.push({
      title: "Disease Advisory",
      eventType: "disease",
      message: text,
    });
  }

  // Weather
  if (
    lower.includes("rain") ||
    lower.includes("humidity") ||
    lower.includes("storm") ||
    lower.includes("weather")
  ) {
    memories.push({
      title: "Weather Advice",
      eventType: "weather",
      message: text,
    });
  }

  // Harvest
  if (
    lower.includes("harvest")
  ) {
    memories.push({
      title: "Harvest Recommendation",
      eventType: "harvest",
      message: text,
    });
  }

  // Planting
  if (
    lower.includes("plant")
  ) {
    memories.push({
      title: "Planting Recommendation",
      eventType: "planting",
      message: text,
    });
  }

  return memories;
}

module.exports = {
  extractMemory,
};