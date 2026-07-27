const prisma = require("../config/prisma");
const { ai, MODEL } = require("../config/gemini");
const weatherService = require("./weather.service");
const aiRouter = require("./aiRouter.service");

const weatherExpert = require("../ai/weatherExpert");
const diseaseExpert = require("../ai/diseaseExpert");
const plannerExpert = require("../ai/plannerExpert");
const marketExpert = require("../ai/marketExpert");
const generalExpert = require("../ai/generalExpert");

async function chatWithFarm(userId, farmId, message) {
  // Verify farm ownership
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

  // Save user's message
  await prisma.farmConversation.create({
    data: {
      farmId,
      role: "user",
      message,
    },
  });

  // Load conversation memory
  const history = await prisma.farmConversation.findMany({
    where: {
      farmId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });

  // Get weather
  let weather = null;

  try {
    weather = await weatherService.getFarmWeather(userId, farmId);
  } catch (err) {
    console.log("Weather unavailable:", err.message);
  }

  // Task statistics
  const completedTasks = farm.tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const pendingTasks = farm.tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  const overdueTasks = farm.tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "Completed"
  ).length;

  // Recent notifications
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      farmId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Conversation history
  const conversation = history
    .map((item) => `${item.role}: ${item.message}`)
    .join("\n");

  // Determine the best AI expert
  const expert = await aiRouter.determineExpert(message);

  let systemPrompt = generalExpert;

  switch (expert) {
    case "WEATHER":
      systemPrompt = weatherExpert;
      break;

    case "DISEASE":
      systemPrompt = diseaseExpert;
      break;

    case "PLANNER":
      systemPrompt = plannerExpert;
      break;

    case "MARKET":
      systemPrompt = marketExpert;
      break;

    default:
      systemPrompt = generalExpert;
  }

  // Final Gemini prompt
  const prompt = `
${systemPrompt}

You are Agrisolo AI.

You are an intelligent autonomous farming assistant.

Use the complete farm context, weather, task history,
disease analyses, notifications and conversation memory
to answer naturally.

=========================
FARM
=========================
Farm: ${farm.name}
Country: ${farm.country}
State: ${farm.state}
Crop: ${farm.cropType || "Unknown"}
Soil: ${farm.soilType || "Unknown"}
Farm Size: ${farm.farmSize || "Unknown"} hectares

=========================
TASKS
=========================
Completed: ${completedTasks}
Pending: ${pendingTasks}
Overdue: ${overdueTasks}

=========================
DISEASE ANALYSES
=========================
${JSON.stringify(farm.analyses, null, 2)}

=========================
RECENT NOTIFICATIONS
=========================
${
  notifications.length
    ? notifications
        .map((n) => `${n.title}: ${n.message}`)
        .join("\n")
    : "None"
}

=========================
WEATHER
=========================
${
  weather
    ? `
Temperature: ${weather.weather.temperature}°C
Humidity: ${weather.weather.humidity}%
Rain Probability: ${weather.weather.rainProbability}%
Wind Speed: ${weather.weather.windSpeed} km/h
`
    : "Unavailable"
}

=========================
CONVERSATION MEMORY
=========================
${conversation}

=========================
LATEST USER MESSAGE
=========================
${message}

Instructions:
- Answer naturally.
- Be concise but practical.
- Maintain conversation memory.
- Never contradict previous answers unless new information requires it.
- If weather affects the answer, explain why.
- If tasks are overdue, mention them where relevant.
- If disease history is relevant, include it.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const reply = response.text.trim();

  // Save AI response
  await prisma.farmConversation.create({
    data: {
      farmId,
      role: "assistant",
      message: reply,
    },
  });

  return {
    expert,
    reply,
  };
}

module.exports = {
  chatWithFarm,
};