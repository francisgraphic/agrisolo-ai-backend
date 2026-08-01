const prisma = require("../config/prisma");

exports.saveMessage = async (farmId, role, message) => {
  return prisma.farmConversation.create({
    data: {
      farmId,
      role,
      message,
    },
  });
};

exports.getRecentMemory = async (farmId, limit = 20) => {
  return prisma.farmConversation.findMany({
    where: {
      farmId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: limit,
  });
};

exports.clearMemory = async (farmId) => {
  return prisma.farmConversation.deleteMany({
    where: {
      farmId,
    },
  });
};