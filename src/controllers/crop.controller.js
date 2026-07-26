const cropService = require("../services/crop.service");

async function getRecommendations(req, res) {
  try {
    const result = await cropService.getCropRecommendations(
      req.user.id,
      req.params.farmId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getRecommendations,
};