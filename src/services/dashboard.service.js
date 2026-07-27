const prisma = require("../config/prisma");
const { ai, MODEL } = require("../config/gemini");
const notificationService = require("./notification.service");

async function getDashboard(userId, farmId) {
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

  // Generate latest notifications
  await notificationService.generateNotifications(userId, farmId);

  const notifications =
    await notificationService.getNotifications(userId);

  const totalTasks = farm.tasks.length;

  const completedTasks = farm.tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const pendingTasks = farm.tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  const inProgressTasks = farm.tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const overdueTasks = farm.tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed"
  ).length;

  const highPriorityTasks = farm.tasks.filter(
    (t) => t.priority === "High"
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  // ===========================
  // FARM HEALTH SCORE
  // ===========================

  let farmHealthScore = 100;

  farmHealthScore -= overdueTasks * 10;
  farmHealthScore -= pendingTasks * 2;
  farmHealthScore -= farm.analyses.length * 3;

  if (farmHealthScore < 0) farmHealthScore = 0;
  if (farmHealthScore > 100) farmHealthScore = 100;

  let farmHealthStatus = "Excellent";

  if (farmHealthScore < 80)
    farmHealthStatus = "Good";

  if (farmHealthScore < 60)
    farmHealthStatus = "Fair";

  if (farmHealthScore < 40)
    farmHealthStatus = "Poor";

  // ===========================

  const nextTask =
    farm.tasks
      .filter((task) => task.status !== "Completed")
      .sort(
        (a, b) =>
          new Date(a.dueDate || 0) -
          new Date(b.dueDate || 0)
      )[0] || null;

  const prompt = `
You are Agrisolo AI.

Generate intelligent farming recommendations.

Farm

Name: ${farm.name}

Country: ${farm.country}

State: ${farm.state}

Crop: ${farm.cropType || "Unknown"}

Farm Size: ${farm.farmSize || "Unknown"}

Soil Type: ${farm.soilType || "Unknown"}

Farm Health Score:
${farmHealthScore}/100

Tasks

Completed: ${completedTasks}

Pending: ${pendingTasks}

In Progress: ${inProgressTasks}

Overdue: ${overdueTasks}

High Priority: ${highPriorityTasks}

Completion:
${completionPercentage}%

Recent Disease Analysis

${JSON.stringify(farm.analyses)}

Return ONLY JSON.

{
 "summary":"",
 "priority":"Low",
 "recommendations":[
   "",
   "",
   ""
 ]
}

Rules

Return ONLY JSON.

recommendations must contain exactly 3 items.

priority must be Low Medium or High.
`;

  let aiAdvice;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    let raw = response.text;

    raw = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    aiAdvice = JSON.parse(raw);
  } catch (err) {
    console.error(err);

    aiAdvice = {
      summary:
        "Your farm is progressing normally.",

      priority: "Medium",

      recommendations: [
        "Complete pending tasks.",
        "Inspect crops this week.",
        "Monitor disease symptoms."
      ],
    };
  }

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      cropType: farm.cropType,
      farmSize: farm.farmSize,
      soilType: farm.soilType,
      country: farm.country,
      state: farm.state,
    },

    farmHealth: {
      score: farmHealthScore,
      status: farmHealthStatus,
    },

    statistics: {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      highPriorityTasks,
      completionPercentage,
    },

    nextTask,

    recentAnalyses: farm.analyses,

    ai: aiAdvice,

    notifications,
  };
}

module.exports = {
  getDashboard,
};