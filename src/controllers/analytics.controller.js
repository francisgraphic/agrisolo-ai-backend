const prisma = require("../config/prisma");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all farms owned by the user
    const farms = await prisma.farm.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
      },
    });

    const farmIds = farms.map((farm) => farm.id);

    const totalFarms = await prisma.farm.count({
      where: {
        ownerId: userId,
      },
    });

    const totalTasks = await prisma.task.count({
      where: {
        farmId: {
          in: farmIds,
        },
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        farmId: {
          in: farmIds,
        },
        status: "Completed",
      },
    });

    const pendingTasks = await prisma.task.count({
      where: {
        farmId: {
          in: farmIds,
        },
        NOT: {
          status: "Completed",
        },
      },
    });

    const analyses = await prisma.analysis.count({
      where: {
        userId,
      },
    });

    const notifications = await prisma.notification.count({
      where: {
        userId,
      },
    });

    const recentTasks = await prisma.task.findMany({
      where: {
        farmId: {
          in: farmIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const groupedCrops = await prisma.farm.groupBy({
      by: ["cropType"],
      where: {
        ownerId: userId,
      },
      _count: {
        _all: true,
      },
    });

    const cropDistribution = groupedCrops.map((item) => ({
      crop: item.cropType || "Unknown",
      count: item._count._all,
    }));

    res.json({
      success: true,
      data: {
        totalFarms,
        totalTasks,
        completedTasks,
        pendingTasks,
        analyses,
        notifications,
        recentTasks,
        cropDistribution,
      },
    });
  } catch (err) {
    console.error("Analytics Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to load analytics",
    });
  }
};