const prisma = require("../config/prisma");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all farms belonging to the user
    const farms = await prisma.farm.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
      },
    });

    const farmIds = farms.map((farm) => farm.id);

    const [
      totalFarms,
      totalTasks,
      completedTasks,
      pendingTasks,
      analyses,
      notifications,
      recentTasks,
      cropDistribution,
    ] = await Promise.all([
      prisma.farm.groupBy({
        by: ["cropType"],
        where: {
          ownerId: userId,
        },
        _count: {
          cropType: true,
        },
      }),
      prisma.farm.count({
        where: {
          ownerId: userId,
        },
      }),

      prisma.task.count({
        where: {
          farmId: {
            in: farmIds,
          },
        },
      }),

      prisma.task.count({
        where: {
          farmId: {
            in: farmIds,
          },
          status: "Completed",
        },
      }),

      prisma.task.count({
        where: {
          farmId: {
            in: farmIds,
          },
          NOT: {
            status: "Completed",
          },
        },
      }),

      prisma.analysis.count({
        where: {
          userId,
        },
      }),

      prisma.notification.count({
        where: {
          userId,
        },
      }),

      prisma.task.findMany({
        where: {
          farmId: {
            in: farmIds,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

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

        cropDistribution: cropDistribution.map((item) => ({
          crop: item.cropType || "Unknown",
          count: item._count,
        })),
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to load analytics",
    });
  }
};