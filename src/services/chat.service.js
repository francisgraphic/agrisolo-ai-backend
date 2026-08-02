const activityLogger = require("./activityLogger.service");
const contextBuilder = require("./contextBuilder.service");
const memoryExtractor = require("./memoryExtractor.service");
const farmMemory = require("./farmMemory.service");
const prisma = require("../config/prisma");
const { ai, MODEL } = require("../config/gemini");

async function sendMessage(userId, farmId, message, chatId = null) {
  let chat;

  // Create a new chat if one doesn't exist
  if (!chatId) {
    chat = await prisma.chat.create({
      data: {
        title: message.substring(0, 50),
        userId,
        farmId,
      },
    });
  } else {
    chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
        farmId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found.");
    }
  }

  // Save user's message
  await prisma.chatMessage.create({
    data: {
      role: "user",
      content: message,
      chatId: chat.id,
    },
  });

  // Load conversation history
  const history = await prisma.chatMessage.findMany({
    where: {
      chatId: chat.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const memories = await farmMemory.getMemory(farmId, 20);
  const memorySummary =
  contextBuilder.buildContext(farm, memories);

  // Load recent farm activity
  const recentActivity = await activityLogger.getRecentActivity(
    farmId,
    15
  );

  const activityContext = recentActivity
    .map((activity) => {
      return `• ${activity.createdAt.toLocaleString()} | ${activity.type} | ${activity.title} | ${activity.message}`;
    })
    .join("\n");

  // Load farm details
  const farm = await prisma.farm.findUnique({
    where: {
      id: farmId,
    },
  });

  // System prompt
  const systemPrompt = `
You are Agrisolo AI.

You are an intelligent agricultural assistant.

You remember previous farm activities and use them when giving advice.

Current Farm

Farm Name: ${farm?.name}

Crop: ${farm?.cropType || "Unknown"}

Country: ${farm?.country}

State: ${farm?.state}

Soil Type: ${farm?.soilType || "Unknown"}

Farm Size: ${farm?.farmSize || "Unknown"} hectares

------------------------------------

Recent Farm Activity

${activityContext || "No recent activity."}

------------------------------------

Instructions

Always consider previous activities before answering.

If irrigation happened yesterday,
do not recommend irrigating again unless necessary.

If fertilizer was recently applied,
avoid recommending another fertilizer immediately.

If disease diagnosis was performed recently,
use that information in future recommendations.

Respond naturally like an experienced agronomist who has been managing this farm for months.
`;

const extractedMemories =
  memoryExtractor.extractMemory(reply);

if (extractedMemories.length > 0) {

  for (const memory of extractedMemories) {

    await farmMemory.saveMemory({
      farmId,
      role: "assistant",
      title: memory.title,
      message: memory.message,
      eventType: memory.eventType,
    });

  }

} else {

  await farmMemory.saveMemory({
    farmId,
    role: "assistant",
    title: "AI Recommendation",
    message: reply,
    eventType: "conversation",
  });

}
await farmMemory.saveMemory({
  farmId,
  role: "user",
  title: "Farmer Question",
  message,
  eventType: "conversation",
});

  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },

    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  ];

  // Ask Gemini
  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
  });

  const reply = response.text;

  // Save AI reply
  await prisma.chatMessage.create({
    data: {
      role: "assistant",
      content: reply,
      chatId: chat.id,
    },
  });

  return {
    chatId: chat.id,
    reply,
  };
}

async function getChats(userId) {
  return prisma.chat.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

async function getChat(userId, chatId) {
  return prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

async function deleteChat(userId, chatId) {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
    },
  });

  if (!chat) {
    throw new Error("Chat not found.");
  }

  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  return {
    message: "Chat deleted successfully.",
  };
}

module.exports = {
  sendMessage,
  getChats,
  getChat,
  deleteChat,
};