const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getHistory(userId) {
  return prisma.analysis.findMany({
    where: {
      userId,
    },
    include: {
      farm: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getSingleAnalysis(userId, id) {
  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      farm: true,
    },
  });

  if (!analysis) {
    throw new Error("Analysis not found.");
  }

  return analysis;
}

async function deleteAnalysis(userId, id) {
  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!analysis) {
    throw new Error("Analysis not found.");
  }

  await prisma.analysis.delete({
    where: {
      id,
    },
  });

  return {
    message: "Analysis deleted successfully.",
  };
}

module.exports = {
  getHistory,
  getSingleAnalysis,
  deleteAnalysis,
};