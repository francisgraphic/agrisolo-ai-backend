const prisma = require("../config/prisma");
const { ai, MODEL } = require("../config/gemini");

async function sendMessage(userId, message, chatId = null) {
  let chat;

  // Create a new chat if one doesn't exist
  if (!chatId) {
    chat = await prisma.chat.create({
      data: {
        title: message.substring(0, 50),
        userId,
      },
    });
  } else {
    chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
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

  // Load full conversation history
  const history = await prisma.chatMessage.findMany({
    where: {
      chatId: chat.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Convert to Gemini conversation format
  const contents = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

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

  // Update chat timestamp
  await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {},
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