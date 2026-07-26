const farmService = require("../services/farm.service");
const prisma = require("../config/prisma");

async function createFarm(req, res) {
  try {
    const farm = await farmService.createFarm(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: farm,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMyFarms(req, res) {
  try {
    const farms = await farmService.getMyFarms(req.user.id);

    res.json({
      success: true,
      data: farms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getFarm(req, res) {
  try {
    const farm = await farmService.getFarmById(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      data: farm,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateFarm(req, res) {
  try {
    const farm = await farmService.updateFarm(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: farm,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteFarm(req, res) {
  try {
    const result = await farmService.deleteFarm(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET FARM DASHBOARD
 */
async function getFarmDashboard(req, res) {
  try {
    const farm = await prisma.farm.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
      include: {
        analyses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found.",
      });
    }

    const analyses = farm.analyses;

    const healthy = analyses.filter(
      (a) => a.health.toLowerCase() === "healthy"
    ).length;

    const diseased = analyses.filter(
      (a) => a.health.toLowerCase() !== "healthy"
    ).length;

    res.json({
      success: true,
      data: {
        farm,
        statistics: {
          totalAnalyses: analyses.length,
          healthyCrops: healthy,
          diseasedCrops: diseased,
          latestAnalysis: analyses[0] || null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createFarm,
  getMyFarms,
  getFarm,
  updateFarm,
  deleteFarm,
  getFarmDashboard,
};