const prisma = require("../config/prisma");
const { ai, MODEL } = require("../config/gemini");

async function generateNotifications(userId, farmId) {
  // Find farm
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
    include: {
      tasks: true,
      analyses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  const pendingTasks = farm.tasks.filter(
    (task) => task.status !== "Completed"
  );

  const completedTasks = farm.tasks.filter(
    (task) => task.status === "Completed"
  );

  const prompt = `
You are Agrisolo AI.

You are an expert agronomist.

Generate helpful notifications for this farmer.

Farm:

Name: ${farm.name}

Country: ${farm.country}

State: ${farm.state}

Soil: ${farm.soilType}

Farm Size: ${farm.farmSize}

Crop: ${farm.cropType}

Pending Tasks: ${pendingTasks.length}

Completed Tasks: ${completedTasks.length}

Recent Disease Analyses:

${JSON.stringify(farm.analyses)}

Return ONLY JSON.

Example:

[
{
"title":"Heavy Rain Expected",
"message":"Delay fertilizer application until rainfall stops.",
"type":"Weather"
},
{
"title":"Overdue Task",
"message":"Complete land preparation this week.",
"type":"Task"
}
]

Types:

Info
Warning
Success
Weather
Disease
Task

Return only JSON.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let raw = response.text;

  raw = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const notifications = JSON.parse(raw);

  return notifications;
}

module.exports = {
  generateNotifications,
};