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

  // Load farm details
  const farm = await prisma.farm.findUnique({
    where: {
      id: farmId,
    },
  });

  // System prompt
  const systemPrompt = `
You are Agrisolo AI, an expert agricultural assistant.

Your goal is to help farmers improve productivity through practical,
accurate and locally relevant agricultural advice.

Current Farm

Farm Name: ${farm?.name || "Unknown"}
Crop: ${farm?.cropType || "Unknown"}
Location: ${farm?.state || ""}, ${farm?.country || ""}
Soil Type: ${farm?.soilType || "Unknown"}
Farm Size: ${farm?.farmSize || "Unknown"} hectares

Always use this information when giving recommendations.
If information is missing, ask questions before making assumptions.
`;

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