const prisma = require("../config/prisma");
const ai = require("../config/gemini");
const weatherService = require("./weather.service");
const notificationService = require("./notification.service");
const aiAction = require("./aiAction.service");

async function monitorFarm(userId, farmId) {
  // Load farm
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
      conversations: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  // Get Weather
  let weather = null;

  try {
    weather = await weatherService.getFarmWeather(userId, farmId);
  } catch (err) {
    console.log("Weather unavailable:", err.message);
  }

  // Task Statistics
  const completedTasks = farm.tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const pendingTasks = farm.tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  const overdueTasks = farm.tasks.filter((t) => {
    return (
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "Completed"
    );
  }).length;

  // Conversation Memory
  const memory = farm.conversations
    .map((c) => `${c.role}: ${c.message}`)
    .join("\n");

  // Gemini Prompt
  const prompt = `
You are Agrisolo AI.

You continuously monitor farms.

Decide whether the farmer should receive an AI notification today.

Farm:

Name: ${farm.name}
Country: ${farm.country}
State: ${farm.state}
Crop: ${farm.cropType}
Soil: ${farm.soilType}
Farm Size: ${farm.farmSize}

Weather:
${JSON.stringify(weather, null, 2)}

Tasks:
Completed: ${completedTasks}
Pending: ${pendingTasks}
Overdue: ${overdueTasks}

Recent Disease Analyses:
${JSON.stringify(farm.analyses, null, 2)}

Conversation Memory:
${memory}

Return ONLY valid JSON.

{
  "shouldNotify": true,
  "title": "",
  "message": "",
  "type": "AI"
}
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  let raw = response.text;

  raw = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let recommendation;

  try {
    recommendation = JSON.parse(raw);
  } catch (err) {
    console.log("Gemini returned invalid JSON");
    console.log(raw);

    return null;
  }

  if (!recommendation.shouldNotify) {
    return recommendation;
  }

  // Prevent duplicate notifications within 24 hours
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const duplicate = await prisma.notification.findFirst({
    where: {
      userId,
      farmId,
      title: recommendation.title,
      createdAt: {
        gte: yesterday,
      },
    },
  });

  if (duplicate) {
    return {
      skipped: true,
      reason: "Duplicate notification already exists.",
    };
  }

  // Save notification
  await notificationService.createNotification({
    userId,
    farmId,
    title: recommendation.title,
    message: recommendation.message,
    type: recommendation.type || "AI",
  });

  // Generate AI Tasks Automatically
  try {
    await aiAction.generateAITasks(userId, farmId);
  } catch (err) {
    console.log("AI Task Engine:", err.message);
  }

  return {
    success: true,
    notification: recommendation,
  };
}

async function monitorAllFarms(userId) {
  const farms = await prisma.farm.findMany({
    where: {
      ownerId: userId,
    },
  });

  const results = [];

  for (const farm of farms) {
    try {
      const result = await monitorFarm(userId, farm.id);

      results.push({
        farm: farm.name,
        result,
      });
    } catch (err) {
      results.push({
        farm: farm.name,
        error: err.message,
      });
    }
  }

  return results;
}

module.exports = {
  monitorFarm,
  monitorAllFarms,
};