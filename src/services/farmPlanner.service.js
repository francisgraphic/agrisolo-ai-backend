const prisma = require("../config/prisma");
const ai = require("../config/gemini");

async function generatePlan(userId, farmId) {
  // Find the farm
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  const prompt = `
You are an expert agricultural project manager.

Create a COMPLETE farming calendar for this farm.

Farm Details:
- Farm Name: ${farm.name}
- Country: ${farm.country}
- State: ${farm.state}
- Farm Size: ${farm.farmSize} hectares
- Soil Type: ${farm.soilType}
- Crop: ${farm.cropType || "Recommend the best crop"}

Return ONLY valid JSON.

Example:

[
  {
    "title":"Land Preparation",
    "description":"Clear bushes and prepare the land.",
    "priority":"High",
    "daysFromToday":0
  }
]

Do not include markdown.
Do not explain anything.
Return ONLY the JSON array.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  let raw = response.text;

  // Remove markdown formatting if Gemini wraps the JSON
  raw = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let plan;

  try {
    plan = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON returned by Gemini:");
    console.error(raw);

    throw new Error("AI returned an invalid farming plan.");
  }

  // OPTIONAL:
  // Delete existing tasks before creating a new plan
  // Comment this block if you prefer to keep previous tasks.
  await prisma.task.deleteMany({
    where: {
      farmId,
    },
  });

  const createdTasks = [];

  for (const activity of plan) {
    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate() + (activity.daysFromToday || 0)
    );

    const task = await prisma.task.create({
      data: {
        title: activity.title,
        description: activity.description,
        priority: activity.priority || "Medium",
        status: "Pending",
        progress: 0,
        dueDate,
        farmId,
      },
    });

    createdTasks.push(task);
  }

  return {
    generatedPlan: plan,
    createdTasks,
  };
}

module.exports = {
  generatePlan,
};