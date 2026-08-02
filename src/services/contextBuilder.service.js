function buildContext(farm, memories) {
  const latest = {};

  memories.forEach((memory) => {
    if (!latest[memory.eventType]) {
      latest[memory.eventType] = memory;
    }
  });

  return `
Farm Information

Farm Name: ${farm.name}
Crop: ${farm.cropType}
Location: ${farm.state}, ${farm.country}
Soil: ${farm.soilType}
Farm Size: ${farm.farmSize} hectares

Previous Farm Activities

Latest Disease:
${latest.disease?.message || "None"}

Latest Fertilizer:
${latest.fertilizer?.message || "None"}

Latest Irrigation:
${latest.irrigation?.message || "None"}

Latest Weather Advice:
${latest.weather?.message || "None"}

Latest Harvest Advice:
${latest.harvest?.message || "None"}

Latest Planting Advice:
${latest.planting?.message || "None"}

General Conversation

${latest.conversation?.message || "None"}
`;
}

module.exports = {
  buildContext,
};