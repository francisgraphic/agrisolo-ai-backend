const prisma = require("../config/prisma");

async function createFarm(userId, data) {
  return prisma.farm.create({
    data: {
      name: data.name,
      description: data.description,
      country: data.country,
      state: data.state,
      lga: data.lga,
      community: data.community,
      latitude: data.latitude,
      longitude: data.longitude,
      farmSize: data.farmSize,
      soilType: data.soilType,
      irrigation: data.irrigation,
      cropType: data.cropType,
      image: data.image,
      ownerId: userId,
    },
  });
}

async function getMyFarms(userId) {
  return prisma.farm.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getFarmById(userId, farmId) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  return farm;
}

async function updateFarm(userId, farmId, data) {
  await getFarmById(userId, farmId);

  return prisma.farm.update({
    where: {
      id: farmId,
    },
    data,
  });
}

async function deleteFarm(userId, farmId) {
  await getFarmById(userId, farmId);

  await prisma.farm.delete({
    where: {
      id: farmId,
    },
  });

  return {
    message: "Farm deleted successfully.",
  };
}

module.exports = {
  createFarm,
  getMyFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
};