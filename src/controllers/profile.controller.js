const prisma = require("../config/prisma");

exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const farms = await prisma.farm.count({
      where: {
        ownerId: userId,
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

    const tasks = await prisma.task.count({
      where: {
        farm: {
          ownerId: userId,
        },
      },
    });

    res.json({
      success: true,
      data: {
        farms,
        tasks,
        analyses,
        notifications,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to load profile statistics",
    });
  }
};