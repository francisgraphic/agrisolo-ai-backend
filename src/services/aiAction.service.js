const prisma = require("../config/prisma");
const { ai, MODEL } = require("../config/gemini");

async function generateAITasks(userId, farmId) {
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

  const prompt = `
You are Agrisolo AI.

You manage farms automatically.

Farm:

Name: ${farm.name}
Crop: ${farm.cropType}
Country: ${farm.country}
State: ${farm.state}
Soil: ${farm.soilType}
Farm Size: ${farm.farmSize}

Recent Disease Analyses:

${JSON.stringify(farm.analyses)}

Existing Tasks:

${farm.tasks.map(t => `${t.title} (${t.status})`).join("\n")}

Generate NEW tasks ONLY if necessary.

Return ONLY JSON.

[
{
"title":"",
"description":"",
"priority":"High",
"dueInDays":3
}
]
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

  let tasks = [];

  try {
    tasks = JSON.parse(raw);
  } catch (err) {
    console.log("Invalid AI Task JSON");
    return [];
  }

  for (const task of tasks) {

    const exists = await prisma.task.findFirst({
      where: {
        farmId,
        title: task.title,
        status: {
          not: "Completed",
        },
      },
    });

    if (exists) continue;

    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate() + (task.dueInDays || 1)
    );

    await prisma.task.create({
      data: {
        farmId,
        title: task.title,
        description: task.description,
        priority: task.priority || "Medium",
        dueDate,
      },
    });
  }

  return tasks;
}

module.exports = {
  generateAITasks,
};